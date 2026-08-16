import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stack Overflow Clone | Appwrite",
  description: "A full-stack Stack Overflow clone built with Next.js, Appwrite, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col">
        <Navbar />
        <div className="flex flex-1 mx-auto w-full max-w-7xl">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden min-w-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
