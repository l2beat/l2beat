import type { PrivacyProjectConfig } from './types'

export interface PrivacyBucketInfo {
  decimals: number
  priceUsd: number | null
}

export function getPrivacyBucketKey(
  projectId: string,
  bucketId: string,
): string {
  return `${projectId}::${bucketId}`
}

export function buildPrivacyBucketInfoByKey(
  projects: PrivacyProjectConfig[],
  priceById: Map<string, number>,
): Map<string, PrivacyBucketInfo> {
  const bucketInfoByKey = new Map<string, PrivacyBucketInfo>()

  for (const project of projects) {
    const projectId = project.id.toString()

    for (const token of project.privacyInfo.tokens) {
      const priceUsd = priceById.get(token.token.priceId) ?? null

      for (const bucket of token.buckets) {
        bucketInfoByKey.set(getPrivacyBucketKey(projectId, bucket.id), {
          decimals: token.token.decimals,
          priceUsd,
        })
      }
    }
  }

  return bucketInfoByKey
}

export function amountToUsd(
  amount: bigint,
  decimals: number,
  priceUsd: number | null,
): number {
  if (priceUsd === null) return 0
  return bigintToNumber(amount, decimals) * priceUsd
}

export function bigintToNumber(value: bigint, decimals: number): number {
  if (decimals === 0) return Number(value)
  const divisor = 10n ** BigInt(decimals)
  const integer = value / divisor
  const fraction = value % divisor
  if (fraction === 0n) return Number(integer)

  const fractionDigits = fraction
    .toString()
    .padStart(decimals, '0')
    .replace(/0+$/, '')
    .slice(0, 8)

  return Number(
    `${integer.toString()}.${fractionDigits === '' ? '0' : fractionDigits}`,
  )
}
