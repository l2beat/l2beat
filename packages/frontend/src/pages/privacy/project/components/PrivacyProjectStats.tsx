import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'

interface Props {
  totalValueSecuredUsd: number
  assetsCount: number
  bucketsCount: number
  deposits: {
    total: number
    last7d: number
    last30d: number
  }
}

export function PrivacyProjectStats({
  totalValueSecuredUsd,
  assetsCount,
  bucketsCount,
  deposits,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <ProjectSummaryStat
        title="Total Value Locked"
        value={
          <div className="flex flex-col md:gap-1">
            <span>{formatCurrency(totalValueSecuredUsd ?? 0, 'usd')}</span>
            <span className="font-medium text-paragraph-12 text-secondary leading-normal">
              across {formatInteger(assetsCount ?? 0)} assets and{' '}
              {formatInteger(bucketsCount ?? 0)} buckets
            </span>
          </div>
        }
        valueClassName="text-heading-28"
      />
      <ProjectSummaryStat
        title="Deposits 7D"
        value={formatInteger(deposits.last7d ?? 0)}
        valueClassName="text-heading-28"
      />
      <ProjectSummaryStat
        title="Deposits 30D"
        value={formatInteger(deposits.last30d ?? 0)}
        valueClassName="text-heading-28"
      />
      <ProjectSummaryStat
        title="Deposits Total"
        value={formatInteger(deposits.total ?? 0)}
        valueClassName="text-heading-28"
      />
    </div>
  )
}
