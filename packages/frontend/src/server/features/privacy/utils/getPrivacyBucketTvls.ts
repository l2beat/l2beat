import type { ProjectPrivacyToken, TvsToken } from '@l2beat/config'
import type { TokenValueRecord, TvsEscrowValueRecord } from '@l2beat/database'
import { getPrivacyBucketAddress } from '@l2beat/shared'

/**
 * Value of each bucket's pool, by bucket id, taken from the escrow values the
 * TVS backend stores next to each token value. Only rows at the timestamp of
 * their token's latest value count, so buckets add up to the asset value.
 */
export function getPrivacyBucketTvls(
  tokens: ProjectPrivacyToken[],
  tvsConfig: TvsToken[],
  tokenValues: TokenValueRecord[],
  escrowValues: TvsEscrowValueRecord[],
): Map<string, number> {
  const latestByTokenId = new Map(
    tokenValues.map((value) => [value.tokenId, value.timestamp]),
  )
  const symbolByTokenId = new Map<string, string>(
    tvsConfig.map((t) => [t.id, t.symbol]),
  )
  const latest = escrowValues.filter(
    (e) => latestByTokenId.get(e.tokenId) === e.timestamp,
  )

  const result = new Map<string, number>()
  for (const token of tokens) {
    for (const bucket of token.buckets) {
      const { chain, address } = getPrivacyBucketAddress(bucket.address)
      const rows = latest.filter(
        (e) =>
          symbolByTokenId.get(e.tokenId) === token.token.symbol &&
          e.chain === chain &&
          e.escrowAddress.toLowerCase() === address.toLowerCase(),
      )
      if (rows.length > 0) {
        result.set(
          bucket.id,
          rows.reduce((sum, e) => sum + e.value, 0),
        )
      }
    }
  }
  return result
}
