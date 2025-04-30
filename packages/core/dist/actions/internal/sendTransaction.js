import { ethAddress } from "viem";
import { encodeExecuteData } from "viem/experimental/erc7821";
import { callGelatoAccount, sponsoredCall } from "../../relay/index.js";
export async function sendTransaction(client, calls, payment, authorizationList, opData) {
    switch (payment.type) {
        case "native": {
            return await callGelatoAccount({
                chainId: client.chain.id,
                target: client.account.address,
                data: encodeExecuteData({
                    calls,
                    opData
                }),
                feeToken: ethAddress,
                authorizationList
            });
        }
        case "sponsored": {
            return await sponsoredCall({
                chainId: client.chain.id,
                target: client.account.address,
                data: encodeExecuteData({
                    calls,
                    opData
                }),
                sponsorApiKey: payment.apiKey,
                authorizationList
            });
        }
        case "erc20": {
            return await callGelatoAccount({
                chainId: client.chain.id,
                target: client.account.address,
                feeToken: payment.token,
                data: encodeExecuteData({
                    calls,
                    opData
                }),
                authorizationList
            });
        }
        default: {
            throw new Error("Unsupported payment type");
        }
    }
}
