import { type ReactNode, useState } from 'react'
import type { InteropScope } from '~/server/features/layer2s/interop/types'
import { TransferDetailsDialog } from './table/transfer-count-cell/TransferCountCell'

export function InteropTransferDetailsTrigger({
  scope,
  title,
  tokenId,
  selection,
  snapshotTimestamp,
  className,
  children,
}: {
  scope: InteropScope
  title: ReactNode
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
        scope={scope}
        title={title}
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
