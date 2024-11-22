import { useEffect, useState } from 'react'

export function useLastDefinedValue<T>(value: T | undefined) {
  const [lastDefinedValue, setLastDefinedValue] = useState(value)
  useEffect(() => {
    if (value !== undefined) {
      setLastDefinedValue(value)
    }
  }, [value])
  return lastDefinedValue
}
