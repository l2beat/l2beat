import type { ReactNode } from 'react'
import { useChainSetSelection } from './chain-selector/ChainSetSelectionContext'
import { InteropTransferDetailsTrigger } from './InteropTransferDetailsTrigger'
import { useInteropOverview } from './useInteropOverview'

export function InteropTransferTrigger({
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
  const { selectedChains } = useChainSetSelection()
  const { data } = useInteropOverview()

  return (
    <InteropTransferDetailsTrigger
      protocol={protocol}
      tokenId={tokenId}
      selection={
        selectionForApi ?? { from: selectedChains, to: selectedChains }
      }
      snapshotTimestamp={data?.snapshotTimestamp}
      className={className}
    >
      {children}
    </InteropTransferDetailsTrigger>
  )
}
