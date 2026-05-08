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
import { ChainSelectorChainToggle } from '../../components/chain-selector/ChainSelectorChainToggle'
import type { InteropChainWithIcon } from '../../components/chain-selector/types'
import { useTokenFrameworksSelectedChains } from '../utils/TokenFrameworksSelectedChainsContext'

export function TokenFrameworksChainSelector({
  allChains,
}: {
  allChains: InteropChainWithIcon[]
}) {
  const { selectedChains, toggleChain, selectAll, deselectAll } =
    useTokenFrameworksSelectedChains()

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
      <div className="flex items-center gap-1 max-md:hidden lg:max-xl:hidden">
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
            +{selectedChainsWithDetails.length - 5}
          </span>
        )}
      </div>
    </div>
  )

  const chainsList = (
    <div className="flex flex-wrap gap-1">
      {chainsWithDetails.map((chain) => (
        <ChainSelectorChainToggle
          key={chain.id}
          chain={chain}
          isSelected={chain.isSelected}
          toggleSelected={toggleChain}
        />
      ))}
    </div>
  )

  const footer = (
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={selectAll}
        disabled={selectedChains.length === allChains.length}
        className="w-fit cursor-pointer font-medium text-brand text-label-value-15 underline disabled:cursor-not-allowed disabled:text-secondary"
      >
        Select all
      </button>
      <button
        type="button"
        onClick={deselectAll}
        disabled={selectedChains.length === 0}
        className="w-fit cursor-pointer font-medium text-brand text-label-value-15 underline disabled:cursor-not-allowed disabled:text-secondary"
      >
        Deselect all
      </button>
    </div>
  )

  return (
    <div className="flex items-start gap-1 max-md:w-full max-md:flex-col md:items-center md:gap-3">
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
          {chainsList}
          <div className="mt-4">{footer}</div>
        </DrawerContent>
      </Drawer>
      <Popover>
        <PopoverTrigger className="max-md:hidden" asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          className="!bg-surface-primary max-w-95 p-4"
          align="start"
          side="bottom"
        >
          {chainsList}
          <div className="mt-3">{footer}</div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
