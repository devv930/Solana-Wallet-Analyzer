import { NextResponse } from "next/server";

const CLUSTER_RPC_URLS = {
  "mainnet-beta": "https://api.mainnet-beta.solana.com",
  testnet: "https://api.testnet.solana.com",
  devnet: "https://api.devnet.solana.com",
};

const FALLBACK_RPC_URL = "https://solana-api.projectserum.com";

function getRpcUrl(cluster: string, customRpc?: string): string {
  if (cluster === "custom") {
    return customRpc?.trim() || CLUSTER_RPC_URLS["mainnet-beta"];
  }
  return CLUSTER_RPC_URLS[cluster as keyof typeof CLUSTER_RPC_URLS] || CLUSTER_RPC_URLS["mainnet-beta"];
}

const normalizeSolanaRpcError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown Solana RPC error";
  }
};

const performRpc = async (request: Request, rpcUrl: string): Promise<NextResponse> => {
  const body = await request.text();
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Solana proxy RPC error", error);
    const message = normalizeSolanaRpcError(error);
    return NextResponse.json({ error: message }, { status: 503 });
  }
};

export async function POST(request: Request) {
  const params = await request.json().catch(() => ({}));
  const cluster = (params.cluster as string) || "mainnet-beta";
  const customRpc = (params.customRpcUrl as string) || "";

  const rpcUrl = getRpcUrl(cluster, customRpc);

  const result = await performRpc(request, rpcUrl);

  if (result.status >= 400 && rpcUrl !== FALLBACK_RPC_URL) {
    return performRpc(request, FALLBACK_RPC_URL);
  }

  return result;
}
