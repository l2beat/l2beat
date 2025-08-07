import { useEffect, useState } from 'react'
import type { ChartMeta } from '../Chart'

export function useChartDataKeys<T extends ChartMeta>(
  chartMeta: T,
  hiddenDataKeys?: (keyof T)[],
) {
  const [dataKeys, setDataKeys] = useState<(keyof T)[]>(
    hiddenDataKeys
      ? Object.keys(chartMeta).filter((key) => !hiddenDataKeys.includes(key))
      : Object.keys(chartMeta),
  )

  useEffect(() => {
    setDataKeys(
      hiddenDataKeys
        ? Object.keys(chartMeta).filter((key) => !hiddenDataKeys.includes(key))
        : Object.keys(chartMeta),
    )
  }, [chartMeta, hiddenDataKeys])

  const toggleDataKey = (dataKey: keyof T | (string & {})) => {
    setDataKeys((prev) => {
      if (prev.includes(dataKey)) {
        return prev.filter((key) => key !== dataKey)
      }
      return [...prev, dataKey]
    })
  }

  return { dataKeys, toggleDataKey }
}
