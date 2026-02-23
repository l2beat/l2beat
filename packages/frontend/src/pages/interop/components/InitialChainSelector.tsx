import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { toInteropApiSelection } from '../utils/toInteropApiSelection'
import type { InteropSelection } from '../utils/types'
import type { InteropChainWithIcon } from './chain-selector/types'

interface Props {
  selectedChains: InteropSelection
  interopChains: InteropChainWithIcon[]
  selectChain: (type: 'from' | 'to', chainId: string | null) => void
  type: KnownInteropBridgeType | undefined
}

export function InitialChainSelector({
  interopChains,
  selectedChains,
  selectChain,
  type,
}: Props) {
  const utils = api.useUtils()
  const firstSelectedChainId =
    selectedChains.from.length === 1 ? selectedChains.from[0] : undefined
  const secondSelectedChainId =
    selectedChains.to.length === 1 ? selectedChains.to[0] : undefined

  const [activeChains, upcomingChains] = partition(
    interopChains,
    (chain) => !chain.isUpcoming,
  )

  function toggleChain(chainId: string) {
    if (!firstSelectedChainId) {
      selectChain('from', chainId)
      return
    }

    if (firstSelectedChainId === chainId) {
      selectChain('from', null)
      return
    }

    if (!secondSelectedChainId) {
      selectChain('to', chainId)
      return
    }
  }
  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-6 bg-surface-primary p-6 md:rounded-lg">
      <h2 className="text-balance text-center text-brand text-heading-32">
        Select a pair of chains
      </h2>
      <div className="flex w-full flex-wrap justify-center gap-1.5 md:max-w-[950px] md:gap-2">
        {[...activeChains, ...upcomingChains].map((chain) => (
          <ChainSelectorButton
            key={chain.id}
            chain={chain}
            selected={
              firstSelectedChainId === chain.id ||
              secondSelectedChainId === chain.id
            }
            onClick={() => toggleChain(chain.id)}
            onMouseEnter={() => {
              if (!firstSelectedChainId) {
                return
              }

              utils.interop.dashboard.prefetch({
                ...toInteropApiSelection(
                  {
                    from: [firstSelectedChainId],
                    to: [chain.id],
                  },
                  'public',
                ),
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
