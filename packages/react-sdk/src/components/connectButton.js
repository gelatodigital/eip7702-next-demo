import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { GelatoMegaDynamicConnectButton } from "@gelatomega/react-dynamic";
import { GelatoMegaPrivyConnectButton } from "@gelatomega/react-privy";
import { useGelatoMegaProviderContext } from "../provider.js";
export const GelatoMegaConnectButton = ({ children }) => {
    const { type } = useGelatoMegaProviderContext();
    return (_jsx(_Fragment, { children: type === "dynamic" ? (_jsx(GelatoMegaDynamicConnectButton, { children: children })) : (_jsx(GelatoMegaPrivyConnectButton, { children: children })) }));
};
