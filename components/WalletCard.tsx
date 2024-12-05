import React from 'react';
import { Address } from "viem";
import { useNFTs } from "@/lib/useAllNfts";
import { ExternalLink } from 'lucide-react';

const WalletCard = ({ address }: { address: string }) => {
  const { data: nfts = [], isLoading } = useNFTs(address as Address);

  const getExplorerLink = (collection: string, tokenId: number) => {
    const contractAddress = collection === 'IGNIS'
      ? '0x454ee707F0e0745b2579D715F3B796B980aF272d'
      : '0x6F9A3AC224025B0A9E7b7F47dcb1DF7872e2fA75';
    return `https://chess.cloud.blockscout.com/token/${contractAddress}/instance/${tokenId}`;
  };

  return (
    <div className="w-full h-full md:min-h-0 px-4 sm:px-0 flex items-center justify-center pb-[150px] md:pb-0 md:pt-4">
      <div className="w-full max-w-[1135px] bg-[#101010] rounded-lg p-4 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Your Wallet</h2>
          <a
            href={`https://chess.cloud.blockscout.com/address/${address}?tab=tokens_nfts`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            View all <ExternalLink size={16} />
          </a>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-400">
              NFT Assets {!isLoading && `(${nfts.length})`}
            </h3>
            <div className="relative">
              <div className="h-[60vh] md:h-48 overflow-y-auto scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700">
                <div className="space-y-3 pb-4">
                  {isLoading ? (
                    <div className="text-zinc-400 text-sm">Loading...</div>
                  ) : nfts.length > 0 ? (
                    nfts.map((nft, index) => (
                      <a
                        key={index}
                        href={getExplorerLink(nft.collection, nft.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 rounded-md bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer group"
                      >
                        {nft.image && (
                          <img
                            src={nft.image}
                            alt={`${nft.collection} #${nft.id}`}
                            className="w-16 h-16 md:w-12 md:h-12 rounded-md object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <p className="text-base md:text-sm font-medium text-white">
                              {nft.collection} #{nft.id}
                            </p>
                            <ExternalLink size={16} className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-sm md:text-xs text-zinc-400">
                            Collection: {nft.collection}
                          </p>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="text-zinc-400 text-sm">No NFTs found</div>
                  )}
                </div>
              </div>
              {nfts.length > 2 && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#101010] to-transparent pointer-events-none" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
