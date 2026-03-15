"use client";

import { useCallback, useMemo, useState } from "react";
import { isValidWalletAddress, resolveRpcUrl, SolanaCluster } from "@/services/solana";
import { TokenInfo, NftInfo, TransactionInfo } from "@/types";

export function useWalletAnalyzer() {
  const [address, setAddress] = useState("");
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [nfts, setNfts] = useState<NftInfo[]>([]);
  const [transactions, setTransactions] = useState<TransactionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cluster, setCluster] = useState<SolanaCluster>("mainnet-beta");
  const [customRpcUrl, setCustomRpcUrl] = useState("");

  const rpcUrl = useMemo(() => resolveRpcUrl(cluster, customRpcUrl), [cluster, customRpcUrl]);
  const isValid = useMemo(() => isValidWalletAddress(address), [address]);

  const analyze = useCallback(async (walletAddress: string) => {
    if (!walletAddress?.trim()) {
      setError("Please enter a wallet address.");
      return;
    }
    if (!isValidWalletAddress(walletAddress)) {
      setError("Invalid Solana wallet address.");
      return;
    }

    setError("");
    setLoading(true);
    setAddress(walletAddress);

    try {
      const apiUrl = `/api/solana?address=${encodeURIComponent(walletAddress)}&cluster=${encodeURIComponent(cluster)}&customRpcUrl=${encodeURIComponent(customRpcUrl)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch wallet data");
      }

      setSolBalance(data.solBalance ?? null);
      setTokens(data.tokens ?? []);
      setTransactions(data.transactions ?? []);
      setNfts(data.nfts ?? []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch wallet data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [cluster, customRpcUrl, isValid]);

  return {
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
    rpcUrl,
    setCluster,
    setCustomRpcUrl,
    setAddress,
    analyze,
  };
}
