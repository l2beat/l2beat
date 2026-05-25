import { SwapIcon } from '~/icons/Swap'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { cn } from '~/utils/cn'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { AllProtocolsDialog } from './AllProtocolsDialog'
import { MultiChainSelectorButton } from './MultiChainSelectorButton'
import type { InteropChainWithIcon } from './types'

interface Props {
  chains: InteropChainWithIcon[]
  protocols?: ProtocolDisplayable[]
}

export function MultiChainSelector({ chains, protocols }: Props) {
  const { isDirty, swapPaths } = useInteropSelectedChains()

  return (
    <div className="sticky top-0 z-30 md:pt-4">
      <div className="-z-10 absolute top-0 h-22 w-full bg-gradient-to-b from-surface-secondary via-60% via-surface-secondary to-transparent max-md:hidden dark:from-background dark:via-background" />
      <div className="flex items-start justify-between bg-[#ECB2FF] px-4 py-3 max-md:flex-col max-md:gap-3 max-md:border-brand max-md:border-b md:items-center md:rounded-lg md:py-2 min-[1024px]:px-6 dark:bg-pink-900">
        <div className="flex items-center gap-[17px] max-md:w-full">
          <div className="font-semibold text-xs uppercase max-[1024px]:hidden">
            Chain Selector
          </div>
          <div className="h-10 w-px bg-black/16 max-[1024px]:hidden" />
          <div className="flex items-center gap-3 max-md:w-full">
            <MultiChainSelectorButton allChains={chains} type="from" />
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-brand p-[11px] max-md:self-end max-md:p-[7px]"
              onClick={swapPaths}
              title="Swap From and To"
            >
              <SwapIcon className="size-4 fill-brand" />
            </button>
            <MultiChainSelectorButton allChains={chains} type="to" />
          </div>
        </div>
        <div
          className={cn(
            'flex items-center gap-3 max-md:hidden',
            !isDirty && !protocols && 'hidden',
          )}
        >
          {protocols && (
            <>
              <span className="font-medium text-base leading-none">
                Across {protocols.length} protocols
              </span>
              <AllProtocolsDialog protocols={protocols} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
