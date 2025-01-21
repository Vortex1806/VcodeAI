import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/custom/Header";

export const metadata = {
  title: "Home",
  description: "v-code",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConvexClientProvider >
          <Provider>
            {children}
            <Toaster />
          </Provider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
