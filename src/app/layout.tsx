import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/providers/QueryProviders";

export const metadata: Metadata = {
  title: "Slid Todo",
  description: "Slid Todo",
  icons: {
    icon: "/images/mini-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-pretendard">
        <QueryProvider>{children}</QueryProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontSize: "14px",
              padding: "14px",
              maxWidth: "500px",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        />
      </body>
    </html>
  );
}
