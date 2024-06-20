'use client'

import { Chart } from '~/app/_components/chart/chart'
import { type ChartColumn } from '~/app/_components/chart/chart-context'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency, formatCurrencyExactValue } from '~/utils/format'

interface SummaryChartPointData {
  timestamp: number
  usdValue: number
  ethValue: number
}
type SummaryChartColumn = ChartColumn<SummaryChartPointData>

interface Props {
  columns: SummaryChartColumn[]
}
export function SummaryChart({ columns }: Props) {
  return (
    <>
      <RadioGroup defaultValue="option-one">
        <RadioGroupItem value="option-one" id="option-one">
          USD
        </RadioGroupItem>
        <RadioGroupItem value="option-two" id="option-two">
          ETH
        </RadioGroupItem>
      </RadioGroup>
      <Chart
        columns={columns}
        valuesStyle={[
          {
            fill: 'signature gradient',
            line: 'signature gradient',
            point: 'circle',
          },
        ]}
        formatYAxisLabel={(value: number) =>
          // Pass UNIT from controls
          formatCurrency(value, 'usd', { showLessThanMinimum: false })
        }
        range={[1687039200, 1718661600]}
        useLogScale={false}
        renderHoverContents={(data) => <ChartHover data={data} />}
      />
    </>
  )
}

function ChartHover({ data }: { data: SummaryChartPointData }) {
  const formattedUsd = formatCurrencyExactValue(data.usdValue, 'USD')
  const formattedEth = formatCurrencyExactValue(data.ethValue, 'ETH')
  return (
    <div>
      <div className="mb-1 whitespace-nowrap">
        {formatTimestamp(data.timestamp, {
          mode: 'datetime',
        })}
      </div>
      <div className="flex w-full justify-between items-center gap-2">
        <span className="dark:text-gray-50 text-gray-700 text-sm">USD</span>
        {formattedUsd}
      </div>
      <div className="flex w-full justify-between items-center gap-2">
        <span className="dark:text-gray-50 text-gray-700 text-sm">ETH</span>
        {formattedEth}
      </div>
    </div>
  )
}
