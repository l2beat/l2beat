import { useState } from 'react'
import type { ChartMeta } from '../Chart'

export function useHiddenDataKeys(initialHiddenDataKeys: string[] = []) {
  const [hiddenDataKeys, setHiddenDataKeys] = useState<string[]>(
    initialHiddenDataKeys,
  )

  const toggleDataKey = (dataKey: string) => {
    setHiddenDataKeys((prev) => {
      if (prev.includes(dataKey)) {
        return prev.filter((key) => key !== dataKey)
      }
      return [...prev, dataKey]
    })
  }

  return { hiddenDataKeys, toggleDataKey }
}

export function useDataKeys(chartMeta: ChartMeta, hiddenDataKeys?: string[]) {
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
