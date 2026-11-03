import { useMemo, useState } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { GasFeesRecent as GasFeesRecentData } from '~/server/features/gas-fees/getGasFeesRecent'
import { GasFeesRecentFocus } from './recent/GasFeesRecentFocus'
import { GasFeesRecentHeatmap } from './recent/GasFeesRecentHeatmap'
import { getBiggestMove } from './recent/recentScale'
import type { GasFeesChain } from './types'

interface Props {
  chains: GasFeesChain[]
  data: GasFeesRecentData | undefined
  hoveredChainId: string | undefined
  setHoveredChainId: (id: string | undefined) => void
  pinnedChainId: string | undefined
  setPinnedChainId: (id: string | undefined) => void
}

/**
 * The heatmap and the focus chart in one card. The hovered hour stays here;
 * the chain is shared with the page, so the history chart and the table
 * follow it too.
 */
export function GasFeesRecent({
  chains,
  data,
  hoveredChainId,
  setHoveredChainId,
  pinnedChainId,
  setPinnedChainId,
}: Props) {
  const [hour, setHour] = useState<number>()
  // At rest the focus goes to whichever chain strayed furthest today
  const defaultChainId = useMemo(
    () =>
      data?.chains.reduce<(typeof data.chains)[number] | undefined>(
        (best, c) =>
          !best ||
          Math.abs(Math.log(getBiggestMove(c).ratio)) >
            Math.abs(Math.log(getBiggestMove(best).ratio))
            ? c
            : best,
        undefined,
      )?.id,
    [data],
  )
  const focusedChainId = hoveredChainId ?? pinnedChainId ?? defaultChainId
  const togglePin = (id: string) =>
    setPinnedChainId(pinnedChainId === id ? undefined : id)

  return (
    <PrimaryCard>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0">
          <GasFeesRecentHeatmap
            chains={chains}
            data={data}
            focusedChainId={focusedChainId}
            pinnedChainId={pinnedChainId}
            hour={hour}
            onHover={(chainId, h) => {
              setHoveredChainId(chainId)
              setHour(h)
            }}
            onTogglePin={togglePin}
          />
        </div>
        <div className="flex min-w-0 flex-col border-divider max-xl:border-t max-xl:pt-5 xl:border-l xl:pl-6">
          <GasFeesRecentFocus
            chain={chains.find((c) => c.id === focusedChainId)}
            data={data}
            pinned={focusedChainId === pinnedChainId}
            hour={hour}
            onHoverHour={setHour}
            onTogglePin={() => focusedChainId && togglePin(focusedChainId)}
          />
        </div>
      </div>
    </PrimaryCard>
  )
}
