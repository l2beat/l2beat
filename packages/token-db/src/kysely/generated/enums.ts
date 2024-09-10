export const ExternalBridgeType = {
    Axelar: "Axelar",
    LayerZeroV1: "LayerZeroV1",
    Orbit: "Orbit",
    Wormhole: "Wormhole"
} as const;
export type ExternalBridgeType = (typeof ExternalBridgeType)[keyof typeof ExternalBridgeType];
export const ExplorerType = {
    Etherscan: "Etherscan"
} as const;
export type ExplorerType = (typeof ExplorerType)[keyof typeof ExplorerType];
