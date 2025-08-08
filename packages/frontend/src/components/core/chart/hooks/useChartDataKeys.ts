import { useEffect, useState } from 'react'
import type { ChartMeta } from '../Chart'

export function useChartDataKeys<T extends ChartMeta>(
  chartMeta: T,
  hiddenDataKeys?: (keyof T)[],
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
    if (showAllSelected) {
      setShowAllSelected(false)
    }

    setDataKeys((prev) => {
      if (prev?.includes(dataKey)) {
        return prev.filter((key) => key !== dataKey)
      }
      const result = [...(prev ?? []), dataKey]
      if (result.length === Object.keys(chartMeta).length) {
        setShowAllSelected(true)
      }
      return result
    })
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
