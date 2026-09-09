import { useState } from 'react'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type { InteropSelection } from '~/pages/interop/utils/types'
import type { InteropScope } from '~/server/features/layer2s/interop/types'
import { ChainMultiSelect } from './ChainMultiSelect'
import { InteropTransfersTableView } from './InteropTransfersTableView'

export interface InteropTransfersTableProps {
  scope: InteropScope
  apiSelection: InteropSelection
  snapshotTimestamp: number | undefined
  interopChains: InteropChainWithIcon[]
}

export function InteropTransfersTable({
  scope,
  apiSelection,
  snapshotTimestamp,
  interopChains,
}: InteropTransfersTableProps) {
  const [from, setFrom] = useState<string[]>(apiSelection.from)
  const [to, setTo] = useState<string[]>(apiSelection.to)

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <ChainMultiSelect
          label="From"
          chains={interopChains}
          selected={from}
          onChange={setFrom}
        />
        <ChainMultiSelect
          label="To"
          chains={interopChains}
          selected={to}
          onChange={setTo}
        />
      </div>
      <InteropTransfersTableView
        scope={scope}
        from={from}
        to={to}
        snapshotTimestamp={snapshotTimestamp}
      />
    </>
  )
}
