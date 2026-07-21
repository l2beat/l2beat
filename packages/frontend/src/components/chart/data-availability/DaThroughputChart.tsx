import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { Checkbox } from '~/components/core/Checkbox'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { useIncludeLayer2sOnly } from '~/pages/data-availability/throughput/components/DaThroughputContext'
import { useTRPC } from '~/trpc/React'
import {
  type ChartRange,
  optionToRange,
  rangeToResolution,
} from '~/utils/range/range'
import { ChartRangeControls } from '../../core/chart/ChartRangeControls'
import { ChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '../../core/chart/utils/getChartTimeRangeFromData'
import { DaAbsoluteThroughputChart } from './DaAbsoluteThroughputChart'
import { DaPercentageThroughputChart } from './DaPercentageThroughputChart'
import { DaThroughputTimeRangeValues } from './timeRangeValues'

export function DaThroughputChart() {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(optionToRange('1y'))
  const [metric, setMetric] = useState<'percentage' | 'absolute'>('percentage')
  const { includeLayer2sOnly, setIncludeLayer2sOnly } = useIncludeLayer2sOnly()

  const { data: chartData, isLoading } = useQuery(
    trpc.da.chart.queryOptions({
      range,
      includeLayer2sOnly,
    }),
  )

  const resolution = rangeToResolution(range)
  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        chartData?.data.map(([timestamp]) => ({ timestamp })),
        { bucket: resolution },
      ),
    [chartData, resolution],
  )

  return (
    <div>
      <div className="mb-4">
        <h2 className="whitespace-nowrap font-bold text-xl md:text-2xl">
          {metric === 'percentage'
            ? 'Share of total data posted'
            : 'Total data posted'}
        </h2>
        <ChartTimeRange timeRange={timeRange} />
      </div>
      {metric === 'percentage' ? (
        <DaPercentageThroughputChart
          data={chartData?.data}
          isLoading={isLoading}
          includeLayer2sOnly={includeLayer2sOnly}
          syncStatus={chartData?.syncStatus}
          resolution={resolution}
          range={range}
        />
      ) : (
        <DaAbsoluteThroughputChart
          data={chartData?.data}
          isLoading={isLoading}
          includeLayer2sOnly={includeLayer2sOnly}
          syncStatus={chartData?.syncStatus}
          resolution={resolution}
        />
      )}
      <div className="mt-2 flex justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <RadioGroup
            name="metric"
            value={metric}
            onValueChange={(v) => setMetric(v as 'percentage' | 'absolute')}
          >
            <RadioGroupItem value="percentage">Percentage</RadioGroupItem>
            <RadioGroupItem value="absolute">Absolute</RadioGroupItem>
          </RadioGroup>
          <Checkbox
            name="include-layer2s-only"
            checked={includeLayer2sOnly}
            onCheckedChange={(checked) =>
              setIncludeLayer2sOnly(
                checked === 'indeterminate' ? false : checked,
              )
            }
          >
            <span className="max-lg:hidden">
              Include only projects scaling Ethereum
            </span>
            <span className="lg:hidden">Ethereum scaling projects only</span>
          </Checkbox>
        </div>
        <ChartRangeControls
          name="da-throughput"
          value={range}
          setValue={setRange}
          options={Object.values(DaThroughputTimeRangeValues).map((v) => ({
            value: v,
            label: v.toUpperCase(),
          }))}
        />
      </div>
    </div>
  )
}
