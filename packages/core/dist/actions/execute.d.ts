import type { Account, Call, Chain, Hash, PublicActions, Transport, WalletClient } from "viem";
import { type Payment } from "../payment/index.js";
/**
 *
 * @param client - Client.
 * @param parameters - Execution parameters.
 * @returns Transaction hash.
 */
export declare function execute<transport extends Transport = Transport, chain extends Chain = Chain, account extends Account = Account>(client: WalletClient<transport, chain, account> & PublicActions<transport, chain, account>, parameters: {
    payment: Payment;
    calls: Call[];
}): Promise<Hash>;
