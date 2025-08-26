import { useEffect, useState } from 'react'
import type { ChartMeta } from '../Chart'

export function useChartDataKeys<T extends ChartMeta>(
  chartMeta: T,
  hiddenDataKeys?: (keyof T)[] | readonly (keyof T)[],
) {
  const [showAllSelected, setShowAllSelected] = useState(false)
  const [dataKeys, setDataKeys] = useState<(keyof T)[] | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: do not re-run this effect when showAllDataKeys changes
  useEffect(() => {
    if (showAllSelected) {
      setDataKeys(Object.keys(chartMeta))
      return
    }

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

  const toggleDataKey = (dataKey: keyof T | (string & {})) => {
    const newDataKeys = dataKeys?.includes(dataKey)
      ? dataKeys.filter((key) => key !== dataKey)
      : [...(dataKeys ?? []), dataKey]

    setShowAllSelected(newDataKeys.length === Object.keys(chartMeta).length)
    setDataKeys(newDataKeys)
  }

  const toggleAllDataKeys = () => {
    setDataKeys(showAllSelected ? [] : Object.keys(chartMeta))
    setShowAllSelected((prev) => !prev)
  }

  return {
    showAllSelected,
    dataKeys: dataKeys ?? [],
    toggleDataKey,
    toggleAllDataKeys,
  }
}
