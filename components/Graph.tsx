"use client";
// A small dependency-free force-directed graph on a canvas, drawn flat:
// notes are solid dots sized by how connected they are, wikilinks are
// hairlines, and a faint dot grid pans underneath for spatial feedback.
// Drag to rearrange, scroll/pinch to zoom, click/tap a dot to open the
// note. Pass `focus` to show just one note and its neighbours.
import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import type { GraphEdge, GraphNode } from "@/lib/notes";

// colors are assigned to whatever domains the vault contains, in alphabetical
// order, so the palette needs no per-vault configuration.
const COLORS = ["#7aa2f7", "#bb9af7", "#7dcfff", "#9ece6a", "#e0af68", "#f7768e", "#ff9e64", "#b4f9f8"];
const FALLBACK = "#9aa5ce";

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

export default function Graph({
  nodes: rawNodes,
  edges: rawEdges,
  focus = null,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  focus?: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const colorFor = useMemo(() => {
    const domains = [...new Set(rawNodes.map((n) => n.domain))]
      .filter((d) => d !== "other")
      .sort();
    const byDomain = new Map(domains.map((d, i) => [d, COLORS[i % COLORS.length]]));
    return (domain: string) => byDomain.get(domain) || FALLBACK;
  }, [rawNodes]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // copy data; if focused, keep only the note and its neighbours
    let nodes: SimNode[] = rawNodes.map((n) => ({ ...n, x: 0, y: 0, vx: 0, vy: 0 }));
    let edges = rawEdges.map((e) => ({ ...e }));
    if (focus) {
      const keep = new Set([focus]);
      edges.forEach((e) => {
        if (e.source === focus) keep.add(e.target);
        if (e.target === focus) keep.add(e.source);
      });
      nodes = nodes.filter((n) => keep.has(n.id));
      edges = edges.filter((e) => keep.has(e.source) && keep.has(e.target));
    }
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    edges = edges.filter((e) => byId[e.source] && byId[e.target]);

    const W = () => canvas.clientWidth;
    const H = () => canvas.clientHeight;
    // spread the starting ring so nodes don't begin on top of each other —
    // tightly packed nodes generate enormous repulsion on the first frames.
    const spread = Math.max(130, nodes.length * 9);
    nodes.forEach((n, i) => {
      const a = (i / Math.max(nodes.length, 1)) * Math.PI * 2;
      n.x = W() / 2 + Math.cos(a) * spread + (Math.random() - 0.5) * 30;
      n.y = H() / 2 + Math.sin(a) * spread + (Math.random() - 0.5) * 30;
    });

    const view = { x: 0, y: 0, k: focus ? 1 : 0.85 };
    let hover: SimNode | null = null;
    let drag: SimNode | null = null;
    let panning = false;
    let last: { x: number; y: number } | null = null;
    let moved = false;
    let alpha = 0.35; // current simulation energy; eased up to `alphaCap`
    let warmup = 0; // frames elapsed, used to ramp energy in gently
    const alphaCap = 1;
    let raf = 0;

    const radius = (n: SimNode) => 1.6 + Math.sqrt(n.degree || 1) * 1.1;
    const toScreen = (n: { x: number; y: number }) => ({
      x: (n.x - W() / 2) * view.k + W() / 2 + view.x,
      y: (n.y - H() / 2) * view.k + H() / 2 + view.y,
    });
    const fromScreen = (px: number, py: number) => ({
      x: (px - view.x - W() / 2) / view.k + W() / 2,
      y: (py - view.y - H() / 2) / view.k + H() / 2,
    });
    function nodeAt(px: number, py: number) {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const s = toScreen(nodes[i]);
        const r = radius(nodes[i]) * view.k + 10;
        if ((px - s.x) ** 2 + (py - s.y) ** 2 <= r * r) return nodes[i];
      }
      return null;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function step() {
      if (alpha < 0.02) return;
      // ramp energy up over the first ~60 frames so the layout settles into
      // motion instead of exploding outward the instant it appears.
      if (warmup < 60) {
        warmup++;
        alpha = Math.min(alphaCap, alpha + (alphaCap - 0.35) / 60);
      }
      const cx = W() / 2;
      const cy = H() / 2;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          const d2 = dx * dx + dy * dy + 0.01;
          const d = Math.sqrt(d2);
          const f = (2600 / d2) * alpha;
          dx /= d;
          dy /= d;
          a.vx += dx * f;
          a.vy += dy * f;
          b.vx -= dx * f;
          b.vy -= dy * f;
        }
      }
      edges.forEach((e) => {
        const a = byId[e.source];
        const b = byId[e.target];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const f = (d - 95) * 0.012 * alpha;
        dx /= d;
        dy /= d;
        a.vx += dx * f;
        a.vy += dy * f;
        b.vx -= dx * f;
        b.vy -= dy * f;
      });
      // cap speed so a momentary force spike can't fling a node across the
      // canvas — this is what keeps the opening frames calm.
      const maxV = 14;
      nodes.forEach((n) => {
        n.vx += (cx - n.x) * 0.004 * alpha;
        n.vy += (cy - n.y) * 0.004 * alpha;
        n.vx *= 0.86;
        n.vy *= 0.86;
        const speed = Math.hypot(n.vx, n.vy);
        if (speed > maxV) {
          n.vx = (n.vx / speed) * maxV;
          n.vy = (n.vy / speed) * maxV;
        }
        if (n !== drag) {
          n.x += n.vx;
          n.y += n.vy;
        }
      });
      alpha *= 0.992;
    }

    function draw() {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      // dot grid in screen space, offset by the pan so the canvas reads as an
      // infinite surface without the cost of drawing a world-sized grid
      const sp = 26;
      const ox = ((view.x % sp) + sp) % sp;
      const oy = ((view.y % sp) + sp) % sp;
      ctx.fillStyle = cssVar("--graph-grid", "rgba(140,150,190,.12)");
      for (let x = ox; x < w; x += sp)
        for (let y = oy; y < h; y += sp) ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);

      const edgeCol = cssVar("--graph-edge", "rgba(140,150,190,.25)");
      const labelCol = cssVar("--graph-label", "#8a92b2");
      const textCol = cssVar("--text", "#c0caf5");
      const neigh = new Set<string>();
      if (hover) {
        neigh.add(hover.id);
        edges.forEach((e) => {
          if (e.source === hover!.id) neigh.add(e.target);
          if (e.target === hover!.id) neigh.add(e.source);
        });
      }
      edges.forEach((e) => {
        const a = toScreen(byId[e.source]);
        const b = toScreen(byId[e.target]);
        const on = hover && (e.source === hover.id || e.target === hover.id);
        ctx.globalAlpha = hover && !on ? 0.25 : 1;
        ctx.strokeStyle = on ? colorFor(hover!.domain) : edgeCol;
        ctx.lineWidth = on ? 1.4 : 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
      // labels are always drawn: on touch screens there's no hover, so every
      // dot needs its title visible to be identifiable.
      const showAll = true;
      nodes.forEach((n) => {
        const s = toScreen(n);
        const r = radius(n) * view.k;
        const color = colorFor(n.domain);
        const dim = hover && !neigh.has(n.id);
        ctx.globalAlpha = dim ? 0.18 : 1;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
        // hovered/focused dots get a concentric outline ring (target motif)
        if (n === hover || n.id === focus) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.arc(s.x, s.y, r + 4.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (showAll || n === hover || n.id === focus) {
          ctx.globalAlpha = dim ? 0.3 : 1;
          ctx.fillStyle = n === hover || n.id === focus ? textCol : labelCol;
          ctx.font = '600 9.5px ui-monospace, "SF Mono", Menlo, Consolas, monospace';
          ctx.letterSpacing = "0.08em";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(n.title.toUpperCase(), s.x, s.y + r + 7);
          ctx.letterSpacing = "0em";
        }
        ctx.globalAlpha = 1;
      });
    }

    function frame() {
      step();
      draw();
      raf = requestAnimationFrame(frame);
    }

    // ── pointer + touch handling ──
    const point = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = "touches" in e ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };
    function onDown(e: MouseEvent | TouchEvent) {
      const p = point(e);
      moved = false;
      const n = nodeAt(p.x, p.y);
      if (n) drag = n;
      else {
        panning = true;
        last = p;
      }
    }
    function onMove(e: MouseEvent | TouchEvent) {
      const p = point(e);
      if (drag) {
        const w = fromScreen(p.x, p.y);
        drag.x = w.x;
        drag.y = w.y;
        alpha = Math.max(alpha, 0.4);
        moved = true;
        return;
      }
      if (panning && last) {
        view.x += p.x - last.x;
        view.y += p.y - last.y;
        last = p;
        moved = true;
        return;
      }
      const n = nodeAt(p.x, p.y);
      hover = n;
      canvas.style.cursor = n ? "pointer" : "grab";
    }
    function open(n: SimNode | null) {
      if (n && n.url) router.push(n.url);
    }
    function onUp() {
      if (drag && !moved) open(drag);
      drag = null;
      panning = false;
    }
    function onClick(e: MouseEvent) {
      if (moved) return;
      const p = point(e);
      open(nodeAt(p.x, p.y));
    }
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const p = point(e);
      const before = fromScreen(p.x, p.y);
      view.k = Math.min(3, Math.max(0.3, view.k * (e.deltaY < 0 ? 1.1 : 0.9)));
      const after = toScreen(before);
      view.x += p.x - after.x;
      view.y += p.y - after.y;
    }
    function onLeave() {
      drag = null;
      panning = false;
      hover = null;
    }
    function onTouchEnd() {
      if (drag && !moved) open(drag);
      else if (panning && !moved && last) open(nodeAt(last.x, last.y));
      drag = null;
      panning = false;
    }

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onDown, { passive: true });
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", resize);

    resize();
    frame();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [rawNodes, rawEdges, focus, router, colorFor]);

  return <canvas ref={canvasRef} className="graph" />;
}
