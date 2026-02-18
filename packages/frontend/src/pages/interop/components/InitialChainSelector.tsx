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
    <div className="flex w-full grow flex-col items-center justify-center gap-6 bg-surface-primary p-6 md:rounded-lg">
      <h2 className="text-brand text-heading-32">Select a pair of chains</h2>
      <div className="flex w-full flex-wrap justify-center gap-1.5 md:max-w-[616px] md:gap-2">
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
        'flex h-18 w-[32%] flex-col items-center justify-center gap-2 rounded border border-divider px-2 py-3 transition-colors md:size-[148px] md:gap-3 md:px-3',
        selected ? 'border-brand bg-brand/15' : 'hover:bg-brand/5',
        className,
      )}
      {...props}
    >
      <img src={chain.iconUrl} alt={chain.name} className="size-6 md:size-8" />
      <span className="w-full text-center font-medium text-sm leading-none md:text-lg">
        {chain.name}
      </span>
    </button>
  )
}
