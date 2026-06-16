import "./globals.css";
import { Jost } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { getSearchDocs } from "@/lib/notes";
import siteConfig from "@/site.config";

// Self-hosted at build time (works with output: "export"). Jost is a geometric
// variable font (Futura lineage) used for both body and display; the full
// weight axis loads so globals.css can lean on light weights for an airy,
// architectural feel. Both --font-sans and --font-display point at it.
const sans = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});
const display = Jost({
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
