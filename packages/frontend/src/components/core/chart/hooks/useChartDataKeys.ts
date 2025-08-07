import { useState } from 'react'
import type { ChartMeta } from '../Chart'

export function useChartDataKeys(
  chartMeta: ChartMeta,
  hiddenDataKeys?: string[],
) {
  const [dataKeys, setDataKeys] = useState<string[]>(
    hiddenDataKeys
      ? Object.keys(chartMeta).filter((key) => !hiddenDataKeys.includes(key))
      : Object.keys(chartMeta),
  )

  const toggleDataKey = (dataKey: string) => {
    setDataKeys((prev) => {
      if (prev.includes(dataKey)) {
        return prev.filter((key) => key !== dataKey)
      }
      return [...prev, dataKey]
    })
  }

  return { dataKeys, toggleDataKey }
}
