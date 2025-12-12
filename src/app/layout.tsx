import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import AntdProvider from "@/components/providers/AntdProvider";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import ClientInit from "./layout-client-init";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Panel - Next.js Boilerplate",
  description: "Production-ready admin panel built with Next.js, Redux Toolkit, and Ant Design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <AntdProvider>
            <ClientInit />
            <ProtectedLayout>{children}</ProtectedLayout>
          </AntdProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
