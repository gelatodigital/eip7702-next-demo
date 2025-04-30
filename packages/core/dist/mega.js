import { publicActions } from "viem";
import { actions } from "./actions/index.js";
import { DELEGATION_ADDRESSES } from "./constants/index.js";
export const createMegaClient = (client) => {
    if (!DELEGATION_ADDRESSES[client.chain.id])
        throw new Error(`Chain not supported: ${client.chain.id}`);
    return client.extend(publicActions).extend(actions);
};
