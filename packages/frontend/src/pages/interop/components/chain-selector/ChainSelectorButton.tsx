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
import { InfoIcon } from '~/icons/Info'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { ChainSelectorChainToggle } from './ChainSelectorChainToggle'
import type { InteropChainWithIcon } from './types'

export function ChainSelectorButton({
  allChains,
  type,
}: {
  allChains: InteropChainWithIcon[]
  type: 'first' | 'second'
}) {
  const { selectedChains, toggleFirst, toggleSecond } =
    useInteropSelectedChains()

  const chainsWithDetails = allChains.map(({ id, name, iconUrl }) => ({
    id,
    name,
    iconUrl,
    isSelected: {
      first: selectedChains.first === id,
      second: selectedChains.second === id,
    },
  }))

  const selectedChain = chainsWithDetails.find(
    (chain) => chain.isSelected[type],
  )

  const trigger = (
    <div className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-divider bg-surface-primary px-4 py-[7px] text-xs leading-none md:text-sm">
      <img
        key={selectedChain?.id}
        src={selectedChain?.iconUrl}
        alt={selectedChain?.name}
        className="size-5"
      />
      <div className="font-semibold leading-none">{selectedChain?.name}</div>
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
              Chains
            </DrawerTitle>
            <DrawerDescription className="font-semibold text-secondary text-xs leading-none">
              Select the chains you want to include
            </DrawerDescription>
            {(selectedChains.first === undefined ||
              selectedChains.second === undefined) && <EmptyStateError />}
          </DrawerHeader>
          <div className="mb-2 font-semibold text-xs leading-none">From</div>
          <div className="flex flex-wrap gap-1">
            {chainsWithDetails.map((chain) => (
              <ChainSelectorChainToggle
                key={chain.id}
                chain={chain}
                isSelected={chain.isSelected.first}
                toggleSelected={toggleFirst}
              />
            ))}
          </div>
          <div className="mt-3 mb-2 font-semibold text-xs leading-none">To</div>
          <div className="flex flex-wrap gap-1">
            {chainsWithDetails.map((chain) => (
              <ChainSelectorChainToggle
                key={chain.id}
                chain={chain}
                isSelected={chain.isSelected.second}
                toggleSelected={toggleSecond}
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
          {selectedChains[type] === undefined && <EmptyStateError />}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {chainsWithDetails.map((chain) => (
              <ChainSelectorChainToggle
                key={chain.id}
                chain={chain}
                isSelected={chain.isSelected[type]}
                toggleSelected={type === 'first' ? toggleFirst : toggleSecond}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function EmptyStateError() {
  return (
    <div className="flex items-center gap-1">
      <InfoIcon className="fill-negative" />
      <div className="font-medium text-negative text-paragraph-14">
        Select at least one pair of chains to display results.
      </div>
    </div>
  )
}
