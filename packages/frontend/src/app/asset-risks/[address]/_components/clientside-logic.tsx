'use client'

import { useEffect, useState } from 'react'
import { api } from '~/trpc/react'
import { type Address } from 'viem'

export function ClientsideLogic({ address }: { address: Address }) {
  const refreshTokens = api.assetRisks.refreshTokens.useMutation()
  const refreshBalances = api.assetRisks.refreshBalances.useMutation()

  const report = api.assetRisks.report.useQuery({ address })
  const [refetched, setRefetched] = useState(false)

  useEffect(() => {
    if (refetched) return
    setRefetched(true)
    void (async () => {
      await refreshTokens.mutateAsync({ address })
      await report.refetch()
      await refreshBalances.mutateAsync({ address })
      await report.refetch()
    })()
  }, [address, refetched, refreshBalances, refreshTokens, report])

  return (
    <div className="flex flex-row gap-2 text-xs uppercase">
      DEBUG
      <button onClick={() => refreshTokens.mutate({ address })}>
        Refresh tokens ({refreshTokens.status})
      </button>
      <button onClick={() => refreshBalances.mutate({ address })}>
        Refresh balances ({refreshBalances.status})
      </button>
    </div>
  )
}
