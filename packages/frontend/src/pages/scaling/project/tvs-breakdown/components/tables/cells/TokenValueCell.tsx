import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { formatNumberWithCommas } from '~/utils/number-format/formatNumber'

interface Props {
  usdValue: number
  syncStatus?: string
}

export function TokenValueCell({ usdValue, syncStatus }: Props) {
  return (
    <SyncStatusWrapper isSynced={syncStatus === undefined}>
      <div className="font-bold text-xs">
        ${formatNumberWithCommas(+usdValue)}
      </div>
    </SyncStatusWrapper>
  )
}
