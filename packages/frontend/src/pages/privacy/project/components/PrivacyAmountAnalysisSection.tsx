import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import { PrivacyAddressAmountBucketsChart } from './PrivacyAddressAmountBucketsChart'

const DEPOSIT_COLOR = 'var(--chart-emerald)'
const WITHDRAWAL_COLOR = 'var(--chart-pink)'

interface Props {
  projectId: string
}

export function PrivacyAmountAnalysisSection({ projectId }: Props) {
  const { data, isLoading } = api.privacy.projectAmountAnalysis.useQuery({
    projectId,
  })

  const charts = [
    <PrivacyAddressAmountBucketsChart
      key="deposit"
      title="Deposits by address size"
      buckets={data?.deposits.buckets ?? []}
      color={DEPOSIT_COLOR}
      isLoading={isLoading}
    />,
    <PrivacyAddressAmountBucketsChart
      key="withdrawal"
      title="Withdrawals by address size"
      buckets={data?.withdrawals.buckets ?? []}
      color={WITHDRAWAL_COLOR}
      isLoading={isLoading}
    />,
  ]

  const overlapPct = data?.overlap.withdrawersAlsoDepositorsPct

  return (
    <div className="space-y-4">
      {overlapPct !== undefined && (
        <p className="text-paragraph-15 text-primary md:text-paragraph-16">
          <span className="font-bold">{overlapPct.toFixed(1)}%</span> of
          withdrawers are also depositors.
        </p>
      )}
      {charts.map((chart) => (
        <PrimaryCard key={chart.key}>{chart}</PrimaryCard>
      ))}
    </div>
  )
}
