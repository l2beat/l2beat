import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTRPC } from '~/trpc/React'
import { useInteropSelectedChains } from '../../components/chain-selector/InteropSelectedChainsContext'
import { InteropTransferDetailsTrigger } from '../../components/InteropTransferDetailsTrigger'

export function IntentBridgesTransferTrigger({
  protocol,
  tokenId,
  className,
  children,
}: {
  protocol: { id: string; name: string; slug: string; iconUrl: string }
  tokenId?: string
  className?: string
  children: ReactNode
}) {
  const trpc = useTRPC()
  const { selectedChains } = useInteropSelectedChains()
  const { data } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <InteropTransferDetailsTrigger
      protocol={protocol}
      tokenId={tokenId}
      selection={{ from: selectedChains, to: selectedChains }}
      snapshotTimestamp={data?.snapshotTimestamp}
      className={className}
    >
      {children}
    </InteropTransferDetailsTrigger>
  )
}
