import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import ClientWrapper from "@/components/Common/ClientWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Greedy App",
  description: "Full-stack authentication app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className}`}>
        <ClientWrapper session={session}>{children}</ClientWrapper>
      </body>
    </html>
  );
}
