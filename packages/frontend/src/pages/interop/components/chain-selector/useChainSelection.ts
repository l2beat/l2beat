import { useCallback, useMemo, useState } from 'react'
import { toggleSelection } from '../../utils/toggleSelection'
import type { InteropChainWithIcon } from './types'

export function useChainSelection(interopChains: InteropChainWithIcon[]) {
  const allChainIds = useMemo(
    () => interopChains.map((chain) => chain.id),
    [interopChains],
  )
  const [selectedChains, setSelectedChains] = useState(allChainIds)

  const toggleChain = useCallback(
    (chainId: string) => {
      setSelectedChains((previous) =>
        toggleSelection(previous, chainId, allChainIds),
      )
    },
    [allChainIds],
  )

  const selectAll = useCallback(() => {
    setSelectedChains(allChainIds)
  }, [allChainIds])

  const deselectAll = useCallback(() => {
    setSelectedChains([])
  }, [])

  return { selectedChains, toggleChain, selectAll, deselectAll }
}
