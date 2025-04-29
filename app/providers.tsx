"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();
import { GelatoMegaContextProvider } from "@gelatomega/react-sdk";
import { sepolia } from "viem/chains";
import { http } from "wagmi";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GelatoMegaContextProvider
      type="dynamic"
      settings={{
        appId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string,
        wagmiConfigParameters: {
          chains: [sepolia],
          transports: {
            [sepolia.id]: http(),
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GelatoMegaContextProvider>
  );
}
