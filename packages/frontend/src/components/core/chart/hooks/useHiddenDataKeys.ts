import { useState } from 'react'

export function useHiddenDataKeys() {
  const [hiddenDataKeys, setHiddenDataKeys] = useState<string[]>([])

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
