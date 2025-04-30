import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/common/Dialog";
import { Button } from "@/components/common/Button";
import { useState, useEffect } from "react";
import { formatUnits } from "viem";
import { ExternalLink } from "lucide-react";
import { getEstimatedFee } from "@gelatomega/core/oracle";
import { defaultChain, TOKEN_CONFIG } from "@/constants/blockchain";
interface GasEstimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (estimatedGas: string) => void;
  megaClient: any;
  gasToken: "USDC" | "WETH";
  tokenBalance: string;
}

export function GasEstimationModal({
  isOpen,
  onClose,
  onConfirm,
  megaClient,
  gasToken,
}: GasEstimationModalProps) {
  const [estimatedGas, setEstimatedGas] = useState<string>("");
  const [isEstimating, setIsEstimating] = useState(false);

  /**
   * Reset the estimated gas value whenever the modal is opened
   * This ensures we start with a fresh state for each new estimation
   */
  useEffect(() => {
    if (isOpen) {
      setEstimatedGas("");
    }
  }, [isOpen]);
  
  /**
   * Formats a token balance from raw value to human-readable format
   * @param value - The raw token amount as a string
   * @param decimals - The number of decimals for the token
   * @returns Formatted balance string with up to 4 decimal places
   */
  const formatBalance = (value: string, decimals: number) => {
    try {
      return parseFloat(formatUnits(BigInt(value), decimals)).toLocaleString(
        undefined,
        {
          maximumFractionDigits: 4,
          minimumFractionDigits: 0,
        }
      );
    } catch (e) {
      return value;
    }
  };

  /**
   * Estimates the gas fee for a transaction using the Gelato oracle
   * Fetches the estimated fee based on the selected gas token and a fixed gas limit
   * Updates the UI with the formatted estimated gas amount or an error message
   */
  const estimateGasFee = async () => {
    try {
      setIsEstimating(true);
      const gasTokenAddress = TOKEN_CONFIG[gasToken].address;
      const estimatedFee = await getEstimatedFee(
        megaClient.chain.id,
        gasTokenAddress,
        // TODO: dynamic gas limit
        BigInt(200000),
        BigInt(0)
      );
      setEstimatedGas(
        `${formatBalance(estimatedFee.toString(), 18)} ${
          TOKEN_CONFIG[gasToken].symbol
        }`
      );
    } catch (error) {
      console.error("Error estimating gas:", error);
      setEstimatedGas("Error estimating gas");
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Gas Fee Estimation
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            This will estimate the gas fees for your drop transaction in{" "}
            {TOKEN_CONFIG[gasToken].symbol}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg">
            <span className="text-sm font-medium">Estimated Gas:</span>
            <span className="text-sm">
              {isEstimating ? "Estimating..." : estimatedGas}
            </span>
          </div>

          {/* Token Information Section */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Token Address:</span>
                <a
                  href={`${defaultChain.blockExplorers.default.url}/token/${TOKEN_CONFIG[gasToken].address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  {TOKEN_CONFIG[gasToken].address.slice(0, 6)}...
                  {TOKEN_CONFIG[gasToken].address.slice(-4)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-2">
                {gasToken === "USDC" ? (
                  <a
                    href="https://faucet.circle.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Get 10 USDC from Circle Faucet
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <a
                    href={`${defaultChain.blockExplorers.default.url}/address/${TOKEN_CONFIG[gasToken].address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Get {TOKEN_CONFIG[gasToken].symbol} for your smart account
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700"
          >
            Cancel
          </Button>
          <Button
            onClick={estimateGasFee}
            disabled={isEstimating}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isEstimating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Estimating...</span>
              </>
            ) : (
              <>
                <span>Estimate Gas</span>
              </>
            )}
          </Button>
          <Button
            onClick={() => onConfirm(estimatedGas)}
            disabled={!estimatedGas || isEstimating}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-purple-500/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
