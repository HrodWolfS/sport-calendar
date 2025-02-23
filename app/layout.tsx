import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientLayout } from "./components/layouts/client-layout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sport Calendar",
  description: "Application de suivi d'entraînements sportifs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
