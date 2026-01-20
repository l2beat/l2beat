import type { InteropChain } from '@l2beat/config'
import { pluralize } from '@l2beat/shared-pure'
import { Button } from '~/components/core/Button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { ChainSelectorChainToggle } from './ChainSelectorChainToggle'

export function ChainSelectorButton({
  allChains,
  type,
}: {
  allChains: InteropChain[]
  type: 'from' | 'to'
}) {
  const { selectedChains, toggleFrom, toggleTo, isDirty, reset } =
    useInteropSelectedChains()

  const chainsWithDetails = allChains.map(({ id, iconSlug, name }) => ({
    id,
    iconSlug: iconSlug ?? id,
    name,
    isSelected: {
      from: selectedChains.from.includes(id),
      to: selectedChains.to.includes(id),
    },
  }))

  const selectedChainsCount = selectedChains[type].length

  const trigger = (
    <div className="flex h-10 items-center gap-1.5 rounded-lg bg-surface-primary px-4 py-[7px] text-xs leading-none md:text-sm">
      <div className="font-semibold leading-none">
        {selectedChainsCount} {pluralize(selectedChainsCount, 'chain')}
      </div>
      <div className="-space-x-3 md:-space-x-2 flex items-center">
        {chainsWithDetails
          .filter((chain) => chain.isSelected[type])
          .map((chain, i) => (
            <img
              key={chain.id}
              src={`/icons/${chain.iconSlug}.png`}
              alt={chain.name}
              className="size-5 rounded-full bg-white shadow"
              style={{ zIndex: selectedChainsCount - i }}
            />
          ))}
      </div>
    </div>
  )

  return (
    <div className="flex items-start gap-1 max-md:flex-col md:items-center md:gap-3">
      <div className="font-semibold capitalize max-md:hidden">{type}</div>
      <div className="font-medium text-xs leading-none md:hidden">
        <span className="capitalize">{type}</span> selected chains
      </div>
      {/* Mobile */}
      <Drawer>
        <DrawerTrigger className="md:hidden">{trigger}</DrawerTrigger>
        <DrawerContent className={isDirty ? 'pb-0' : 'pb-12'}>
          <DrawerHeader className="mb-4 gap-2">
            <DrawerTitle className="mb-0 font-semibold text-lg text-primary leading-none">
              Chains
            </DrawerTitle>
            <DrawerDescription className="font-semibold text-secondary text-xs leading-none">
              Select the chains you want to include
            </DrawerDescription>
          </DrawerHeader>
          <div className="mb-2 font-semibold text-xs leading-none">From</div>
          <div className="flex flex-wrap gap-2">
            {chainsWithDetails.map((chain) => (
              <ChainSelectorChainToggle
                key={chain.id}
                chain={chain}
                isSelected={chain.isSelected.from}
                toggleSelected={toggleFrom}
              />
            ))}
          </div>
          <div className="mt-4 mb-2 font-semibold text-xs leading-none">To</div>
          <div className="flex flex-wrap gap-2">
            {chainsWithDetails.map((chain) => (
              <ChainSelectorChainToggle
                key={chain.id}
                chain={chain}
                isSelected={chain.isSelected.to}
                toggleSelected={toggleTo}
              />
            ))}
          </div>
          {isDirty && (
            <DrawerFooter className="px-0 pt-6">
              <Button variant="outline" className="w-full" onClick={reset}>
                Reset all filters
              </Button>
            </DrawerFooter>
          )}
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
          <div className="flex flex-wrap gap-1">
            {chainsWithDetails.map((chain) => (
              <ChainSelectorChainToggle
                key={chain.id}
                chain={chain}
                isSelected={chain.isSelected[type]}
                toggleSelected={type === 'from' ? toggleFrom : toggleTo}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
