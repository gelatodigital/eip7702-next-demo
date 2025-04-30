import Image from "next/image";
import React from "react";

export default function FeatureCards() {
  return (
    <div className="lg:col-span-1 space-y-4">
      {/* Complete Wallet Stack */}
      <div className="w-full flex flex-col min-h-[260px] p-4 bg-[#161616] border rounded-[12px] border-[#2A2A2A]">
        <div className="w-full flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#252525] rounded-[6px] mr-3 flex items-center justify-center">
            <Image 
              src="/layers-three.svg" 
              alt="layers-three" 
              width={24} 
              height={24} 
            />
          </div>
          <h3 className="text-text-title text-md font-medium break-words">
            Complete Wallet Stack
          </h3>
        </div>
        <p className="text-text-tertiary text-sm flex-grow break-words mb-4">
          Gelato smart contracts + Wallet Kit SDK. Build and deploy
          production-ready smart wallets on any EVM chain.
        </p>
      </div>

      {/* High-Performance Gas Stack */}
      <div className="w-full flex flex-col min-h-[260px] p-4 bg-[#161616] border rounded-[12px] border-[#2A2A2A]">
        <div className="w-full flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#252525] rounded-[6px] mr-3 flex items-center justify-center">
            <Image
              src="/zap.svg"
              alt="zap"
              width={24}
              height={24}
            />
          </div>
          <h3 className="text-text-title text-md font-medium break-words">
            High-Performance Gas Stack
          </h3>
        </div>
        <p className="text-text-tertiary text-sm flex-grow break-words mb-4">
          Gelato Bundler and Paymaster, engineered for ultra-low latency and gas
          efficiency. Scale confidently without compromising on speed or cost.
        </p>
      </div>

      {/* Wallet-as-a-Service */}
      <div className="w-full flex flex-col min-h-[260px] p-4 bg-[#161616] border rounded-[12px] border-[#2A2A2A]">
        <div className="w-full flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#252525] rounded-[6px] mr-3 flex items-center justify-center">
            <Image
              src="/wallet.svg"
              alt="wallet"
              width={24}
              height={24}
            />
          </div>
          <h3 className="text-text-title text-md font-medium break-words">
            Wallet-as-a-Service
          </h3>
        </div>
        <p className="text-text-tertiary text-sm flex-grow break-words mb-4">
          Embedded wallet experience, powered by Dynamic. Fully integrated,
          seamless onboarding for your users.
        </p>
      </div>

      {/* Enterprise Ready */}
      <div className="w-full flex flex-col min-h-[260px] p-4 bg-[#161616] border rounded-[12px] border-[#2A2A2A]">
        <div className="w-full flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-[#252525] rounded-[6px] mr-3 flex items-center justify-center">
            <Image
              src="/building.svg"
              alt="building"
              width={24}
              height={24}
            />
          </div>
          <h3 className="text-text-title text-md font-medium break-words">
            Enterprise Ready
          </h3>
        </div>
        <p className="text-text-tertiary text-sm flex-grow break-words mb-4">
          Manage everything — contracts, SDK, paymaster, bundler, and wallet
          service, from a single dashboard. SOC2 compliant and production-ready.
        </p>
      </div>
    </div>
  );
}
