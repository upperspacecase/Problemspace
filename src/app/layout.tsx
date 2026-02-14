import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Problem Board",
  description:
    "Problems people would pay to solve, ranked by demand.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text-primary font-sans">
        <AuthProvider>
          <Navbar />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
