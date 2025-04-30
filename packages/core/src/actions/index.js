import { execute } from "./execute.js";
export function actions(client) {
    return {
        execute: (args) => execute(client, args)
    };
}
