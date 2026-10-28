import { useEffect, useState } from 'react'
import type { ChartMeta } from '../ChartContext'

export function useChartDataKeys<T extends ChartMeta>(
  chartMeta: T,
  hiddenDataKeys?: (keyof T)[] | readonly (keyof T)[],
) {
  const getDefaultDataKeys = () => {
    if (Object.keys(chartMeta).length === 0) {
      return null
    }
    return hiddenDataKeys
      ? Object.keys(chartMeta).filter((key) => !hiddenDataKeys.includes(key))
      : Object.keys(chartMeta)
  }
  // Known meta sets the keys in the first render, so server-rendered charts
  // show their series. Meta that arrives later sets them in the effect.
  const [dataKeys, setDataKeys] = useState<(keyof T)[] | null>(
    getDefaultDataKeys,
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: getDefaultDataKeys reads only the dependencies
  useEffect(() => {
    setDataKeys((prev) => prev ?? getDefaultDataKeys())
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
