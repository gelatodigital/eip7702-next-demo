import type { Account, Chain, PublicActions, Transport, WalletClient } from "viem";
import { type MegaActions } from "./actions/index.js";
export type MegaClient<transport extends Transport, chain extends Chain, account extends Account> = WalletClient<transport, chain, account> & PublicActions<transport, chain, account> & MegaActions;
export declare const createMegaClient: <transport extends Transport, chain extends Chain, account extends Account>(client: WalletClient<transport, chain, account>) => MegaClient<transport, chain, account>;
