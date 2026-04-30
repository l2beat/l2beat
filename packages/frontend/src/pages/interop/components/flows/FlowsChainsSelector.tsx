import type { ReactNode } from 'react'
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
import { cn } from '~/utils/cn'
import { ChainSelectorChainToggle } from '../chain-selector/ChainSelectorChainToggle'
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
  const chainsWithDetails = allChains.map(({ id, name, iconUrl }) => ({
    id,
    name,
    iconUrl,
    isSelected: selectedChains.includes(id),
  }))

  const selectedChainsWithDetails = chainsWithDetails.filter(
    (chain) => chain.isSelected,
  )

  const isAtMax = selectedChains.length >= MAX_SELECTED_CHAINS
  const isBelowMin = selectedChains.length < MIN_SELECTED_CHAINS

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
          toggleSelected={toggleChainSelection}
          disabled={isAtMax && !chain.isSelected}
          disabledTooltip="Deselect a chain to select another"
        />
      ))}
    </div>
  )

  const selectionMessage = isAtMax ? (
    <SelectionMessage>
      Max. {MAX_SELECTED_CHAINS} chains. Deselect one to select another one.
    </SelectionMessage>
  ) : isBelowMin ? (
    <SelectionMessage>
      Select at least {MIN_SELECTED_CHAINS} chains to view the graph.
    </SelectionMessage>
  ) : null

  const footer = (
    <button
      type="button"
      onClick={deselectAllChains}
      disabled={selectedChains.length === 0}
      className="w-fit cursor-pointer font-medium text-brand text-label-value-15 underline disabled:cursor-not-allowed disabled:text-secondary"
    >
      Deselect all
    </button>
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
            {selectionMessage}
          </DrawerHeader>
          {chainsList}
          <div className="mt-4">{footer}</div>
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
          {selectionMessage}
          <div className={cn(selectionMessage && 'mt-2.5')}>{chainsList}</div>
          <div className="mt-1">{footer}</div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function SelectionMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-1">
      <InfoIcon className="shrink-0 fill-negative" />
      <div className="font-medium text-negative text-paragraph-14">
        {children}
      </div>
    </div>
  )
}
