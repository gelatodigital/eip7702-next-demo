import { type Account, type Call, type Chain, type PublicActions, type Transport, type WalletClient } from "viem";
export declare function getOpData<transport extends Transport = Transport, chain extends Chain = Chain, account extends Account = Account>(client: WalletClient<transport, chain, account> & PublicActions<transport, chain, account>, calls: Call[]): Promise<`0x${string}`>;
