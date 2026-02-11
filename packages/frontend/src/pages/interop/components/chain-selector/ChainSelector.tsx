import type { Project } from '@l2beat/config'
import type { WithProjectIcon } from '~/utils/withProjectIcon'
import { AllProtocolsDialog } from './AllProtocolsDialog'
import { ChainSelectorButton } from './ChainSelectorButton'
import type { InteropChainWithIcon } from './types'

interface Props {
  chains: InteropChainWithIcon[]
  protocols: WithProjectIcon<Project<'interopConfig'>>[]
}

export function ChainSelector({ chains, protocols }: Props) {
  return (
    <div className="sticky top-0 z-30 md:pt-4">
      <div className="-z-10 absolute top-0 h-22 w-full bg-gradient-to-b from-surface-secondary via-60% via-surface-secondary to-transparent max-md:hidden dark:from-background dark:via-background" />
      <div className="flex items-start justify-between bg-[#ECB2FF] px-4 py-3 max-md:flex-col max-md:gap-3 max-md:border-brand max-md:border-b md:items-center md:rounded-lg md:py-2 min-[1024px]:px-6 dark:bg-pink-900">
        <div>
          <div className="flex items-center gap-2 max-md:w-full max-md:flex-col max-md:items-start md:gap-[17px]">
            <div className="font-semibold text-xs uppercase">
              Chain Selector
            </div>
            <div className="h-10 w-px bg-black/16 max-md:hidden" />
            <div className="grid grid-cols-[1fr_12px_1fr] items-center gap-3 max-md:w-full">
              <ChainSelectorButton allChains={chains} type="first" />
              <span className="font-semibold leading-[115%]">&</span>
              <ChainSelectorButton allChains={chains} type="second" />
            </div>
          </div>
        </div>
        <AllProtocolsDialog protocols={protocols} />
      </div>
    </div>
  )
}
