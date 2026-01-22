import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { ChainSelectorButton } from './ChainSelectorButton'
import type { InteropChainWithIcon } from './types'

interface Props {
  chains: InteropChainWithIcon[]
}

export function ChainSelector({ chains }: Props) {
  const { reset, isDirty } = useInteropSelectedChains()

  return (
    <div className="sticky top-0 z-30 md:pt-4">
      <div className="-z-10 absolute top-0 h-22 w-full bg-gradient-to-b from-surface-secondary via-60% via-surface-secondary to-transparent max-md:hidden dark:from-background dark:via-background" />
      <div className="flex items-center justify-between bg-[#ECB2FF] px-4 py-3 max-md:border-brand max-md:border-b md:rounded-lg md:py-2 min-[1024px]:px-6 dark:bg-pink-900">
        <div className="flex items-center gap-[17px]">
          <div className="font-semibold text-xs uppercase max-[1024px]:hidden">
            Chain Selector
          </div>
          <div className="h-10 w-px bg-black/16 max-[1024px]:hidden" />
          <div className="flex items-center gap-3">
            <ChainSelectorButton allChains={chains} type="from" />
            <ChainSelectorButton allChains={chains} type="to" />
          </div>
        </div>
        {isDirty && (
          <button
            className="font-semibold text-base leading-[115%] underline max-md:hidden"
            onClick={reset}
          >
            Reset to default
          </button>
        )}
      </div>
    </div>
  )
}
