import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTRPC } from '~/trpc/React'
import { InteropTransferDetailsTrigger } from '../../components/InteropTransferDetailsTrigger'
import { useIntentBridgesSelectedChains } from '../utils/IntentBridgesSelectedChainsContext'

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
  const { selectedChains } = useIntentBridgesSelectedChains()
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
