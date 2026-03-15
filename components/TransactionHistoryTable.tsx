import { TransactionInfo } from "@/types";

interface TransactionHistoryTableProps {
  transactions: TransactionInfo[];
}

export default function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-xl backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">Transaction History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-white/90">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/60">
              <th className="px-3 py-2">Signature</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Amount (SOL)</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-white/70">
                  No recent transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.signature} className="border-b border-white/10 hover:bg-white/5">
                  <td className="px-3 py-2">
                    <a
                      href={`https://explorer.solana.com/tx/${tx.signature}?cluster=mainnet-beta`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-300 hover:text-cyan-200"
                    >
                      {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                    </a>
                  </td>
                  <td className="px-3 py-2">{tx.date}</td>
                  <td className="px-3 py-2 capitalize">{tx.type}</td>
                  <td className="px-3 py-2">{tx.amount.toFixed(6)}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${tx.status === "confirmed" ? "bg-emerald-500/25 text-emerald-300" : "bg-rose-500/25 text-rose-300"}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
