import { ProjectId } from '@l2beat/shared-pure'
import { type ReactNode, useState } from 'react'
import { TransferDetailsDialog } from './table/transfer-count-cell/TransferCountCell'

export function InteropTransferDetailsTrigger({
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children}
      </button>
      <TransferDetailsDialog
        protocol={{ ...protocol, id: ProjectId(protocol.id) }}
        type={undefined}
        tokenId={tokenId}
        snapshotTimestamp={snapshotTimestamp}
        selectedChains={selection}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
