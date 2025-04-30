import { jsx as _jsx } from "react/jsx-runtime";
import { EthereumWalletConnectors, isEthereumWallet } from "@dynamic-labs/ethereum";
import { DynamicContextProvider, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { isTurnkeyWalletConnector } from "@dynamic-labs/wallet-connector-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { WagmiProvider, createConfig } from "wagmi";
const GelatoMegaDynamicProviderContext = createContext(undefined);
export const useGelatoMegaDynamicContext = () => {
    const context = useContext(GelatoMegaDynamicProviderContext);
    if (!context) {
        throw new Error("useGelatoMegaDynamicProvider must be used within a GelatoMegaDynamicProvider");
    }
    return context;
};
const GelatoMegaDynamicInternal = ({ children, defaultChain, wagmiConfig }) => {
    const { primaryWallet, handleLogOut } = useDynamicContext();
    const [walletClient, setWalletClient] = useState(null);
    const logoutHandler = async () => {
        setWalletClient(null);
        await handleLogOut();
    };
    const switchNetwork = async (chain) => {
        if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
            return;
        }
        await primaryWallet.switchNetwork(chain.id);
    };
    useEffect(() => {
        const fetchWalletClient = async () => {
            if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
                return;
            }
            const connector = primaryWallet.connector;
            if (!connector || !isTurnkeyWalletConnector(connector)) {
                return;
            }
            try {
                if (defaultChain) {
                    await primaryWallet.switchNetwork(defaultChain.id);
                }
                const client = await primaryWallet.getWalletClient();
                client.account.signAuthorization = async (parameters) => {
                    const { chainId, nonce } = parameters;
                    const contractAddress = parameters.contractAddress ?? parameters.address;
                    const signedAuthorization = await connector.experimental_signAuthorization({
                        contractAddress
                    });
                    return {
                        address: contractAddress,
                        chainId,
                        nonce,
                        r: signedAuthorization.r,
                        s: signedAuthorization.s,
                        v: signedAuthorization.v,
                        yParity: signedAuthorization.yParity
                    };
                };
                setWalletClient(client);
            }
            catch (error) {
                console.error("Failed to get wallet client:", error);
            }
        };
        fetchWalletClient();
    }, [primaryWallet, defaultChain]);
    return (_jsx(GelatoMegaDynamicProviderContext.Provider, { value: {
            walletClient: walletClient,
            wagmiConfig,
            logout: logoutHandler,
            switchNetwork
        }, children: children }));
};
export const GelatoMegaDynamicContextProvider = ({ children, settings }) => {
    const queryClient = new QueryClient();
    const wagmiConfig = settings.wagmiConfigParameters
        ? createConfig(settings.wagmiConfigParameters)
        : undefined;
    return (_jsx(DynamicContextProvider, { settings: {
            environmentId: settings.appId,
            walletConnectors: [EthereumWalletConnectors]
        }, children: _jsx(GelatoMegaDynamicInternal, { defaultChain: settings.defaultChain, wagmiConfig: wagmiConfig, children: wagmiConfig ? (_jsx(WagmiProvider, { config: wagmiConfig, children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(DynamicWagmiConnector, { children: children }) }) })) : (children) }) }));
};
