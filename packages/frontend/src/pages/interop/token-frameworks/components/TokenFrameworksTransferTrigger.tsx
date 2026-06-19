import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { InteropTransferDetailsTrigger } from '~/pages/interop/components/InteropTransferDetailsTrigger'
import { useTRPC } from '~/trpc/React'
import { useTokenFrameworksSelectedChains } from '../utils/TokenFrameworksSelectedChainsContext'

export function TokenFrameworksTransferTrigger({
  protocol,
  tokenId,
  selectionForApi,
  className,
  children,
}: {
  protocol: { id: string; name: string; slug: string; iconUrl: string }
  tokenId?: string
  selectionForApi?: { from: string[]; to: string[] }
  className?: string
  children: ReactNode
}) {
  const trpc = useTRPC()
  const { selectedChains } = useTokenFrameworksSelectedChains()
  const { data } = useQuery(
    trpc.interop.tokenFrameworks.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <InteropTransferDetailsTrigger
      protocol={protocol}
      tokenId={tokenId}
      selectedChains={selectedChains}
      selectionForApi={selectionForApi}
      snapshotTimestamp={data?.snapshotTimestamp}
      className={className}
    >
      {children}
    </InteropTransferDetailsTrigger>
  )
}
