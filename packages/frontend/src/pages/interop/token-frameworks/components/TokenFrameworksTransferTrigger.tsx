import { ProjectId } from '@l2beat/shared-pure'
import { type ReactNode, useMemo, useState } from 'react'
import { api } from '~/trpc/React'
import { TransferDetailsDialog } from '../../components/table/transfer-count-cell/TransferCountCell'
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
  const [isOpen, setIsOpen] = useState(false)
  const { selectedChains } = useTokenFrameworksSelectedChains()
  const dialogSelection = useMemo(
    () => selectionForApi ?? { from: selectedChains, to: selectedChains },
    [selectionForApi, selectedChains],
  )
  const { data } = api.interop.tokenFrameworks.useQuery({
    from: selectedChains,
    to: selectedChains,
  })

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
        snapshotTimestamp={data?.snapshotTimestamp}
        selectionForApi={dialogSelection}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
