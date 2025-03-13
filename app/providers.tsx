"use client";

import {
  DynamicContextProvider,
  mergeNetworks,
} from "@dynamic-labs/sdk-react-core";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const evmNetworks = [
    {
      blockExplorerUrls: ["https://mike-testnet.cloud.blockscout.com/"],
      chainId: 123420001692,
      chainName: "Mike Testnet",
      iconUrls: ["/gelato-network.png"],
      name: "Mike Testnet",
      nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
        iconUrl: "https://app.dynamic.xyz/assets/networks/eth.svg",
      },
      networkId: 123420001692,
      rpcUrls: ["https://rpc.mike-testnet.t.raas.gelato.cloud"],
      vanityName: "Mike Testnet",
    },
  ];
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "fed025b3-670e-4fe5-be71-a2ad2d509b70",
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks: (networks) => mergeNetworks(evmNetworks, networks),
        },
        events: {
          onAuthFlowOpen: () => console.log("Auth flow opened"),
          onAuthSuccess: () => console.log("Auth success"),
        },
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </DynamicContextProvider>
  );
}
