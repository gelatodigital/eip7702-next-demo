import type { Hash, SignedAuthorizationList } from "viem";
interface BaseCallRequest {
    chainId: number;
    target: string;
    data: string;
    gasLimit?: string;
    retries?: number;
    authorizationList?: SignedAuthorizationList;
}
export interface SponsoredCallRequest extends BaseCallRequest {
    sponsorApiKey: string;
}
export interface CallGelatoAccountRequest extends BaseCallRequest {
    feeToken: string;
}
export declare const sponsoredCall: (request: SponsoredCallRequest) => Promise<Hash>;
export declare const callGelatoAccount: (request: CallGelatoAccountRequest) => Promise<Hash>;
export {};
