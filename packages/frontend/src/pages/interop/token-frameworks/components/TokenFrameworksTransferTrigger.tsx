import { ProjectId } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useMemo, useState } from 'react'
import { useTRPC } from '~/trpc/React'
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
  const trpc = useTRPC()
  const [isOpen, setIsOpen] = useState(false)
  const { selectedChains } = useTokenFrameworksSelectedChains()
  const dialogSelection = useMemo(
    () => selectionForApi ?? { from: selectedChains, to: selectedChains },
    [selectionForApi, selectedChains],
  )
  const { data } = useQuery(
    trpc.interop.tokenFrameworks.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
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
        snapshotTimestamp={data?.snapshotTimestamp}
        selectedChains={dialogSelection}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
