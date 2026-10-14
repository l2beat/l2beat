import type { InteropTokenDashboardData } from '~/server/features/layer2s/interop/getInteropTokenData'
import { formatTimestamp } from '~/utils/dates'

/** Shared by the HTML banner and the markdown warnings so both say the same. */
export function getInteropTokenNotices(
  token: { isPriceUnreliable: boolean },
  data: Pick<
    InteropTokenDashboardData,
    'isSynced' | 'snapshotTimestamp'
  > | null,
): string[] {
  const notices: string[] = []
  if (!data) {
    notices.push(NOT_SYNCED_NOTICE)
  } else if (!data.isSynced && data.snapshotTimestamp !== undefined) {
    notices.push(
      `${NOT_SYNCED_NOTICE} Last synced: ${formatTimestamp(data.snapshotTimestamp, { mode: 'datetime' })}.`,
    )
  }
  if (token.isPriceUnreliable) {
    notices.push(UNRELIABLE_PRICE_NOTICE)
  }
  return notices
}

export const NOT_SYNCED_NOTICE =
  'Data for the token is not synced. Please check again later.'

export const UNRELIABLE_PRICE_NOTICE =
  'USD values are not shown because the price of this token is unreliable.'
