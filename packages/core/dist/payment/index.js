import { sepolia } from "viem/chains";
export const native = () => ({ type: "native" });
export const erc20 = (token) => ({
    type: "erc20",
    token
});
export const isErc20 = (payment) => payment.type === "erc20";
export const isNative = (payment) => payment.type === "native";
export const sponsored = (apiKey) => ({
    type: "sponsored",
    apiKey
});
export const feeCollector = (chain) => {
    switch (chain.id) {
        case sepolia.id:
            // TODO: change to production address
            return "0x92478C7eCCb3c7a3932263712C1555DbaEa7D56C";
        default:
            throw new Error(`Unsupported chain: ${chain.id}`);
    }
};
