import { NftInfo } from "@/types";

interface NftGalleryProps {
  nfts: NftInfo[];
}

export default function NftGallery({ nfts }: NftGalleryProps) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-xl backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">NFT Gallery</h3>
      {nfts.length === 0 ? (
        <p className="text-white/70">No NFTs found in this wallet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {nfts.map((nft) => (
            <div key={nft.mint} className="group overflow-hidden rounded-xl border border-white/10 bg-black/30 transition hover:-translate-y-1 hover:border-cyan-300/50">
              <div className="relative h-44 w-full bg-white/5 p-2">
                {nft.image ? (
                  <img src={nft.image} alt={nft.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-white/60">No Image</div>
                )}
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold text-white">{nft.name}</h4>
                <p className="text-xs text-white/60">{nft.collection || "Unknown Collection"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
