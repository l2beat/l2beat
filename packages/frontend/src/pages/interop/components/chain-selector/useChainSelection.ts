import { useCallback, useMemo, useState } from 'react'
import type { InteropChainWithIcon } from './types'

export function useChainSelection(interopChains: InteropChainWithIcon[]) {
  const allChainIds = useMemo(
    () => interopChains.map((chain) => chain.id),
    [interopChains],
  )
  const [selectedChains, setSelectedChains] = useState(allChainIds)

  const toggleChain = useCallback(
    (chainId: string) => {
      setSelectedChains((previous) => {
        const next = new Set(previous)
        if (next.has(chainId)) {
          next.delete(chainId)
        } else {
          next.add(chainId)
        }
        return allChainIds.filter((id) => next.has(id))
      })
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
