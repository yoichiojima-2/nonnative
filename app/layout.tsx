import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { getSearchDocs } from "@/lib/notes";
import siteConfig from "@/site.config";

// Self-hosted at build time (works with output: "export"): Inter carries the
// body — quiet, highly legible — while Space Grotesk gives headings and the
// brand a little geometric character without breaking the minimal feel.
const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});
const display = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata = {
  title: { default: siteConfig.title, template: `%s · ${siteConfig.title}` },
  description: siteConfig.tagline,
};

// pick the saved/system theme before first paint, to avoid a flash
const themeBoot = `(function(){try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const docs = getSearchDocs();
  return (
    <html lang="en" data-theme="dark" className={`${sans.variable} ${display.variable}`}>
      <head>
        <meta name="theme-color" content="#1a1b26" />
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>
        <SiteChrome docs={docs} />
        {children}
        <footer className="foot">{siteConfig.tagline}</footer>
      </body>
    </html>
  );
}
