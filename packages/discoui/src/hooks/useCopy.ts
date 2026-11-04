import { useCallback, useState } from 'react'

export function useCopy(timeoutMs = 1000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    (value: string) => {
      setCopied(true)
      if (value) {
        void navigator.clipboard.writeText(value)
        const timeout = setTimeout(() => setCopied(false), timeoutMs)
        return () => clearTimeout(timeout)
      }
    },
    [timeoutMs],
  )

  return {
    copied,
    copy,
  }
}
