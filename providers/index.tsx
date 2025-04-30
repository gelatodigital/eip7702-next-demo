"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();
import { GelatoMegaContextProvider } from "@gelatomega/react-sdk";
import { http } from "wagmi";
import { defaultChain } from "@/constants/blockchain";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GelatoMegaContextProvider
      type="dynamic"
      settings={{
        appId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string,
        wagmiConfigParameters: {
          chains: [defaultChain],
          transports: {
            [defaultChain.id]: http(),
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GelatoMegaContextProvider>
  );
}
