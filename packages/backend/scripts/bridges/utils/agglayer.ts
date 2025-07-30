export const createAgglayerTransferId = (
  assetOriginNetwork: bigint,
  assetOriginAddress: string,
  destinationAddress: string,
  amount: bigint,
  depositCount: bigint,
): string => {
  return `agglayer_${assetOriginNetwork}_${assetOriginAddress.toLowerCase()}_${destinationAddress.toLowerCase()}_${amount}_${depositCount}`
}

export const AGGLAYER_CONSTANTS = {
  LEAF_TYPE: {
    ASSET: 0n,
    MESSAGE: 1n,
  },
  GLOBAL_INDEX: {
    LOCAL_ROOT_INDEX_BITS: 32,
    ROLLUP_INDEX_BITS: 32,
    MAINNET_FLAG_BIT: 1,
    UNUSED_BITS: 191,
  },
  METADATA_ENCODING: {
    MIN_LENGTH: 192, // Minimum hex characters for valid ABI encoding (3 x 32 bytes)
    MAX_STRING_LENGTH: 1000, // Sanity check for string lengths
    DECIMALS_MAX: 255, // Maximum valid decimals for tokens
  },
} as const

export function decodeGlobalIndex(globalIndex: bigint) {
  const { LOCAL_ROOT_INDEX_BITS, ROLLUP_INDEX_BITS } =
    AGGLAYER_CONSTANTS.GLOBAL_INDEX

  // Extract the last 32 bits (localRootIndex)
  const localRootIndex =
    globalIndex & ((1n << BigInt(LOCAL_ROOT_INDEX_BITS)) - 1n)

  // Extract rollup index (bits 32-63)
  const rollupIndex =
    (globalIndex >> BigInt(LOCAL_ROOT_INDEX_BITS)) &
    ((1n << BigInt(ROLLUP_INDEX_BITS)) - 1n)

  // Extract mainnet flag (bit 64)
  const mainnetFlag =
    ((globalIndex >> BigInt(LOCAL_ROOT_INDEX_BITS + ROLLUP_INDEX_BITS)) &
      1n) ===
    1n

  return {
    mainnetFlag,
    rollupIndex,
    localRootIndex,
  }
}

export function isAssetBridging(leafType: bigint): boolean {
  return leafType === AGGLAYER_CONSTANTS.LEAF_TYPE.ASSET
}
