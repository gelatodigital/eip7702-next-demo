import { GELATO_API } from "../constants/index.js";
const callGelatoApi = async (endpoint, request) => {
    if ("authorizationList" in request && Array.isArray(request.authorizationList)) {
        if (request.authorizationList.length > 0) {
            delete request.authorizationList[0].v;
        }
        else {
            delete request.authorizationList;
        }
    }
    const { taskId, message } = await fetch(`${GELATO_API}${endpoint}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    }).then((raw) => raw.json());
    if (message)
        throw new Error(message);
    return taskId;
};
export const sponsoredCall = (request) => callGelatoApi("/relays/v2/sponsored-call-eip7702", request);
export const callGelatoAccount = (request) => callGelatoApi("/relays/v2/call-gelato-account", request);
