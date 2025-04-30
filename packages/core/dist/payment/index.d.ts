import type { Address, Chain } from "viem";
export interface NativePayment {
    readonly type: "native";
}
export interface ERC20Payment {
    readonly type: "erc20";
    readonly token: Address;
}
export interface SponsoredPayment {
    readonly type: "sponsored";
    readonly apiKey: string;
}
export type Payment = NativePayment | ERC20Payment | SponsoredPayment;
export declare const native: () => NativePayment;
export declare const erc20: (token: Address) => ERC20Payment;
export declare const isErc20: (payment: Payment) => payment is ERC20Payment;
export declare const isNative: (payment: Payment) => payment is NativePayment;
export declare const sponsored: (apiKey: string) => SponsoredPayment;
export declare const feeCollector: (chain: Chain) => Address;
