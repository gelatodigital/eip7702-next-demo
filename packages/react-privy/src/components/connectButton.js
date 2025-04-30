import { jsx as _jsx } from "react/jsx-runtime";
import { useLogin, usePrivy } from "@privy-io/react-auth";
export const GelatoMegaPrivyConnectButton = ({ children }) => {
    const { ready, authenticated } = usePrivy();
    const { login } = useLogin();
    const disableLogin = !ready || (ready && authenticated);
    return (_jsx("button", { type: "button", disabled: disableLogin, onClick: login, children: children }));
};
