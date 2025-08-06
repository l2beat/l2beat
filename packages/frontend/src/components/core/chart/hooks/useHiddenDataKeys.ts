import { useState } from 'react'

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
