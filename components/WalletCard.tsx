import React, { useState, useCallback } from "react";
import { Address } from "viem";
import { ExternalLink, Wallet } from "lucide-react";
import { useTokenHoldings } from "@/lib/hooks/useFetchBalances";
import Image from "next/image";

interface WalletCardProps {
  accountAddress: string;
  gasToken: "USDC" | "WETH";
  handleLogout?: () => void;
}

export default function WalletCard({
  accountAddress,
  gasToken,
  handleLogout,
}: WalletCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { data: tokenHoldings } = useTokenHoldings(
    accountAddress as Address,
    gasToken
  );

  /**
   * Copies the account address to the clipboard
   * Sets a timeout to reset the copied state after 2 seconds
   */
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(accountAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [accountAddress]);

  /**
   * Opens the account address in a new tab
   * Uses the Scope Explorer for Sepolia
   */
  const handleExplorerClick = () => {
    window.open(
      `https://scope.sh/11155111/address/${accountAddress}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-4">
      <div className="w-full flex flex-col p-4 bg-[#202020] border rounded-[12px] border-[#2A2A2A]">
        <div className="flex justify-center">
          {handleLogout && (
            <button
              onClick={handleLogout}
              className="w-32 py-3 bg-zinc-800 rounded-md hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
              Log out
            </button>
          )}
        </div>
      </div>

      <div className="w-full flex flex-col p-4 bg-[#202020] border rounded-[12px] border-[#2A2A2A]">
        <div className="w-full flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#252525] rounded flex items-center justify-center">
            <Wallet className="w-5 h-5 text-[#807872]" />
          </div>
          <h3 className="text-text-title text-md font-medium break-words ps-2">
            Wallet Details
          </h3>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between bg-dark-100 p-2 rounded border border-dark-200">
            <code className="text-sm text-text-title">{accountAddress}</code>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                {isCopied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleExplorerClick}
                className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1"
              >
                Explorer
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-text-tertiary">Smart EOA</div>
          <div className="flex items-center">
            <div className="flex items-center text-green-500 text-sm">
              <svg
                className="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Smart EOA
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col p-4 bg-[#202020] border rounded-[12px] border-[#2A2A2A]">
        <div className="w-full flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#252525] rounded flex items-center justify-center">
            <Wallet className="w-5 h-5 text-[#807872]" />
          </div>
          <h3 className="text-text-title text-md font-medium break-words ps-2">
            Wallet Balance
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-dark-200">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2">
                <Image
                  src="/weth.svg"
                  alt="ETH"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <span className="text-sm text-text-tertiary">ETH</span>
            </div>
            <div className="text-sm text-text-title">
              {tokenHoldings?.ethBalance || "0.0000"}
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-dark-200">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2">
                <Image
                  src="/usdc.svg"
                  alt="USDC"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <span className="text-sm text-text-tertiary">USDC</span>
            </div>
            <div className="text-sm text-text-title">
              {tokenHoldings?.usdcBalance || "0.00"}
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-dark-200">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2">
                <Image
                  src="/weth.svg"
                  alt="WETH"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <span className="text-sm text-text-tertiary">WETH</span>
            </div>
            <div className="text-sm text-text-title">
              {tokenHoldings?.wethBalance || "0.0000"}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-purple-900 mr-2 flex items-center justify-center text-sm">
                D
              </div>
              <span className="text-sm text-text-tertiary">DROP</span>
            </div>
            <div className="text-sm text-text-title">
              {tokenHoldings?.dropBalance || "0.0000"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
