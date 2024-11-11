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
      const assset: TokenEntry = {
        address: 'base:0x7882570840A97A490a37bd8Db9e1aE39165bfBd6',
        assetLogoUrl:
          'https://fe-staging.l2beat.com/_next/image?url=https%3A%2F%2Fassets.coingecko.com%2Fcoins%2Fimages%2F6319%2Fstandard%2Fusdc.png&w=64&q=75',
        chainLogoUrl:
          'https://l2beat.com/_next/image?url=%2Ficons%2Fbase.png&w=48&q=75',
        assetName: 'USDC.e',
        balanceUnits: 1234567.123456,
        balanceUsd: 1234567.12,
        chainName: 'Base',
        decimals: 6,
        issuer: 'Circle',
        priceUsd: 1,
        severity: {
          low: 1,
          high: 2,
          medium: 1,
        },
      }
      setData([assset, assset])
    }, 100)
    return () => {
      clearTimeout(timeout)
    }
  }, [query, setData])
  return data ? { type: 'success', data } : { type: 'loading' }
}
