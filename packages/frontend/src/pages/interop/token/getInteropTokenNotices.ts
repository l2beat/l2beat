import compact from 'lodash/compact'
import type { InteropTokenDashboardData } from '~/server/features/layer2s/interop/getInteropTokenData'
import { formatTimestamp } from '~/utils/dates'

/** Shared by the HTML banner and the markdown warnings so both say the same. */
export function getInteropTokenNotices({
  token,
  tokenData,
  lastSyncedAt,
}: {
  token: { isPriceUnreliable: boolean }
  tokenData: InteropTokenDashboardData | null
  lastSyncedAt: number | undefined
}): string[] {
  return compact([
    getSyncNotice(tokenData, lastSyncedAt),
    token.isPriceUnreliable && UNRELIABLE_PRICE_NOTICE,
  ])
}

function getSyncNotice(
  tokenData: InteropTokenDashboardData | null,
  lastSyncedAt: number | undefined,
) {
  if (tokenData === null) return NOT_SYNCED_NOTICE
  if (lastSyncedAt === undefined) return undefined
  return `${NOT_SYNCED_NOTICE} Last synced: ${formatTimestamp(lastSyncedAt, { mode: 'datetime' })}.`
}

/** Volumes of a token without a reliable price are dropped, so its top protocol is picked by transfer count. */
export function getTopProtocolBasis(isPriceUnreliable: boolean) {
  return isPriceUnreliable ? '24h transfer count' : '24h volume'
}

export const NOT_SYNCED_NOTICE =
  'Data for the token is not synced. Please check again later.'

export const UNRELIABLE_PRICE_NOTICE =
  'USD values are not shown because the price of this token is unreliable.'
