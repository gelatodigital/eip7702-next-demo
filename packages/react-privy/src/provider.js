import { jsx as _jsx } from "react/jsx-runtime";
import { PrivyProvider, usePrivy, useSignAuthorization, useWallets } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChainId } from "caip";
import { createContext, useContext, useEffect, useState } from "react";
import { createWalletClient, custom } from "viem";
import * as chains from "viem/chains";
import { extractChain } from "viem/utils";
const GelatoMegaPrivyProviderContext = createContext(undefined);
export const useGelatoMegaPrivyContext = () => {
    const context = useContext(GelatoMegaPrivyProviderContext);
    if (!context) {
        throw new Error("useGelatoMegaPrivyProvider must be used within a GelatoMegaPrivyProvider");
    }
    return context;
};
const GelatoMegaPrivyInternal = ({ children, wagmiConfig }) => {
    const { ready, authenticated, logout } = usePrivy();
    const { wallets, ready: walletsReady } = useWallets();
    const { signAuthorization } = useSignAuthorization();
    const [walletClient, setWalletClient] = useState(null);
    const logoutWrapper = async () => {
        if (!walletClient) {
            return;
        }
        setWalletClient(null);
        await logout();
    };
    const switchNetwork = async (chain) => {
        if (!walletClient) {
            return;
        }
        const primaryWallet = wallets[0];
        await primaryWallet.switchChain(chain.id);
        walletClient.switchChain({ id: chain.id });
    };
    useEffect(() => {
        if (!ready || !walletsReady) {
            return;
        }
        if (!authenticated || !wallets || wallets.length === 0) {
            setWalletClient(null);
            return;
        }
        const fetchWalletClient = async () => {
            const primaryWallet = wallets[0];
            try {
                // Privy wallet provides chainId in CAIP2 format
                const { reference: chainId } = ChainId.parse(primaryWallet.chainId);
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                const chain = extractChain({ chains: Object.values(chains), id: Number(chainId) });
                if (!chain) {
                    return;
                }
                const provider = await primaryWallet.getEthereumProvider();
                const walletClient = createWalletClient({
                    account: primaryWallet.address,
                    chain,
                    transport: custom(provider)
                });
                walletClient.signAuthorization = async (parameters) => {
                    const { chainId, nonce } = parameters;
                    const contractAddress = parameters.contractAddress ?? parameters.address;
                    if (!contractAddress) {
                        throw new Error("Contract address is required");
                    }
                    const signedAuthorization = await signAuthorization({
                        contractAddress,
                        chainId,
                        nonce
                    });
                    return signedAuthorization;
                };
                setWalletClient(walletClient);
            }
            catch (error) {
                console.error("Failed to get wallet client:", error);
            }
        };
        fetchWalletClient();
    }, [ready, wallets, walletsReady, authenticated, signAuthorization]);
    return (_jsx(GelatoMegaPrivyProviderContext.Provider, { value: {
            walletClient: walletClient,
            wagmiConfig,
            logout: logoutWrapper,
            switchNetwork
        }, children: children }));
};
export const GelatoMegaPrivyContextProvider = ({ children, settings }) => {
    const queryClient = new QueryClient();
    const wagmiConfig = settings.wagmiConfigParameters
        ? createConfig(settings.wagmiConfigParameters)
        : undefined;
    return (_jsx(PrivyProvider, { appId: settings.appId, config: {
            defaultChain: settings.defaultChain ?? chains.sepolia
        }, children: _jsx(GelatoMegaPrivyInternal, { wagmiConfig: wagmiConfig, children: wagmiConfig ? (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(WagmiProvider, { config: wagmiConfig, children: children }) })) : (children) }) }));
};
