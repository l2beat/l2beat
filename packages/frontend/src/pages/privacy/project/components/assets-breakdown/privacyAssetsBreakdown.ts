import type { PrivacyAsset } from '~/server/features/privacy/types'

// In a .ts file so the server-side markdown can use it without bundling React components.

export function formatBucketLabel(label: string) {
  return label.toLowerCase().endsWith('bucket') ? label : `${label} bucket`
}

export function getPrivacyAssetsTotals(assets: PrivacyAsset[]) {
  return {
    totalValueUsd: assets.reduce<number | null>(
      (sum, asset) =>
        asset.totalValueUsd === null ? sum : (sum ?? 0) + asset.totalValueUsd,
      null,
    ),
    deposits: {
      total: assets.reduce((sum, asset) => sum + asset.deposits.total, 0),
      last7d: assets.reduce((sum, asset) => sum + asset.deposits.last7d, 0),
      last30d: assets.reduce((sum, asset) => sum + asset.deposits.last30d, 0),
    },
    depositedValueUsd: {
      total: assets.reduce(
        (sum, asset) => sum + asset.depositedValueUsd.total,
        0,
      ),
      last7d: assets.reduce(
        (sum, asset) => sum + asset.depositedValueUsd.last7d,
        0,
      ),
      last30d: assets.reduce(
        (sum, asset) => sum + asset.depositedValueUsd.last30d,
        0,
      ),
    },
  }
}
