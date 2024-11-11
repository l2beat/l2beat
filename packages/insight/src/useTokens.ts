import { useEffect, useState } from 'react'
import { TokenEntry } from './schema'

type UseTokensResult =
  | { type: 'loading' }
  | { type: 'success'; data: TokenEntry[] }

export function useTokens(query: string): UseTokensResult {
  const [data, setData] = useState<TokenEntry[] | undefined>(undefined)
  useEffect(() => {
    setData(undefined)
    const timeout = setTimeout(() => {
      setData([])
    }, 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [query, setData])
  return data ? { type: 'success', data } : { type: 'loading' }
}
