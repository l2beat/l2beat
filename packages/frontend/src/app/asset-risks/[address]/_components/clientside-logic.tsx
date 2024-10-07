'use client'

import { useEffect } from 'react'
import { api } from '~/trpc/react'
import { type Address } from 'viem'

export function ClientsideLogic({ address }: { address: Address }) {
  const refreshTokens = api.assetRisks.refreshTokens.useMutation()
  const refreshBalances = api.assetRisks.refreshBalances.useMutation()

  const report = api.assetRisks.report.useQuery({ address })

  useEffect(() => {
    if (!report.data) return
    if (
      !report.data.tokensRefreshedAt ||
      report.data.tokensRefreshedAt < new Date(Date.now() - 1000 * 60 * 60)
    ) {
      refreshTokens.mutate({ address })
      return
    }
    if (
      !report.data.balancesRefreshedAt ||
      report.data.balancesRefreshedAt < new Date(Date.now() - 1000 * 60)
    ) {
      refreshBalances.mutate({ address })
      return
    }
  }, [address, refreshBalances, refreshTokens, report.data])

  return (
    <div>
      <button onClick={() => refreshTokens.mutate({ address })}>
        Refresh tokens ({refreshTokens.status})
      </button>
      <button onClick={() => refreshBalances.mutate({ address })}>
        Refresh balances ({refreshBalances.status})
      </button>
    </div>
  )
}
