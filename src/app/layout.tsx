import type { Metadata, Viewport } from "next";
import { Montserrat, Inter, JetBrains_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-score",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TCL × Arsenal Road to Greatness 2026",
    template: "%s | Road to Greatness",
  },
  description:
    "Your tournament companion for TCL × Arsenal Road to Greatness 2026. Join, follow, and experience the journey.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Road to Greatness",
  },
};

export const viewport: Viewport = {
  themeColor: "#E4002B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-bg-primary text-text-primary font-body antialiased">
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
