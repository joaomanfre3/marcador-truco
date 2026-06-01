import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Marcador de Truco",
  description:
    "Marcador de truco simples e rápido pra usar na mesa do bar. Placar, valor da mão, mão de 11 e série de partidas. Funciona offline.",
  applicationName: "Marcador de Truco",
  openGraph: {
    title: "Marcador de Truco",
    description: "Conte os pontos do truco direto do celular. Funciona offline.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d4a37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
