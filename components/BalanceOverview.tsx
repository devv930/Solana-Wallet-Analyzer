import React from "react";

type BalanceOverviewProps = {
  address: string;
  solBalance: number | null;
};

export default function BalanceOverview({ address, solBalance }: BalanceOverviewProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-semibold text-cyan-300">Wallet Summary</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-white/10 p-3">
          <p className="text-xs uppercase tracking-wide text-white/70">SOL Balance</p>
          <p className="text-2xl font-bold tracking-tight text-white">{solBalance !== null ? solBalance.toFixed(4) : "N/A"}</p>
        </div>
        <div className="rounded-xl bg-white/10 p-3">
          <p className="text-xs uppercase tracking-wide text-white/70">Wallet Address</p>
          <p className="break-all text-sm text-white">{address || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
