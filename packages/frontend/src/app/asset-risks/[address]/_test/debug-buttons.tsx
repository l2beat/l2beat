'use client'

import { Address } from 'viem'
import { api } from '~/trpc/react'

export function DebugButtons({ address }: { address: Address }) {
  const refreshTokens = api.assetRisks.refreshTokens.useMutation()
  const refreshBalances = api.assetRisks.refreshBalances.useMutation()
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
