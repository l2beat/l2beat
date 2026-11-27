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
import {
  PERIOD_METRICS,
  type PeriodMetric,
} from '~/server/features/gas-fees/daily/metrics'
import type { GasFeesChain } from '~/server/features/gas-fees/getGasFeesChains'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { DEFAULT_METRIC, METRIC_LABELS } from '../../utils/metricLabels'
import {
  DEFAULT_TABLE_RANGE,
  GAS_FEES_RANGES,
  type GasFeesRangeOption,
} from '../../utils/ranges'
import { CostsTable } from './CostsTable'

export function CostsCard({
  chains,
  initialRange,
}: {
  chains: GasFeesChain[]
  initialRange: ChartRange
}) {
  const trpc = useTRPC()
  const [metric, setMetric] = useState<PeriodMetric>(DEFAULT_METRIC)
  // The first range is the server's, so the prefetched data is used
  const [{ option, range }, setPeriod] = useState<{
    option: GasFeesRangeOption
    range: ChartRange
  }>({ option: DEFAULT_TABLE_RANGE, range: initialRange })
  const { data, isPlaceholderData, isError } = useChartQuery(
    trpc.gasFees.summary,
    { range },
  )
  const period = GAS_FEES_RANGES.find((r) => r.value === option)?.period

  return (
    <PrimaryCard className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-bold text-xl md:text-2xl">
            What one transaction costs
          </h2>
          <p className="text-secondary text-sm">
            {METRIC_LABELS[metric].title}, {period}. Log scale. L2 costs add the
            chain’s average L1 fee per transaction.
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
              {PERIOD_METRICS.map((m) => (
                <SelectItem key={m} value={m}>
                  {METRIC_LABELS[m].tab}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <RadioGroup
            name="gasFeesTableRange"
            value={option}
            onValueChange={(v) => {
              const next = v as GasFeesRangeOption
              setPeriod({ option: next, range: optionToRange(next) })
            }}
          >
            {GAS_FEES_RANGES.map((r) => (
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
