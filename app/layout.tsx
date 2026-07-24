import { PortfolioProvider } from "@/context/PortfolioContext";
import VideoBackground from "@/components/VideoBackground";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Anas Ahmed | Full Stack Developer",
  description: "Full Stack, AI, and App Developer with 11+ years of experience",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-950 text-white antialiased">
        <Providers>
          <PortfolioProvider>
            <VideoBackground />
            <Navbar />
            <main className="relative z-10">{children}</main>
          </PortfolioProvider>
        </Providers>
      </body>
    </html>
  );
}
