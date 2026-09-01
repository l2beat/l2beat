import { pluralize } from '@l2beat/shared-pure'
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
  popoverTriggerClasses,
} from '~/components/core/Popover'
import { ChevronIcon } from '~/icons/Chevron'
import { ChainSelectorChainToggle } from '~/pages/interop/components/chain-selector/ChainSelectorChainToggle'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { cn } from '~/utils/cn'

interface Props {
  label: string
  chains: InteropChainWithIcon[]
  selected: string[]
  onChange: (next: string[]) => void
}

export function ChainMultiSelect({ label, chains, selected, onChange }: Props) {
  const toggle = (chainId: string) => {
    onChange(
      selected.includes(chainId)
        ? selected.filter((id) => id !== chainId)
        : [...selected, chainId],
    )
  }

  const allSelected = selected.length === chains.length
  const noneSelected = selected.length === 0

  const selectedChains = chains.filter((chain) => selected.includes(chain.id))
  const selectAll = () => onChange(chains.map((chain) => chain.id))
  const deselectAll = () => onChange([])

  const triggerContent = (
    <>
      <div className="-space-x-2 flex items-center">
        {selectedChains.slice(0, 4).map((chain, i) => (
          <img
            key={chain.id}
            src={chain.iconUrl}
            alt={chain.name}
            className="size-4 rounded-full bg-white shadow"
            style={{ zIndex: selectedChains.length - i }}
          />
        ))}
      </div>
      <span className="font-medium text-label-value-14">
        {allSelected
          ? `All ${pluralize(chains.length, 'chain')}`
          : `${selected.length} ${pluralize(selected.length, 'chain')}`}
      </span>
      <ChevronIcon className="size-2.5 fill-current stroke-[1.8px] transition-transform group-data-[state=open]:rotate-180" />
    </>
  )

  const actions = (
    <>
      <button
        type="button"
        className={cn(
          'cursor-pointer font-medium text-brand text-label-value-14 underline',
          allSelected && 'text-secondary',
        )}
        onClick={selectAll}
        disabled={allSelected}
      >
        Select all
      </button>
      <button
        type="button"
        className={cn(
          'cursor-pointer font-medium text-brand text-label-value-14 underline',
          noneSelected && 'text-secondary',
        )}
        onClick={deselectAll}
        disabled={noneSelected}
      >
        Deselect all
      </button>
    </>
  )

  const chainsList = (
    <div className="flex flex-wrap gap-1">
      {chains.map((chain) => (
        <ChainSelectorChainToggle
          key={chain.id}
          chain={{
            id: chain.id,
            name: chain.name,
            iconUrl: chain.iconUrl,
          }}
          isSelected={selected.includes(chain.id)}
          toggleSelected={toggle}
        />
      ))}
    </div>
  )

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-paragraph-14 text-secondary">
        {label}
      </span>
      <Drawer>
        <DrawerTrigger
          className={cn(popoverTriggerClasses, 'h-9 gap-2 md:hidden')}
        >
          {triggerContent}
        </DrawerTrigger>
        <DrawerContent className="pb-4">
          <DrawerHeader className="mb-4 gap-2">
            <DrawerTitle className="mb-0 font-semibold text-lg text-primary leading-none">
              {label} chains
            </DrawerTitle>
            <DrawerDescription className="font-semibold text-secondary text-xs leading-none">
              Select chains
            </DrawerDescription>
          </DrawerHeader>
          {chainsList}
          <div className="mt-4 flex items-center justify-between">
            {actions}
          </div>
        </DrawerContent>
      </Drawer>
      <Popover>
        <PopoverTrigger className="h-9 gap-2 max-md:hidden">
          {triggerContent}
        </PopoverTrigger>
        <PopoverContent
          className="!bg-surface-primary max-w-95 p-3"
          align="start"
          side="bottom"
        >
          <div className="mb-2.5 flex items-center justify-between">
            {actions}
          </div>
          {chainsList}
        </PopoverContent>
      </Popover>
    </div>
  )
}
