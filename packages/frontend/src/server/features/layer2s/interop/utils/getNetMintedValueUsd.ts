/**
 * Net minted = minted − burned. When only one side is present (lock-and-mint aggregates),
 * the missing side is treated as zero.
 */
export function getNetMintedValueUsd<
  T extends {
    mintedValueUsd: number | undefined
    burnedValueUsd: number | undefined
  },
>(data: T): number | undefined {
  if (data.mintedValueUsd === undefined && data.burnedValueUsd === undefined) {
    return undefined
  }
  return (data.mintedValueUsd ?? 0) - (data.burnedValueUsd ?? 0)
}
