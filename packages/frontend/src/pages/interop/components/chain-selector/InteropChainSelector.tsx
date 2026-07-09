import { useChainSetSelection } from './ChainSetSelectionContext'
import { ChainsMultiSelect } from './ChainsMultiSelect'
import type { InteropChainWithIcon } from './types'

export function InteropChainSelector({
  allChains,
}: {
  allChains: InteropChainWithIcon[]
}) {
  const { selectedChains, toggleChain, selectAll, deselectAll } =
    useChainSetSelection()

  return (
    <ChainsMultiSelect
      allChains={allChains}
      selectedChains={selectedChains}
      onToggle={toggleChain}
      onSelectAll={selectAll}
      onDeselectAll={deselectAll}
    />
  )
}
