import type { ReactNode } from 'react'
import { InteropTransferDetailsTrigger } from './InteropTransferDetailsTrigger'

export interface InteropTransferDefaults {
  selection: { from: string[]; to: string[] }
  snapshotTimestamp: number | undefined
}

export function InteropTransferTrigger({
  protocol,
  tokenId,
  selection,
  snapshotTimestamp,
  className,
  children,
}: {
  protocol: { id: string; name: string; slug: string; iconUrl: string }
  tokenId?: string
  selection: { from: string[]; to: string[] }
  snapshotTimestamp: number | undefined
  className?: string
  children: ReactNode
}) {
  return (
    <InteropTransferDetailsTrigger
      protocol={protocol}
      tokenId={tokenId}
      selection={selection}
      snapshotTimestamp={snapshotTimestamp}
      className={className}
    >
      {children}
    </InteropTransferDetailsTrigger>
  )
}
