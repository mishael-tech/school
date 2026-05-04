import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getPublicDisplaySettings } from "@/services/display-settings.service";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { subjectLabel } = await getPublicDisplaySettings();
  const title = `${subjectLabel} Scoreboard`;
  return {
    title,
    description: `Weekly test results and leaderboard for ${subjectLabel} class.`,
  };
}

/** All routes read live Mongo data or auth state; disable static snapshots at build. */
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
