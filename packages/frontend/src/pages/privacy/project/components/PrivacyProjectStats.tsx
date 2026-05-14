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
        className="max-md:hidden"
        title="Total Value Secured"
        value={
          <div className="flex flex-col md:gap-1">
            <span>{formatCurrency(totalValueSecuredUsd ?? 0, 'usd')}</span>
            <span className="font-medium text-paragraph-12 text-secondary leading-normal">
              across {formatInteger(assetsCount ?? 0)} assets and{' '}
              {formatInteger(bucketsCount ?? 0)} buckets
            </span>
          </div>
        }
      />
      <ProjectSummaryStat
        className="md:hidden"
        title="TVS"
        value={formatCurrency(totalValueSecuredUsd ?? 0, 'usd')}
      />
      <ProjectSummaryStat
        className="md:hidden"
        title="Assets tracked"
        value={formatInteger(assetsCount ?? 0)}
      />
      <ProjectSummaryStat
        className="md:hidden"
        title="Buckets tracked"
        value={formatInteger(bucketsCount ?? 0)}
      />
      <ProjectSummaryStat
        title="Deposits 7D"
        value={formatInteger(deposits.last7d ?? 0)}
      />
      <ProjectSummaryStat
        title="Deposits 30D"
        value={formatInteger(deposits.last30d ?? 0)}
      />
      <ProjectSummaryStat
        title="Deposits Total"
        value={formatInteger(deposits.total ?? 0)}
      />
    </div>
  )
}
