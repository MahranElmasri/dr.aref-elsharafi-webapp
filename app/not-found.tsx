import Link from "next/link";
import "./globals.css";

// Fallback for requests outside any locale (the proxy normally prevents this).
export default function GlobalNotFound() {
  return (
    <html lang="de">
      <body>
        <main className="wrap py-16">
          <h1 className="text-heading">Diese Seite gibt es nicht.</h1>
          <p className="mt-6"><Link className="btn btn-primary" href="/">Zur Startseite</Link></p>
        </main>
      </body>
    </html>
  );
}
