import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import siteConfig from "./site.config";

// The vault's images live next to the notes (the vault is the source of
// truth); mirror them into public/ so the exported site can serve them.
// This runs once when the dev server or a build starts.
const assets = path.resolve(process.cwd(), siteConfig.vaultDir, "assets");
const dest = path.join(process.cwd(), "public", "assets");
rmSync(dest, { recursive: true, force: true });
if (existsSync(assets)) cpSync(assets, dest, { recursive: true });

// Static export so the site can be served from GitHub Pages. On Pages the
// site lives under /<repo>, so basePath is set by CI via env.
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  trailingSlash: true, // /notes/x/ -> folder with index.html (Pages-friendly)
};

export default nextConfig;
