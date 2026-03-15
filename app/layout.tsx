import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Wallet Analyzer",
  description: "Analyze Solana wallets, balances, tokens, NFTs and transactions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
