import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'

interface Props {
  totalValueSecuredUsd: number
  deposits: {
    total: number
    last7d: number
    last30d: number
  }
}

export function PrivacyProjectStats({ totalValueSecuredUsd, deposits }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <ProjectSummaryStat
        title="Total Value Secured"
        value={formatCurrency(totalValueSecuredUsd, 'usd')}
        valueClassName="text-heading-28"
      />
      <ProjectSummaryStat
        title="Deposits 7D"
        value={formatInteger(deposits.last7d)}
        valueClassName="text-heading-28"
      />
      <ProjectSummaryStat
        title="Deposits 30D"
        value={formatInteger(deposits.last30d)}
        valueClassName="text-heading-28"
      />
      <ProjectSummaryStat
        title="Deposits Total"
        value={formatInteger(deposits.total)}
        valueClassName="text-heading-28"
      />
    </div>
  )
}
