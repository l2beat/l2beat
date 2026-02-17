import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import type { InteropSelectedChains } from '../utils/InteropSelectedChainsContext'
import type { InteropChainWithIcon } from './chain-selector/types'

interface Props {
  selectedChains: InteropSelectedChains
  interopChains: InteropChainWithIcon[]
  selectChain: (
    index: keyof InteropSelectedChains,
    chainId: string | null,
  ) => void
  type: KnownInteropBridgeType | undefined
}

export function InitialChainSelector({
  interopChains,
  selectedChains,
  selectChain,
  type,
}: Props) {
  const utils = api.useUtils()
  function toggleChain(chainId: string) {
    if (selectedChains.first === null) {
      selectChain('first', chainId)
      return
    }

    if (selectedChains.first?.id === chainId) {
      selectChain('first', null)
      return
    }

    if (selectedChains.second === null) {
      selectChain('second', chainId)
      return
    }
  }
  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-6 bg-white p-6 md:rounded-lg">
      <h2 className="text-brand text-heading-32">Select a pair of chains</h2>
      <div className="grid grid-cols-3 gap-1.5 md:grid-cols-4 md:gap-2">
        {interopChains.map((chain) => (
          <ChainSelectorButton
            key={chain.id}
            chain={chain}
            selected={
              selectedChains.first?.id === chain.id ||
              selectedChains.second?.id === chain.id
            }
            onClick={() => toggleChain(chain.id)}
            onMouseEnter={() => {
              if (!selectedChains.first) {
                return
              }

              utils.interop.dashboard.prefetch({
                selectedChainsIds: [selectedChains.first.id, chain.id],
                type,
              })
            }}
          />
        ))}
      </div>
    </div>
  )
}

function ChainSelectorButton({
  chain,
  selected,
  className,
  ...props
}: {
  chain: InteropChainWithIcon
  selected: boolean
} & React.ComponentProps<'button'>) {
  return (
    <button
      className={cn(
        'flex h-18 flex-col items-center justify-center gap-2 rounded border border-divider py-3 transition-colors hover:border-brand md:size-[148px] md:gap-3 md:px-2',
        selected && 'border-brand bg-brand/15',
        className,
      )}
      {...props}
    >
      <img
        src={chain.iconUrl}
        alt={chain.name}
        className="size-6 rounded-full bg-white shadow md:size-8"
      />
      <span className="font-medium text-base leading-none md:text-lg">
        {chain.name}
      </span>
    </button>
  )
}
