import { pluralize } from '@l2beat/shared-pure'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { ChainSelectorChainToggle } from './ChainSelectorChainToggle'
import type { InteropChainWithIcon } from './types'

export function MultiChainSelectorButton({
  allChains,
  type,
}: {
  allChains: InteropChainWithIcon[]
  type: 'from' | 'to'
}) {
  const { selectedChains, toggleFrom, toggleTo, selectAll, deselectAll } =
    useInteropSelectedChains()

  const chainsWithDetails = allChains.map(({ id, name, iconUrl }) => ({
    id,
    name,
    iconUrl,
    isSelected: {
      from: selectedChains.from.includes(id),
      to: selectedChains.to.includes(id),
    },
  }))

  const selectedChainsCount = selectedChains[type].length
  const toggleSelected = type === 'from' ? toggleFrom : toggleTo
  const selectedChainsWithDetails = chainsWithDetails.filter(
    (chain) => chain.isSelected[type],
  )

  const trigger = (
    <div className="flex h-10 items-center gap-1.5 rounded-lg bg-surface-primary px-4 py-[7px] text-xs leading-none max-md:w-full md:text-sm">
      <div className="font-semibold leading-none">
        {selectedChainsCount} {pluralize(selectedChainsCount, 'chain')}
      </div>
      <div className="flex items-center gap-1 max-md:hidden">
        <div className="-space-x-3 md:-space-x-2 flex shrink-0 items-center">
          {selectedChainsWithDetails.slice(0, 5).map((chain, i) => (
            <img
              key={chain.id}
              src={chain.iconUrl}
              alt={chain.name}
              className="size-5 rounded-full bg-white shadow"
              style={{ zIndex: selectedChainsCount - i }}
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

  return (
    <div className="flex items-start gap-1 max-md:min-w-0 max-md:flex-1 max-md:flex-col md:items-center md:gap-3">
      <div className="font-semibold capitalize max-md:hidden">{type}</div>
      <div className="font-medium text-xs capitalize leading-none md:hidden">
        {type}
      </div>
      <Drawer>
        <DrawerTrigger className="max-md:w-full md:hidden">
          {trigger}
        </DrawerTrigger>
        <DrawerContent className="pb-4">
          <DrawerHeader className="mb-4 gap-2">
            <DrawerTitle className="mb-0 font-semibold text-lg text-primary capitalize leading-none">
              {type} chains
            </DrawerTitle>
            <DrawerDescription className="font-semibold text-secondary text-xs leading-none">
              Select the chains you want to include
            </DrawerDescription>
            {selectedChains[type].length === 0 && <EmptyStateError />}
          </DrawerHeader>
          <div className="flex flex-wrap gap-1">
            {chainsWithDetails.map((chain) => (
              <ChainSelectorChainToggle
                key={chain.id}
                chain={chain}
                isSelected={chain.isSelected[type]}
                toggleSelected={toggleSelected}
              />
            ))}
          </div>
          <HorizontalSeparator className="mt-6 mb-3.5" />
          <div className="flex items-center justify-between">
            <ModifierButton
              label="Select all"
              className="p-2.5"
              onClick={() => selectAll(type)}
              disabled={selectedChains[type].length === allChains.length}
            />
            <ModifierButton
              label="Deselect all"
              className="p-2.5"
              onClick={() => deselectAll(type)}
              disabled={selectedChains[type].length === 0}
            />
          </div>
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
          {selectedChains[type].length === 0 && <EmptyStateError />}
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
          <div className="mt-2.5 flex items-center justify-between">
            <ModifierButton
              label="Select all"
              onClick={() => selectAll(type)}
              disabled={selectedChains[type].length === allChains.length}
            />
            <ModifierButton
              label="Deselect all"
              onClick={() => deselectAll(type)}
              disabled={selectedChains[type].length === 0}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function ModifierButton({
  label,
  onClick,
  className,
  disabled,
}: {
  label: string
  onClick: () => void
  disabled: boolean
  className?: string
}) {
  return (
    <button
      className={cn(
        'cursor-pointer font-medium text-brand text-label-value-15 underline',
        className,
        disabled && 'text-secondary',
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

function EmptyStateError() {
  return (
    <div className="flex items-center gap-1">
      <InfoIcon className="fill-negative" />
      <div className="font-medium text-negative text-paragraph-14">
        Select at least one source and destination chain to display results.
      </div>
    </div>
  )
}
