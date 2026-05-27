import { ChainsMultiSelect } from '../../components/chain-selector/ChainsMultiSelect'
import type { InteropChainWithIcon } from '../../components/chain-selector/types'
import { useTokenFrameworksSelectedChains } from '../utils/TokenFrameworksSelectedChainsContext'

export function TokenFrameworksChainSelector({
  allChains,
}: {
  allChains: InteropChainWithIcon[]
}) {
  const { selectedChains, toggleChain, selectAll, deselectAll } =
    useTokenFrameworksSelectedChains()

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
