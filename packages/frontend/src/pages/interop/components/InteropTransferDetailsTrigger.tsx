import { ProjectId } from '@l2beat/shared-pure'
import { type ReactNode, useMemo, useState } from 'react'
import { TransferDetailsDialog } from './table/transfer-count-cell/TransferCountCell'

export function InteropTransferDetailsTrigger({
  protocol,
  tokenId,
  selectedChains,
  selectionForApi,
  snapshotTimestamp,
  className,
  children,
}: {
  protocol: { id: string; name: string; slug: string; iconUrl: string }
  tokenId?: string
  selectedChains: string[]
  selectionForApi?: { from: string[]; to: string[] }
  snapshotTimestamp: number | undefined
  className?: string
  children: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogSelection = useMemo(
    () => selectionForApi ?? { from: selectedChains, to: selectedChains },
    [selectionForApi, selectedChains],
  )

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
        selectedChains={dialogSelection}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
