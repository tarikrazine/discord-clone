import "./globals.css";

import { Open_Sans } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import { ThemeProvider } from "@/components/providers/theme-provider";
import ModalProvider from "@/components/providers/modal-provider";

import { cn } from "@/lib/utils";
import SocketProvider from "@/components/providers/socket-provider";
import QueryProvider from "@/components/providers/query-provider";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Discord clone",
  description: "Discord clone next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={cn(openSans.className, "bg-white dark:bg-[#313338]")}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              storageKey="discord-theme"
            >
              <SocketProvider>
                <ModalProvider />
                {children}
              </SocketProvider>
            </ThemeProvider>
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
