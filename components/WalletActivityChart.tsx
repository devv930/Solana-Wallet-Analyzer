"use client";

import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { TransactionInfo } from "@/types";

interface WalletActivityChartProps {
  transactions: TransactionInfo[];
  loading: boolean;
}

interface ActivityPoint {
  date: string;
  transactionCount: number;
  solVolume: number;
}

export default function WalletActivityChart({ transactions, loading }: WalletActivityChartProps) {
  const data = useMemo<ActivityPoint[]>(() => {
    if (!transactions.length) return [];

    const bucket: Record<string, { count: number; volume: number }> = {};

    for (const tx of transactions) {
      const date = new Date(tx.date).toLocaleDateString();
      if (!bucket[date]) {
        bucket[date] = { count: 0, volume: 0 };
      }
      bucket[date].count += 1;
      bucket[date].volume += tx.amount;
    }

    return Object.entries(bucket)
      .map(([date, metrics]) => ({ date, transactionCount: metrics.count, solVolume: Number(metrics.volume.toFixed(6)) }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions]);

  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-xl backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">Wallet Activity Chart</h3>
      {loading ? (
        <div className="h-72 animate-pulse rounded-xl bg-white/5" />
      ) : data.length === 0 ? (
        <p className="text-sm text-white/70">No transaction activity to display.</p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis yAxisId="left" orientation="left" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid #2f2f2f" }} />
              <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
              <Line yAxisId="left" type="monotone" dataKey="transactionCount" name="Tx Count" stroke="#38bdf8" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="solVolume" name="SOL Volume" stroke="#22c55e" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
