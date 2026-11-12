import { useEffect, useRef, useState } from 'react'
import type { ChartMeta } from '../ChartContext'

/**
 * Which of the meta's series are shown. Every series starts shown but the
 * hidden ones, including series the meta gains later (e.g. blobs, once the
 * data says the project posts them). A reader's own toggles are kept.
 */
export function useChartDataKeys<T extends ChartMeta>(
  chartMeta: T,
  hiddenDataKeys?: (keyof T)[] | readonly (keyof T)[],
) {
  const [dataKeys, setDataKeys] = useState<(keyof T)[] | null>(null)
  const seenKeys = useRef(new Set<keyof T>())

  useEffect(() => {
    const newKeys = Object.keys(chartMeta).filter(
      (key) => !seenKeys.current.has(key),
    )
    if (newKeys.length === 0) return
    for (const key of newKeys) seenKeys.current.add(key)
    const shown = newKeys.filter((key) => !hiddenDataKeys?.includes(key))
    setDataKeys((prev) => [...(prev ?? []), ...shown])
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
