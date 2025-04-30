export declare const isOracleActive: (chainId: number) => Promise<boolean>;
export declare const getGelatoOracles: () => Promise<string[]>;
export declare const getPaymentTokens: (chainId: number) => Promise<string[]>;
export declare const getEstimatedFee: (chainId: number, paymentToken: string, gasLimit: bigint, gasLimitL1: bigint) => Promise<bigint>;
