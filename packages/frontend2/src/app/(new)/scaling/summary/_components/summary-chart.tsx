'use client'

import { Chart } from '~/app/_components/chart/chart'
import { formatCurrency } from '~/utils/format'

interface Props {
  columns: {
    values: number[]
    data: {
      timestamp: number
      usdValue: number
      ethValue: number
    }
  }[]
}
export function SummaryChart({ columns }: Props) {
  return (
    <Chart
      className="h-60 w-full"
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
      renderHoverContents={(x) => `${x.ethValue}`}
    />
  )
}
