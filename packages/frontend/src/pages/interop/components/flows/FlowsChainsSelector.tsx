import { ChainsMultiSelect } from '../chain-selector/ChainsMultiSelect'
import type { InteropChainWithIcon } from '../chain-selector/types'
import { MAX_SELECTED_CHAINS, MIN_SELECTED_CHAINS } from './consts'
import { useInteropFlows } from './utils/InteropFlowsContext'

export function FlowsChainsSelector({
  allChains,
}: {
  allChains: InteropChainWithIcon[]
}) {
  const { selectedChains, toggleChainSelection, deselectAllChains } =
    useInteropFlows()

  return (
    <ChainsMultiSelect
      allChains={allChains}
      selectedChains={selectedChains}
      onToggle={toggleChainSelection}
      onDeselectAll={deselectAllChains}
      max={MAX_SELECTED_CHAINS}
      min={MIN_SELECTED_CHAINS}
    />
  )
}
