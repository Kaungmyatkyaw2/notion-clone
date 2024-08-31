import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/theme-provider";
import ConvexProvider from "@/components/providers/convex-provider";
import ModalProvider from "@/components/providers/modal-provider";
import { Toaster } from "sonner";
import { EdgeStoreProvider } from "@/lib/edgestore";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kotion",
  description: "Your own virtual workspace , task manager and other stuff",
  icons: {
    icon: [
      {
        href: "/logo.png",
        url: "/logo.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ConvexProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="kotion-themes"
          >
            <Toaster />
            <EdgeStoreProvider>
              <ModalProvider />
              {children}
            </EdgeStoreProvider>
          </ThemeProvider>
        </ConvexProvider>
      </body>
    </html>
  );
}
