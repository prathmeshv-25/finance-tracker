import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinTrack – Personal Finance Manager",
  description:
    "AI-powered personal finance tracker. Track income, expenses, and manage your money smarter.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-text-primary antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a27",
              color: "#f0f0ff",
              border: "1px solid #2a2a45",
              borderRadius: "12px",
            },
            success: { iconTheme: { primary: "#00d4aa", secondary: "#0a0a0f" } },
            error: { iconTheme: { primary: "#ff6b6b", secondary: "#0a0a0f" } },
          }}
        />
      </body>
    </html>
  );
}
