import { TokenInfo } from "@/types";

interface TokenGridProps {
  tokens: TokenInfo[];
}

export default function TokenGrid({ tokens }: TokenGridProps) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-xl backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">SPL Token Balances</h3>
      {tokens.length === 0 ? (
        <p className="text-white/70">No SPL tokens found in this wallet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {tokens.map((token) => (
            <div key={token.mint} className="rounded-xl border border-white/10 bg-black/30 p-4 transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <div className="h-11 w-11 rounded-full bg-cyan-500/20 text-center text-sm font-bold leading-11 text-cyan-200">
                  {token.symbol?.[0] ?? "T"}
                </div>
                <span className="text-xs text-white/60">{token.symbol || "UNKNOWN"}</span>
              </div>
              <div className="mt-3">
                <h4 className="text-base font-semibold text-white">{token.name}</h4>
                <p className="text-sm text-white/70">Mint: {token.mint.slice(0, 6)}...{token.mint.slice(-4)}</p>
                <p className="mt-1 text-sm font-semibold text-cyan-300">{token.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
