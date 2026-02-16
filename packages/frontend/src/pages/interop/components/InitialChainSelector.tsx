import type { SelectedChains } from '~/server/features/scaling/interop/types'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import type { InteropChainWithIcon } from './chain-selector/types'

export function InitialChainSelector({
  interopChains,
  selectedChains,
  selectChain,
}: {
  selectedChains: SelectedChains
  interopChains: InteropChainWithIcon[]
  selectChain: (index: 0 | 1, chainId: string | null) => void
}) {
  const utils = api.useUtils()
  function toggleChain(chainId: string) {
    if (selectedChains[0] === null) {
      selectChain(0, chainId)
      return
    }

    if (selectedChains[0] === chainId) {
      selectChain(0, null)
      return
    }

    if (selectedChains[1] === null) {
      selectChain(1, chainId)
      return
    }
  }
  return (
    <div className="mb-11 flex w-full flex-1 flex-col items-center justify-center gap-6 rounded-lg bg-white">
      <h2 className="text-brand text-heading-32">Select a pair of chains</h2>
      <div className="grid grid-cols-4 gap-2">
        {interopChains.map((chain) => (
          <ChainSelectorButton
            key={chain.id}
            chain={chain}
            selected={selectedChains.some(
              (selectedChain) => selectedChain === chain.id,
            )}
            onClick={() => toggleChain(chain.id)}
            onMouseEnter={() => {
              if (!selectedChains[0]) {
                return
              }

              utils.interop.dashboard.prefetch({
                selectedChains: [selectedChains[0], chain.id],
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
        'flex size-[148px] flex-col items-center justify-center gap-3 rounded border border-divider px-2 transition-colors hover:border-brand',
        selected && 'border-brand bg-brand/15',
        className,
      )}
      {...props}
    >
      <img
        src={chain.iconUrl}
        alt={chain.name}
        className="size-8 rounded-full bg-white shadow"
      />
      <span className="font-medium text-lg leading-none">{chain.name}</span>
    </button>
  )
}
