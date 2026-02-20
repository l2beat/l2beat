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
      <h2 className="text-balance text-center text-brand text-heading-32">
        Select a pair of chains
      </h2>
      <div className="flex w-full flex-wrap justify-center gap-1.5 md:max-w-[950px] md:gap-2">
        {interopChains
          .sort((a, b) => (a.isUpcoming ? 1 : b.isUpcoming ? -1 : 0))
          .map((chain) => (
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
        'group relative flex h-10 items-center justify-center gap-2 rounded border border-divider px-3 py-2 transition-colors enabled:bg-header-secondary md:h-[104px] md:w-[128px] md:flex-col md:gap-1.5 md:py-4 lg:h-[128px] lg:w-[148px] lg:gap-3 lg:py-7.5',
        selected ? 'border-brand bg-brand/15!' : 'enabled:hover:bg-brand/5',
        className,
      )}
      disabled={chain.isUpcoming}
      {...props}
    >
      <img
        src={chain.iconUrl}
        alt={chain.name}
        className="size-6 group-disabled:opacity-40 md:size-8"
      />
      <span className="w-full text-center font-medium text-sm leading-none group-disabled:text-secondary md:text-base lg:text-lg">
        {chain.name}
      </span>
      {chain.isUpcoming && (
        <>
          <div className="-top-px -left-px absolute rounded-tl bg-zinc-400 px-[5px] pt-[5px] pb-1 font-medium text-[11px] text-primary-invert leading-none max-md:hidden">
            Coming soon
          </div>
          <div className="rounded-full bg-zinc-400 px-1.5 py-1 font-medium text-[11px] text-primary-invert leading-none md:hidden">
            Soon
          </div>
        </>
      )}
    </button>
  )
}
