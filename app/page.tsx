"use client";

import SearchBar from "@/components/SearchBar";
import BalanceOverview from "@/components/BalanceOverview";
import TokenGrid from "@/components/TokenGrid";
import NftGallery from "@/components/NftGallery";
import TransactionHistoryTable from "@/components/TransactionHistoryTable";
import WalletActivityChart from "@/components/WalletActivityChart";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useWalletAnalyzer } from "@/hooks/useWalletAnalyzer";

export default function Home() {
  const {
    address,
    solBalance,
    tokens,
    nfts,
    transactions,
    loading,
    error,
    isValid,
    cluster,
    customRpcUrl,
    setCluster,
    setCustomRpcUrl,
    setAddress,
    analyze,
  } = useWalletAnalyzer();

  return (
    <div className="min-h-screen bg-[#06101a] p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-r from-[#09161f] via-[#0d1b28] to-[#081220] p-6 shadow-2xl backdrop-blur-xl">
          <h1 className="text-3xl font-black tracking-tight text-cyan-200 sm:text-4xl">Solana Wallet Analyzer</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
            Paste a Solana wallet address and explore SOL balance, SPL token holdings, NFT collection, and transaction history.
          </p>
        </header>

        <section className="mb-5 grid gap-3 lg:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white">
            <label className="font-medium text-cyan-300">Network:</label>
            <select
              value={cluster}
              onChange={(e) => setCluster(e.target.value as "mainnet-beta" | "testnet" | "devnet" | "custom")}
              className="rounded-lg border border-white/20 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
            >
              <option value="mainnet-beta">Mainnet Beta</option>
              <option value="testnet">Testnet</option>
              <option value="devnet">Devnet</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {cluster === "custom" ? (
            <input
              value={customRpcUrl}
              onChange={(e) => setCustomRpcUrl(e.target.value)}
              placeholder="Custom RPC URL"
              className="rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
            />
          ) : null}
          <SearchBar
            value={address}
            onChange={setAddress}
            onAnalyze={() => analyze(address)}
            loading={loading}
            isValid={isValid}
          />
        </section>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-600/10 p-3 text-sm text-rose-200">{error}</div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <section className="mb-8">
              <BalanceOverview address={address} solBalance={solBalance} />
            </section>

            <section className="mb-8">
              <WalletActivityChart transactions={transactions} loading={loading} />
            </section>

            <section className="mb-8">
              <TokenGrid tokens={tokens} />
            </section>

            <section className="mb-8">
              <NftGallery nfts={nfts} />
            </section>

            <section className="mb-8">
              <TransactionHistoryTable transactions={transactions} />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
