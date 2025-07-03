"use client";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <head>
        <title>Config Manager</title>
        <script id="headerScripts" />
      </head>
      <body
        className={` ${openSans.variable} antialiased font-open-sans bg-gray-200`}
      >
        <div className="flex gap-0 lg:gap-5">
          <div className="hidden lg:flex">
            {pathname !== "/login" && <Sidebar />}
          </div>
          <Toaster duration={3000} richColors position="top-center" />
          {children}
        </div>
      </body>
    </html>
  );
}
