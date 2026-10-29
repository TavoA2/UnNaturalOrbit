import type { Metadata } from "next";
import "./globals.css";
import "./navigation.css";

export const metadata: Metadata = {
  title: { default: "UnnaturalOrbit", template: "%s | UnnaturalOrbit" },
  description: "Una plataforma independiente de promoción cultural y artística.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        <a href="#contenido" className="skip-link">Saltar al contenido</a>
        {children}
      </body>
    </html>
  );
}

