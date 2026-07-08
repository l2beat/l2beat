import { ChainsMultiSelect } from './ChainsMultiSelect'
import { useInteropSelectedChains } from './InteropSelectedChainsContext'
import type { InteropChainWithIcon } from './types'

export function InteropChainSelector({
  allChains,
}: {
  allChains: InteropChainWithIcon[]
}) {
  const { selectedChains, toggleChain, selectAll, deselectAll } =
    useInteropSelectedChains()

  return (
    <ChainsMultiSelect
      allChains={allChains}
      selectedChains={selectedChains}
      onToggle={toggleChain}
      onSelectAll={selectAll}
      onDeselectAll={deselectAll}
      min={1}
    />
  )
}
