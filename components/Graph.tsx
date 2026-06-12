"use client";
// A small dependency-free force-directed graph on a canvas, drawn as a night
// sky: notes are stars (sized by how connected they are), wikilinks are
// constellation lines, and the vault's domains tint the nebulae drifting
// behind them. Drag to rearrange, scroll/pinch to zoom, click/tap a star to
// open the note. Pass `focus` to show just one note and its neighbours.
import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import type { GraphEdge, GraphNode } from "@/lib/notes";

// colors are assigned to whatever domains the vault contains, in alphabetical
// order, so the palette needs no per-vault configuration.
const COLORS = ["#7aa2f7", "#bb9af7", "#7dcfff", "#9ece6a", "#e0af68", "#f7768e", "#ff9e64", "#b4f9f8"];
const FALLBACK = "#9aa5ce";
// the sky ignores the site theme on purpose: the graph reads as a window
// into space, so it stays dark even in light mode.
const SKY = ["#10142b", "#0a0c1d", "#05060f"];
const STAR_TINTS = ["#ffffff", "#cdd6ff", "#ffe9c4", "#dff6ff"];

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number; // per-star twinkle offset so they don't pulse in unison
}

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
    let nodes: SimNode[] = rawNodes.map((n) => ({
      ...n,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      phase: Math.random() * Math.PI * 2,
    }));
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

    // distant background stars live in screen space; `depth` makes them pan
    // slower than the graph so the sky gains parallax.
    const dust = Array.from({ length: 150 }, () => ({
      u: Math.random(),
      v: Math.random(),
      depth: 0.1 + Math.random() * 0.45,
      r: 0.3 + Math.random() ** 2 * 1.3,
      tint: STAR_TINTS[(Math.random() * STAR_TINTS.length) | 0],
      base: 0.25 + Math.random() * 0.6,
      speed: 0.0004 + Math.random() * 0.0012,
      phase: Math.random() * Math.PI * 2,
    }));
    // one faint nebula per domain, parked in world space so it moves with the
    // constellation when panning and zooming.
    const nebulae = [...new Set(nodes.map((n) => colorFor(n.domain)))]
      .slice(0, 4)
      .map((color, i, all) => ({
        color,
        x: W() / 2 + Math.cos((i / all.length) * Math.PI * 2 + 0.8) * spread,
        y: H() / 2 + Math.sin((i / all.length) * Math.PI * 2 + 0.8) * spread * 0.7,
        r: spread * (1.2 + Math.random() * 0.6),
        phase: Math.random() * Math.PI * 2,
      }));
    let meteor: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextMeteor = -1;

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

    const radius = (n: SimNode) => 4 + Math.sqrt(n.degree || 1) * 2.1;
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
        const r = radius(nodes[i]) * view.k + 4;
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

    function drawSky(t: number) {
      const w = W();
      const h = H();
      const sky = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.85);
      sky.addColorStop(0, SKY[0]);
      sky.addColorStop(0.55, SKY[1]);
      sky.addColorStop(1, SKY[2]);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // everything luminous is drawn additively so overlapping glows brighten
      ctx.globalCompositeOperation = "lighter";
      nebulae.forEach((nb) => {
        const s = toScreen({
          x: nb.x + Math.cos(t * 0.00012 + nb.phase) * 30,
          y: nb.y + Math.sin(t * 0.00009 + nb.phase) * 22,
        });
        const R = nb.r * view.k;
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, R);
        g.addColorStop(0, rgba(nb.color, 0.07));
        g.addColorStop(1, rgba(nb.color, 0));
        ctx.fillStyle = g;
        ctx.fillRect(s.x - R, s.y - R, R * 2, R * 2);
      });
      dust.forEach((d) => {
        const px = (((d.u * w + view.x * d.depth) % w) + w) % w;
        const py = (((d.v * h + view.y * d.depth) % h) + h) % h;
        ctx.fillStyle = rgba(d.tint, d.base * (0.55 + 0.45 * Math.sin(t * d.speed + d.phase)));
        ctx.beginPath();
        ctx.arc(px, py, d.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (nextMeteor < 0) nextMeteor = t + 3000 + Math.random() * 5000;
      if (!meteor && t > nextMeteor) {
        const a = Math.PI * (0.12 + Math.random() * 0.25);
        meteor = {
          x: Math.random() * w * 0.7,
          y: Math.random() * h * 0.35,
          vx: Math.cos(a) * 9,
          vy: Math.sin(a) * 9,
          life: 1,
        };
      }
      if (meteor) {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.life -= 0.02;
        const tail = 13;
        const g = ctx.createLinearGradient(
          meteor.x, meteor.y,
          meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail,
        );
        g.addColorStop(0, `rgba(255,255,255,${0.9 * meteor.life})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail);
        ctx.stroke();
        if (meteor.life <= 0 || meteor.x > w + 60 || meteor.y > h + 60) {
          meteor = null;
          nextMeteor = t + 6000 + Math.random() * 10000;
        }
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function draw(t: number) {
      drawSky(t);
      const neigh = new Set<string>();
      if (hover) {
        neigh.add(hover.id);
        edges.forEach((e) => {
          if (e.source === hover!.id) neigh.add(e.target);
          if (e.target === hover!.id) neigh.add(e.source);
        });
      }
      // constellation lines fade between the colors of the stars they join
      edges.forEach((e) => {
        const na = byId[e.source];
        const nb = byId[e.target];
        const a = toScreen(na);
        const b = toScreen(nb);
        const on = hover && (e.source === hover.id || e.target === hover.id);
        const lum = on ? 0.85 : hover ? 0.06 : 0.3;
        const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        g.addColorStop(0, rgba(colorFor(na.domain), lum));
        g.addColorStop(1, rgba(colorFor(nb.domain), lum));
        ctx.strokeStyle = g;
        ctx.lineWidth = on ? 1.6 : 0.9;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });
      const showAll = view.k > 0.95 || nodes.length <= 14;
      nodes.forEach((n) => {
        const s = toScreen(n);
        const r = radius(n) * view.k;
        const color = colorFor(n.domain);
        const dim = hover && !neigh.has(n.id);
        const tw = 0.8 + 0.2 * Math.sin(t * 0.0016 + n.phase);
        ctx.globalAlpha = dim ? 0.15 : 1;

        ctx.globalCompositeOperation = "lighter";
        const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 4);
        halo.addColorStop(0, rgba(color, 0.38 * tw));
        halo.addColorStop(1, rgba(color, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r * 4, 0, Math.PI * 2);
        ctx.fill();
        // diffraction spikes on the brightest (most-connected) stars
        if ((n.degree || 0) >= 3 || n === hover || n.id === focus) {
          const len = r * (2.4 + 0.6 * tw);
          ctx.strokeStyle = rgba(color, (n === hover ? 0.8 : 0.4) * tw);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(s.x - len, s.y);
          ctx.lineTo(s.x + len, s.y);
          ctx.moveTo(s.x, s.y - len);
          ctx.lineTo(s.x, s.y + len);
          ctx.stroke();
        }
        ctx.globalCompositeOperation = "source-over";

        // core: white-hot centre cooling to the domain color at the rim
        const core = ctx.createRadialGradient(s.x - r * 0.25, s.y - r * 0.25, 0, s.x, s.y, r);
        core.addColorStop(0, "#ffffff");
        core.addColorStop(0.5, rgba(color, 1));
        core.addColorStop(1, rgba(color, 0.85));
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (n.id === focus) {
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(255,255,255,.85)";
          ctx.beginPath();
          ctx.arc(s.x, s.y, r + 3.5 + Math.sin(t * 0.004) * 1.2, 0, Math.PI * 2);
          ctx.stroke();
        } else if (n === hover) {
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = rgba(color, 0.7);
          ctx.beginPath();
          ctx.arc(s.x, s.y, r + 4 + Math.sin(t * 0.005) * 1.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (showAll || n === hover || n.id === focus) {
          ctx.globalAlpha = dim ? 0.25 : 1;
          ctx.fillStyle = n === hover ? "#e8ecff" : "#9aa3c7";
          ctx.font = '600 11px -apple-system, "Segoe UI", sans-serif';
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(n.title, s.x, s.y + r + 4);
        }
        ctx.globalAlpha = 1;
      });
    }

    function frame(t: number) {
      step();
      draw(t);
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
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [rawNodes, rawEdges, focus, router, colorFor]);

  return <canvas ref={canvasRef} className="graph" />;
}
