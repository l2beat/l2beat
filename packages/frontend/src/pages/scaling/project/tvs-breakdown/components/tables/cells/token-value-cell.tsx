import { SyncStatusWrapper } from '~/components/sync-status-wrapper'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'

interface Props {
  usdValue: number
  syncStatus?: string
}

export function TokenValueCell({ usdValue, syncStatus }: Props) {
  return (
    <SyncStatusWrapper isSynced={syncStatus === undefined}>
      <div className="text-xs font-bold">
        ${formatNumberWithCommas(+usdValue)}
      </div>
    </SyncStatusWrapper>
  )
}
