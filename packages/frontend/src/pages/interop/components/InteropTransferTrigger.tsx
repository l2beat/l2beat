import { ProjectId } from '@l2beat/shared-pure'
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
      scope={{ type: 'project', projectId: ProjectId(protocol.id) }}
      title={
        <>
          <span>Transfers for </span>
          <a href={`/interop/protocols/${protocol.slug}`}>
            <img
              src={protocol.iconUrl}
              alt={protocol.name}
              className="relative bottom-0.5 mx-1 inline-block size-6"
            />
            <span>{protocol.name}</span>
          </a>
        </>
      }
      tokenId={tokenId}
      selection={selection}
      snapshotTimestamp={snapshotTimestamp}
      className={className}
    >
      {children}
    </InteropTransferDetailsTrigger>
  )
}
