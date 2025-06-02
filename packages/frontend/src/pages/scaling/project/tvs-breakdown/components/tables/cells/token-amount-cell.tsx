import { SyncStatusWrapper } from '~/components/sync-status-wrapper'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'

interface Props {
  amount: number
  syncStatus?: string
}

export function TokenAmountCell({ amount, syncStatus }: Props) {
  return (
    <SyncStatusWrapper isSynced={syncStatus === undefined}>
      <div className="text-xs font-medium">
        {formatNumberWithCommas(+amount)}
      </div>
    </SyncStatusWrapper>
  )
}
