import type { InteropChain } from '@l2beat/config'
import { pluralize } from '@l2beat/shared-pure'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { cn } from '~/utils/cn'
import { useInteropSelectedChains } from '../utils/InteropSelectedChainsContext'

interface Props {
  chains: InteropChain[]
}

export function ChainSelector({ chains }: Props) {
  const { selectedChains, toggleFrom, toggleTo, reset, isDirty } =
    useInteropSelectedChains()

  return (
    <div className="flex items-center justify-between rounded-lg bg-[#ECB2FF] px-6 py-2">
      <div className="flex items-center gap-[17px]">
        <div className="font-semibold text-xs uppercase">Chain Selector</div>
        <div className="h-10 w-px bg-black/16" />
        <div className="flex items-center gap-3">
          <div className="font-semibold">From</div>
          <ChainSelectorButton
            selectedChains={selectedChains.from}
            allChains={chains}
            toggleSelected={toggleFrom}
          />
          <div className="font-semibold">to</div>
          <ChainSelectorButton
            selectedChains={selectedChains.to}
            allChains={chains}
            toggleSelected={toggleTo}
          />
        </div>
      </div>
      {isDirty && (
        <button
          className="font-semibold text-base leading-[115%] underline"
          onClick={reset}
        >
          Reset to default
        </button>
      )}
    </div>
  )
}

function ChainSelectorButton({
  selectedChains,
  allChains,
  toggleSelected,
}: {
  selectedChains: string[]
  allChains: InteropChain[]
  toggleSelected: (chainId: string) => void
}) {
  const chainsWithDetails = allChains.map(({ id, iconSlug, name }) => ({
    id,
    iconSlug: iconSlug ?? id,
    name,
    isSelected: selectedChains.includes(id),
  }))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="h-10 bg-surface-primary px-4 py-[7px]">
          <div className="font-semibold leading-none">
            {selectedChains.length} selected{' '}
            {pluralize(selectedChains.length, 'chain')}
          </div>
          <div className="-space-x-2 flex items-center">
            {chainsWithDetails
              .filter((chain) => chain.isSelected)
              .map((chain, i) => (
                <img
                  key={chain.id}
                  src={`/icons/${chain.iconSlug}.png`}
                  alt={chain.name}
                  className="size-5"
                  style={{ zIndex: selectedChains.length - i }}
                />
              ))}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="!bg-surface-primary max-w-95 p-4"
        align="start"
        side="bottom"
      >
        <div className="flex flex-wrap gap-1">
          {chainsWithDetails.map((chain) => (
            <ChainSelectorItem
              key={chain.id}
              chain={chain}
              toggleSelected={toggleSelected}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ChainSelectorItem({
  chain,
  toggleSelected,
}: {
  chain: {
    id: string
    iconSlug: string
    name: string
    isSelected: boolean
  }
  toggleSelected: (chainId: string) => void
}) {
  return (
    <button
      className={cn(
        'flex h-8 cursor-pointer select-none items-center gap-2 rounded-sm border border-divider bg-surface-secondary py-1.5 pr-3 pl-2 transition-all',
        chain.isSelected && 'border-brand bg-brand/15',
      )}
      onClick={() => toggleSelected(chain.id)}
    >
      <img
        src={`/icons/${chain.iconSlug}.png`}
        alt={chain.name}
        className="size-5"
      />
      <div className="font-medium text-label-value-16 leading-none">
        {chain.name}
      </div>
    </button>
  )
}
