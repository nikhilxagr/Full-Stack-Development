import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusAuth | Next.js Fullstack Authentication",
  description: "Secure, modern, glassmorphic Next.js authentication platform built with MongoDB & JWT.",
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
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 bg-mesh selection:bg-indigo-500 selection:text-white relative">
        <Navbar />
        <main className="flex-1 flex flex-col relative z-10">{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
            },
          }}
        />
      </body>
    </html>
  );
}
