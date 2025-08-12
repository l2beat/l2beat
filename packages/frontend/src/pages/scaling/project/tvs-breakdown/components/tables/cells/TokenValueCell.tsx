import { SyncStatusWrapper } from '~/components/SyncStatusWrapper'
import { formatNumberWithCommas } from '~/utils/number-format/formatNumber'

interface Props {
  valueForProject: number
  syncStatus?: string
}

export function TokenValueCell({ valueForProject, syncStatus }: Props) {
  return (
    <SyncStatusWrapper isSynced={syncStatus === undefined}>
      <div className="font-bold text-xs">
        ${formatNumberWithCommas(+valueForProject)}
      </div>
    </SyncStatusWrapper>
  )
}
