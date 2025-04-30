import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { GelatoMegaDynamicContextProvider, useGelatoMegaDynamicContext } from "@gelatomega/react-dynamic";
import { GelatoMegaPrivyContextProvider, useGelatoMegaPrivyContext } from "@gelatomega/react-privy";
import { createContext, useContext } from "react";
import { sepolia } from "viem/chains";
const GelatoMegaProviderContext = createContext(undefined);
export const useGelatoMegaProviderContext = () => {
    const context = useContext(GelatoMegaProviderContext);
    if (!context) {
        throw new Error("useGelatoMegaProviderContext must be used within a GelatoMegaContextProvider");
    }
    return context;
};
export const GelatoMegaContextProvider = ({ children, type, settings }) => {
    const GelatoMegaProviderInner = ({ children }) => {
        const context = type === "dynamic" ? useGelatoMegaDynamicContext() : useGelatoMegaPrivyContext();
        return (_jsx(GelatoMegaProviderContext.Provider, { value: { ...context, type }, children: children }));
    };
    return (_jsx(_Fragment, { children: type === "dynamic" ? (_jsx(GelatoMegaDynamicContextProvider, { settings: {
                appId: settings.appId,
                defaultChain: settings.defaultChain ?? sepolia,
                wagmiConfigParameters: settings.wagmiConfigParameters
            }, children: _jsx(GelatoMegaProviderInner, { children: children }) })) : (_jsx(GelatoMegaPrivyContextProvider, { settings: {
                appId: settings.appId,
                defaultChain: settings.defaultChain ?? sepolia,
                wagmiConfigParameters: settings.wagmiConfigParameters
            }, children: _jsx(GelatoMegaProviderInner, { children: children }) })) }));
};
