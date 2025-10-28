import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { auth0 } from "@/lib/auth0";
import { AccessTokenProvider } from "@/contexts/AccessTokenContext";

export const metadata: Metadata = {
  title: "Adventure Works - Proceso de Venta",
  description: "Sistema de punto de venta Adventure Works",
  generator: "v0.app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();
  const sessionUser = session?.user ?? null;
  const accessToken = sessionUser
    ? await auth0.getAccessToken({ audience: process.env.AUTH0_AUDIENCE })
    : null;
  const token = accessToken?.token ?? null;

  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <UserProvider value={sessionUser}>
          <AccessTokenProvider value={token}>
            <Suspense fallback={null}>{children}</Suspense>
            <Analytics />
          </AccessTokenProvider>
        </UserProvider>
      </body>
    </html>
  );
}
