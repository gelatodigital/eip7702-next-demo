import type { Account, Chain, PublicActions, Transport, WalletClient } from "viem";
export declare function verifyAndBuildNativePaymentCall<transport extends Transport = Transport, chain extends Chain = Chain, account extends Account = Account>(client: WalletClient<transport, chain, account> & PublicActions<transport, chain, account>): Promise<{
    to: `0x${string}`;
    value: bigint;
}>;
