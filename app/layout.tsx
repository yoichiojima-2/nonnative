import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getSearchDocs } from "@/lib/notes";
import siteConfig from "@/site.config";

export const metadata = {
  title: { default: siteConfig.title, template: `%s · ${siteConfig.title}` },
  description: siteConfig.tagline,
};

// pick the saved/system theme before first paint, to avoid a flash
const themeBoot = `(function(){try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const docs = getSearchDocs();
  return (
    <html lang="en" data-theme="dark">
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
