import { Metaplex } from "@metaplex-foundation/js";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { NftInfo, TokenInfo, TransactionInfo } from "@/types";

export type SolanaCluster = "mainnet-beta" | "testnet" | "devnet" | "custom";

const CLUSTER_RPC_URLS: Record<"mainnet-beta" | "testnet" | "devnet", string> = {
  "mainnet-beta": "https://api.mainnet-beta.solana.com",
  testnet: "https://api.testnet.solana.com",
  devnet: "https://api.devnet.solana.com",
};

export function resolveRpcUrl(cluster: SolanaCluster, customUrl?: string): string {
  if (cluster === "custom") {
    return customUrl?.trim() || "https://api.mainnet-beta.solana.com";
  }
  return CLUSTER_RPC_URLS[cluster];
}

const FALLBACK_RPC_URL = "https://solana-api.projectserum.com";

function createConnection(rpcUrl: string) {
  return new Connection(rpcUrl, "confirmed");
}

function createMetaplex(rpcUrl: string) {
  return new Metaplex(createConnection(rpcUrl));
}

function getFallbackRpcUrl(current: string) {
  if (current === FALLBACK_RPC_URL) return current;
  return FALLBACK_RPC_URL;
}

export function isValidWalletAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function getSolBalance(address: string, rpcUrl: string): Promise<number> {
  const pubkey = new PublicKey(address);
  const connection = createConnection(rpcUrl);
  try {
    const lamports = await connection.getBalance(pubkey, "confirmed");
    return lamports / LAMPORTS_PER_SOL;
  } catch (error) {
    const errorString = error instanceof Error ? error.message : JSON.stringify(error, Object.getOwnPropertyNames(error), 2) || String(error);
    console.error("Solana getBalance failed", {
      rpcUrl,
      error,
      errorString,
    });
    const isForbidden = String(error).includes("403") || errorString.includes("403");
    const isFetchFailed = errorString.includes("Failed to fetch") || errorString.includes("NetworkError") || errorString.includes("timeout");

    if ((isForbidden || isFetchFailed) && rpcUrl !== FALLBACK_RPC_URL) {
      console.warn("RPC fetch failure detected, retrying with fallback public RPC URL", FALLBACK_RPC_URL);
      return getSolBalance(address, FALLBACK_RPC_URL);
    }

    throw new Error(`RPC error: ${errorString}`);
  }
}

export async function getTokenBalances(address: string, rpcUrl: string): Promise<TokenInfo[]> {
  const owner = new PublicKey(address);
  const connection = createConnection(rpcUrl);

  let parsed;
  try {
    parsed = await connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });
  } catch (error) {
    const isForbidden = error && typeof error === "object" && "message" in error && String(error).includes("403");
    if (isForbidden && rpcUrl !== FALLBACK_RPC_URL) {
      console.warn("Token fetch 403 => retry fallback RPC", FALLBACK_RPC_URL);
      return getTokenBalances(address, FALLBACK_RPC_URL);
    }
    throw error;
  }

  const tokens: TokenInfo[] = [];

  for (const { account, pubkey } of parsed.value) {
    const parsedInfo = account.data.parsed?.info;
    if (!parsedInfo) continue;
    const uiAmount = Number(parsedInfo.tokenAmount.uiAmount);
    if (!uiAmount || uiAmount <= 0) continue;

    const mint = parsedInfo.mint;
    const decimals = Number(parsedInfo.tokenAmount.decimals);
    const symbol = "UNKNOWN";
    const name = mint.slice(0, 6) + "...";

    tokens.push({
      mint,
      decimals,
      balance: Number(uiAmount),
      symbol,
      name,
      logo: undefined,
    });
  }

  tokens.sort((a, b) => b.balance - a.balance);
  return tokens;
}

export async function getTransactionHistory(address: string, rpcUrl: string, limit = 15): Promise<TransactionInfo[]> {
  const owner = new PublicKey(address);
  const connection = createConnection(rpcUrl);

  let signatures;
  try {
    signatures = await connection.getSignaturesForAddress(owner, { limit });
  } catch (error) {
    const isForbidden = error && typeof error === "object" && "message" in error && String(error).includes("403");
    if (isForbidden && rpcUrl !== FALLBACK_RPC_URL) {
      console.warn("Signatures fetch 403 => retry fallback RPC", FALLBACK_RPC_URL);
      return getTransactionHistory(address, FALLBACK_RPC_URL, limit);
    }
    throw error;
  }

  const history: TransactionInfo[] = [];

  for (const sigInfo of signatures) {
    const tx = await connection.getParsedTransaction(sigInfo.signature, "confirmed");
    if (!tx) continue;

    const accountIndex = tx.transaction.message.accountKeys.findIndex((entry) => entry.pubkey.equals(owner));

    let type: TransactionInfo["type"] = "unknown";
    let amount = 0;

    if (accountIndex !== -1 && tx.meta?.preBalances && tx.meta?.postBalances) {
      const pre = tx.meta.preBalances[accountIndex];
      const post = tx.meta.postBalances[accountIndex];
      const diff = (post - pre) / LAMPORTS_PER_SOL;
      if (diff > 0) type = "receive";
      else if (diff < 0) type = "send";
      amount = Math.abs(diff);
    }

    const status = tx.meta?.err ? "failed" : "confirmed";

    history.push({
      signature: sigInfo.signature,
      date: new Date((tx.blockTime ?? 0) * 1000).toLocaleString(),
      type,
      amount,
      status,
    });
  }

  return history;
}

const NFT_FETCH_LIMIT = 8;

export async function getNfts(address: string, rpcUrl: string, limit = NFT_FETCH_LIMIT): Promise<NftInfo[]> {
  const owner = new PublicKey(address);
  const metaplex = createMetaplex(rpcUrl);
  let ownedNfts = [];
  try {
    ownedNfts = await metaplex.nfts().findAllByOwner({ owner });
  } catch (error) {
    const isForbidden = error && typeof error === "object" && "message" in error && String(error).includes("403");
    if (isForbidden && rpcUrl !== FALLBACK_RPC_URL) {
      console.warn("NFT fetch 403 => retry fallback RPC", FALLBACK_RPC_URL);
      return getNfts(address, FALLBACK_RPC_URL, limit);
    }
    console.warn("NFT fetch failed", error);
    return [];
  }

  const nfts: NftInfo[] = [];
  for (const nft of ownedNfts.slice(0, limit)) {
    let image: string | undefined;
    let name = nft.name || "Untitled NFT";
    const collection = nft.collection?.verified ? "Verified Collection" : "Unverified Collection";

    if (nft.uri) {
      try {
        const response = await fetch(nft.uri);
        if (response.ok) {
          const data = await response.json();
          image = data.image || data.image_url;
          name = data.name ?? name;
        }
      } catch (err) {
        console.warn("NFT metadata fetch error", err);
      }
      // spacing to reduce burst
      await new Promise((res) => setTimeout(res, 150));
    }

    nfts.push({ mint: nft.address.toBase58(), collection, image, name, uri: nft.uri });
  }

  return nfts;
}