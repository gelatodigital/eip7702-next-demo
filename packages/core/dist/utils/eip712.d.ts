import type { Address, Call, TypedDataDefinition } from "viem";
export declare const serializeTypedData: (chainId: number, accountAddress: Address, calls: Call[], nonce: bigint) => TypedDataDefinition;
