import { ProjectId } from '@l2beat/shared-pure'
import { type ReactNode, useMemo, useState } from 'react'
import { api } from '~/trpc/React'
import { TransferDetailsDialog } from '../../components/table/transfer-count-cell/TransferCountCell'
import { useTokenFrameworksSelectedChains } from '../utils/TokenFrameworksSelectedChainsContext'

export function TokenFrameworksTransferTrigger({
  protocol,
  tokenId,
  className,
  children,
}: {
  protocol: { id: string; name: string; iconUrl: string }
  tokenId?: string
  className?: string
  children: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedChains } = useTokenFrameworksSelectedChains()
  const selectionForApi = useMemo(
    () => ({ from: selectedChains, to: selectedChains }),
    [selectedChains],
  )
  const { data } = api.interop.tokenFrameworks.useQuery(selectionForApi)

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
        selectionForApi={selectionForApi}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
