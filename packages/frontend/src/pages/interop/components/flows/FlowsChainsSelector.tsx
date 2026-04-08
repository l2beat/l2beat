import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { ChainSelectorChainToggle } from '../chain-selector/ChainSelectorChainToggle'
import type { InteropChainWithIcon } from '../chain-selector/types'
import { useInteropFlows } from './utils/InteropFlowsContext'

export function FlowsChainsSelector({
  allChains,
}: {
  allChains: InteropChainWithIcon[]
}) {
  const { selectedChains, toggleChainSelection } = useInteropFlows()
  const chainsWithDetails = allChains.map(({ id, name, iconUrl }) => ({
    id,
    name,
    iconUrl,
    isSelected: selectedChains.includes(id),
  }))

  const selectedChainsWithDetails = chainsWithDetails.filter(
    (chain) => chain.isSelected,
  )

  const trigger = (
    <div className="flex h-9.5 items-center justify-center gap-1.5 rounded-lg border border-divider bg-surface-primary! p-2">
      <span className="rounded-full bg-pink-900 px-2 py-[3px] font-semibold text-white text-xs leading-none">{`${selectedChains.length}/${allChains.length}`}</span>
      <span className="font-bold text-lg leading-none">Chains</span>
      <div className="flex items-center gap-1">
        <div className="-space-x-2 md:-space-x-1 flex items-center">
          {selectedChainsWithDetails.slice(0, 5).map((chain, i) => (
            <img
              key={chain.id}
              src={chain.iconUrl}
              alt={chain.name}
              className="size-5 rounded-full bg-white shadow"
              style={{ zIndex: selectedChains.length - i }}
            />
          ))}
        </div>
        {selectedChainsWithDetails.length > 5 && (
          <span className="font-semibold text-xs leading-none">
            +{selectedChainsWithDetails.length - 5} more
          </span>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex items-start gap-1 max-md:w-full max-md:flex-col md:items-center md:gap-3">
      {/* Mobile */}
      <Drawer>
        <DrawerTrigger className="w-full md:hidden">{trigger}</DrawerTrigger>
        <DrawerContent className="pb-4">
          <DrawerHeader className="mb-4 gap-2">
            <DrawerTitle className="mb-0 font-semibold text-lg text-primary leading-none">
              Chain selector
            </DrawerTitle>
            <DrawerDescription className="font-semibold text-secondary text-xs leading-none">
              Select chains
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-wrap gap-1">
            {chainsWithDetails.map((chain) => (
              <ChainSelectorChainToggle
                key={chain.id}
                chain={chain}
                isSelected={chain.isSelected}
                toggleSelected={toggleChainSelection}
              />
            ))}
          </div>
        </DrawerContent>
      </Drawer>
      {/* Desktop */}
      <Popover>
        <PopoverTrigger className="max-md:hidden" asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          className="!bg-surface-primary max-w-95 p-4"
          align="start"
          side="bottom"
        >
          <div className="mt-2.5 flex flex-wrap gap-1">
            {chainsWithDetails.map((chain) => (
              <ChainSelectorChainToggle
                key={chain.id}
                chain={chain}
                isSelected={chain.isSelected}
                toggleSelected={toggleChainSelection}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
