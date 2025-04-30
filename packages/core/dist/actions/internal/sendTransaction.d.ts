import { type Account, type Call, type Chain, type Hex, type PublicActions, type SignedAuthorizationList, type Transport, type WalletClient } from "viem";
import type { Payment } from "../../payment/index.js";
export declare function sendTransaction<transport extends Transport = Transport, chain extends Chain = Chain, account extends Account = Account>(client: WalletClient<transport, chain, account> & PublicActions<transport, chain, account>, calls: Call[], payment: Payment, authorizationList?: SignedAuthorizationList, opData?: Hex | undefined): Promise<`0x${string}`>;
