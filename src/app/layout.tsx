import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import AdScript from "@/components/AdScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modder AI — Create Minecraft Mods with AI",
  description: "Create Minecraft mods, plugins, datapacks and more with AI. 20+ powerful tools, 12+ loaders, MC 1.7.10–1.21. Auto-JAR building. Free to start.",
  metadataBase: new URL("https://modderai.net"),
  icons: {
    icon: "/modderai-favicon.jpeg",
  },
  openGraph: {
    title: "Modder AI — Create Minecraft Mods with AI",
    description: "20+ AI tools for Minecraft modding. Describe what you want, download a working plugin. Supports Paper, Fabric, Forge and more.",
    url: "https://modderai.net",
    siteName: "Modder AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Modder AI — Create Minecraft Mods with AI",
    description: "20+ AI tools for Minecraft modding. Free to start.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <AdScript />
          <Navbar />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
