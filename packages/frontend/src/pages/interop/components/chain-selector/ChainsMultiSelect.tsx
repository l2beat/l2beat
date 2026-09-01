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
import { ChainSelectorChainToggle } from './ChainSelectorChainToggle'
import type { InteropChainWithIcon } from './types'

interface Props {
  allChains: InteropChainWithIcon[]
  selectedChains: string[]
  onToggle: (chainId: string) => void
  onDeselectAll: () => void
  onSelectAll?: () => void
  max?: number
  min?: number
  pinnedChainId?: string
}

export function ChainsMultiSelect({
  allChains,
  selectedChains,
  onToggle,
  onDeselectAll,
  onSelectAll,
  max,
  min,
  pinnedChainId,
}: Props) {
  const chainsWithDetails = allChains.map(({ id, name, iconUrl }) => ({
    id,
    name,
    iconUrl,
    isSelected: selectedChains.includes(id),
  }))

  const selectedChainsWithDetails = chainsWithDetails.filter(
    (chain) => chain.isSelected,
  )

  const isAtMax = max !== undefined && selectedChains.length >= max
  const isBelowMin = min !== undefined && selectedChains.length < min

  const selectionMessage = isAtMax ? (
    <SelectionMessage>
      Max. {max} chains. Deselect one to select another one.
    </SelectionMessage>
  ) : isBelowMin ? (
    <SelectionMessage>Select at least {min} chains.</SelectionMessage>
  ) : null

  const trigger = (
    <div className="flex h-9.5 items-center justify-center gap-1.5 rounded-lg border border-divider bg-surface-primary! p-2">
      <span className="rounded-full bg-pink-900 px-2 py-[3px] font-semibold text-white text-xs leading-none">{`${selectedChains.length}/${allChains.length}`}</span>
      <span className="font-bold text-lg leading-none">Chains</span>
      <div className="flex items-center gap-1 max-md:hidden">
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
          toggleSelected={onToggle}
          disabled={
            chain.id === pinnedChainId || (isAtMax && !chain.isSelected)
          }
          disabledTooltip={
            chain.id === pinnedChainId
              ? 'This chain cannot be deselected'
              : 'Deselect a chain to select another'
          }
        />
      ))}
    </div>
  )

  const footer = (
    <div
      className={cn(
        'flex items-center gap-4',
        onSelectAll && 'justify-between',
      )}
    >
      {onSelectAll && (
        <ModifierButton
          label="Select all"
          onClick={onSelectAll}
          disabled={selectedChains.length === allChains.length}
        />
      )}
      <ModifierButton
        label="Deselect all"
        onClick={onDeselectAll}
        disabled={
          selectedChains.filter((id) => id !== pinnedChainId).length === 0
        }
      />
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
            {selectionMessage}
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
          {selectionMessage}
          <div className={cn(selectionMessage && 'mt-2.5')}>{chainsList}</div>
          <div className={cn(onSelectAll ? 'mt-3' : 'mt-1')}>{footer}</div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function ModifierButton({
  label,
  onClick,
  disabled,
}: {
  label: string
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-fit cursor-pointer font-medium text-brand text-label-value-15 underline disabled:cursor-not-allowed disabled:text-secondary"
    >
      {label}
    </button>
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
