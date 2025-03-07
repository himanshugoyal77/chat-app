import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Periskope chat app",
  description: "A chat app with chat labels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen overflow-hidden relative">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
