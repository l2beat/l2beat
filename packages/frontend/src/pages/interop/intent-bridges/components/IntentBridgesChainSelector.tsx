import { ChainsMultiSelect } from '../../components/chain-selector/ChainsMultiSelect'
import type { InteropChainWithIcon } from '../../components/chain-selector/types'
import { useIntentBridgesSelectedChains } from '../utils/IntentBridgesSelectedChainsContext'

export function IntentBridgesChainSelector({
  allChains,
}: {
  allChains: InteropChainWithIcon[]
}) {
  const { selectedChains, toggleChain, selectAll, deselectAll } =
    useIntentBridgesSelectedChains()

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
