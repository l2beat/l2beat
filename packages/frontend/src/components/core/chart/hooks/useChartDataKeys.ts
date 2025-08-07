import { useEffect, useRef, useState } from 'react'
import type { ChartMeta } from '../Chart'

export function useChartDataKeys<T extends ChartMeta>(
  chartMeta: T,
  hiddenDataKeys?: (keyof T)[],
) {
  const showAllDataKeys = useRef(false)
  const [dataKeys, setDataKeys] = useState<(keyof T)[] | null>(null)

  useEffect(() => {
    if (showAllDataKeys.current) {
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
    if (showAllDataKeys.current) {
      showAllDataKeys.current = false
    }

    setDataKeys((prev) => {
      if (prev?.includes(dataKey)) {
        return prev.filter((key) => key !== dataKey)
      }
      const result = [...(prev ?? []), dataKey]
      if (result.length === Object.keys(chartMeta).length) {
        showAllDataKeys.current = true
      }
      return result
    })
  }

  const toggleAllDataKeys = () => {
    showAllDataKeys.current = !showAllDataKeys.current
    if (showAllDataKeys.current) {
      setDataKeys(Object.keys(chartMeta))
    } else {
      setDataKeys([])
    }
  }

  return { dataKeys: dataKeys ?? [], toggleDataKey, toggleAllDataKeys }
}
