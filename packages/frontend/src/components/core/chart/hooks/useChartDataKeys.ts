import { useEffect, useState } from 'react'
import type { ChartMeta } from '../Chart'

export function useChartDataKeys<T extends ChartMeta>(
  chartMeta: T,
  hiddenDataKeys?: (keyof T)[] | readonly (keyof T)[],
) {
  const [dataKeys, setDataKeys] = useState<(keyof T)[] | null>(null)

  useEffect(() => {
    if (Object.keys(chartMeta).length === 0) {
      return
    }

    setDataKeys((prev) => {
      if (prev) {
        return prev
      }

      return hiddenDataKeys
        ? Object.keys(chartMeta).filter((key) => !hiddenDataKeys.includes(key))
        : Object.keys(chartMeta)
    })
  }, [chartMeta, hiddenDataKeys])

  const allKeys = Object.keys(chartMeta)
  const showAllSelected =
    allKeys.length > 0 && (dataKeys ?? []).length === allKeys.length

  const toggleDataKey = (dataKey: keyof T | (string & {})) => {
    setDataKeys((prev) =>
      prev?.includes(dataKey)
        ? prev.filter((key) => key !== dataKey)
        : [...(prev ?? []), dataKey],
    )
  }

  const toggleAllDataKeys = () => {
    setDataKeys(showAllSelected ? [] : allKeys)
  }

  return {
    showAllSelected,
    dataKeys: dataKeys ?? [],
    toggleDataKey,
    toggleAllDataKeys,
  }
}
