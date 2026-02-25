import { env } from '~/env'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { AllProtocolsDialog } from './AllProtocolsDialog'
import { ChainSelectorButton } from './ChainSelectorButton'
import type { InteropChainWithIcon } from './types'

interface Props {
  chains: InteropChainWithIcon[]
  protocols: ProtocolDisplayable[]
}

export function ChainSelector({ chains, protocols }: Props) {
  const { buildUrl } = useInteropSelectedChains()
  const internalSummaryUrl = buildUrl('/interop/summary', { mode: 'internal' })

  return (
    <div className="sticky top-0 z-30 md:pt-4">
      <div className="-z-10 absolute top-0 h-22 w-full bg-gradient-to-b from-surface-secondary via-60% via-surface-secondary to-transparent max-md:hidden dark:from-background dark:via-background" />
      <div className="flex items-start justify-between bg-[#ECB2FF] px-4 py-3 max-md:flex-col max-md:gap-3 max-md:border-brand max-md:border-b md:items-center md:rounded-lg md:py-2 min-[1024px]:px-6 dark:bg-pink-900">
        <div className="mr-2 max-md:w-full">
          <div className="flex items-center gap-2 max-md:w-full max-md:flex-col max-md:items-start md:gap-[17px]">
            <div className="whitespace-nowrap font-semibold text-xs uppercase">
              Chain selector
            </div>
            <div className="h-10 w-px bg-black/16 max-md:hidden" />
            <div className="flex items-center gap-3 max-md:grid max-md:w-full max-md:grid-cols-[1fr_12px_1fr]">
              <ChainSelectorButton allChains={chains} chainKey="from" />
              <span className="font-semibold leading-[115%]">&</span>
              <ChainSelectorButton allChains={chains} chainKey="to" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {env.DEPLOYMENT_ENV !== 'production' && (
            <a
              href={internalSummaryUrl}
              className="rounded border border-brand px-2 py-1 font-semibold text-brand text-xs leading-none md:px-3 md:py-1.5 md:text-sm"
            >
              Internal dashboard
            </a>
          )}
          <span className="font-medium text-xs leading-none max-md:opacity-50 md:text-base">
            Across {protocols.length} protocols
          </span>
          <AllProtocolsDialog protocols={protocols} />
        </div>
      </div>
    </div>
  )
}
