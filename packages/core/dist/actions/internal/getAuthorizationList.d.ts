import type { Account, Chain, PublicActions, Transport, WalletClient } from "viem";
import type { Payment } from "../../payment/index.js";
export declare function getAuthorizationList<transport extends Transport = Transport, chain extends Chain = Chain, account extends Account = Account>(client: WalletClient<transport, chain, account> & PublicActions<transport, chain, account>, payment: Payment): Promise<import("viem/actions").SignAuthorizationReturnType[]>;
