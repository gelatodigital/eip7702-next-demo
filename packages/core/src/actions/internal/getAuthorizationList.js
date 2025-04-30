import { getCode } from "viem/actions";
import { DELEGATION_ADDRESSES } from "../../constants/index.js";
import { lowercase } from "../../utils/index.js";
export async function getAuthorizationList(client, payment) {
    const address = client.account.address;
    const bytecode = await getCode(client, { address });
    const isEip7702Authorized = Boolean(bytecode?.length &&
        bytecode.length > 0 &&
        lowercase(bytecode) === lowercase(`0xef0100${DELEGATION_ADDRESSES[client.chain.id].slice(2)}`));
    return isEip7702Authorized
        ? []
        : [
            await client.signAuthorization({
                account: client.account,
                contractAddress: DELEGATION_ADDRESSES[client.chain.id],
                executor: payment.type === "native" ? "self" : undefined
            })
        ];
}
