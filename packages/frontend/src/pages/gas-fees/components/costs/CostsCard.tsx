import { useState } from 'react'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { PeriodMetric } from '~/server/features/gas-fees/daily/metrics'
import type { GasFeesChain } from '~/server/features/gas-fees/getGasFeesChains'
import { useTRPC } from '~/trpc/React'
import {
  type ChartRange,
  type ChartRangePredefinedOption,
  optionToRange,
} from '~/utils/range/range'
import { titleOf } from '../compare/feeChartMetrics'
import { CostsTable } from './CostsTable'

const METRICS: { value: PeriodMetric; label: string }[] = [
  { value: 'avgFee', label: 'Avg fee' },
  { value: 'transfer', label: 'ETH transfer' },
  { value: 'erc20', label: 'ERC-20' },
  { value: 'swap', label: 'Swap' },
]
const RANGES: {
  value: ChartRangePredefinedOption
  label: string
  period: string
}[] = [
  { value: '7d', label: '7D', period: 'past 7 days' },
  { value: '30d', label: '30D', period: 'past 30 days' },
  { value: '90d', label: '90D', period: 'past 90 days' },
  { value: '1y', label: '1Y', period: 'past year' },
  { value: 'max', label: 'MAX', period: 'all days stored' },
]

export function CostsCard({
  chains,
  initialRange,
}: {
  chains: GasFeesChain[]
  initialRange: ChartRange
}) {
  const trpc = useTRPC()
  const [metric, setMetric] = useState<PeriodMetric>('erc20')
  const [option, setOption] = useState<ChartRangePredefinedOption>('30d')
  // The first range is the server's, so the prefetched data is used
  const [range, setRange] = useState(initialRange)
  const { data, isPlaceholderData, isError } = useChartQuery(
    trpc.gasFees.summary,
    { range },
  )
  const period = RANGES.find((r) => r.value === option)?.period

  return (
    <PrimaryCard className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-bold text-xl md:text-2xl">
            What one transaction costs
          </h2>
          <p className="text-secondary text-sm">
            {titleOf(metric)}, {period}. Log scale. L2 costs add the chain’s
            average L1 fee per transaction.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={metric}
            onValueChange={(v) => setMetric(v as PeriodMetric)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METRICS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <RadioGroup
            name="gasFeesTableRange"
            value={option}
            onValueChange={(v) => {
              const next = v as ChartRangePredefinedOption
              setOption(next)
              setRange(optionToRange(next))
            }}
          >
            {RANGES.map((r) => (
              <RadioGroupItem key={r.value} value={r.value}>
                {r.label}
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </div>
      </div>
      {isError ? (
        <p className="py-10 text-center text-secondary text-sm">
          Couldn’t load the costs for this period.
        </p>
      ) : (
        <CostsTable
          chains={chains}
          summaries={data}
          metric={metric}
          isPlaceholderData={isPlaceholderData}
        />
      )}
    </PrimaryCard>
  )
}
