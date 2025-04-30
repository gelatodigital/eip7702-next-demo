import type { Account, Chain, PublicActions, Transport, WalletClient } from "viem";
import { type ERC20Payment } from "../../payment/index.js";
export declare function verifyAndBuildERC20PaymentCall<transport extends Transport = Transport, chain extends Chain = Chain, account extends Account = Account>(client: WalletClient<transport, chain, account> & PublicActions<transport, chain, account>, payment: ERC20Payment): Promise<{
    to: `0x${string}`;
    data: `0x${string}`;
    value: bigint;
}>;
