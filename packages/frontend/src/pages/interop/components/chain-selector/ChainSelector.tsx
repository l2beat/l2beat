import { ChainSelectorButton } from './ChainSelectorButton'
import type { InteropChainWithIcon } from './types'

interface Props {
  chains: InteropChainWithIcon[]
}

export function ChainSelector({ chains }: Props) {
  return (
    <div className="sticky top-0 z-30 md:pt-4">
      <div className="-z-10 absolute top-0 h-22 w-full bg-gradient-to-b from-surface-secondary via-60% via-surface-secondary to-transparent max-md:hidden dark:from-background dark:via-background" />
      <div className="flex items-center justify-between bg-[#ECB2FF] px-4 py-3 max-md:border-brand max-md:border-b md:rounded-lg md:py-2 min-[1024px]:px-6 dark:bg-pink-900">
        <div className="flex items-center gap-2 max-md:flex-col max-md:items-start md:gap-[17px]">
          <div className="font-semibold text-xs uppercase">Chain Selector</div>
          <div className="h-10 w-px bg-black/16 max-md:hidden" />
          <div className="flex items-center gap-3">
            <ChainSelectorButton allChains={chains} type="first" />
            <span className="font-semibold leading-[115%]">&</span>
            <ChainSelectorButton allChains={chains} type="second" />
          </div>
        </div>
      </div>
    </div>
  )
}
