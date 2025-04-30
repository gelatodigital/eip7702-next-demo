import type { Account, Call, Chain, Hash, PublicActions, Transport, WalletClient } from "viem";
import type { Payment } from "../payment/index.js";
export type MegaActions = {
    execute: (args: {
        payment: Payment;
        calls: Call[];
    }) => Promise<Hash>;
};
export declare function actions<transport extends Transport = Transport, chain extends Chain = Chain, account extends Account = Account>(client: WalletClient<transport, chain, account> & PublicActions<transport, chain, account>): MegaActions;
