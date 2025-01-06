import Image from 'next/image'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { InfoIcon } from '~/icons/info'
import { type DaSummaryEthereumEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { DaEconomicSecurityCell } from './table/da-economic-security-cell'
import { ProjectsUsedIn } from './table/projects-used-in'

export function EthereumDaEntry({ entry }: { entry: DaSummaryEthereumEntry }) {
  const tvsToFormat = entry.usedIn.length > 0 ? entry.tvs : 0

  return (
    <Link href={entry.href ?? ''} className="group">
      <div className="mb-3 overflow-auto max-md:-mr-4">
        <div className="relative flex min-w-[940px] items-center justify-between gap-3 rounded-lg bg-blue-300 px-4 py-1 transition-colors duration-200 group-hover:bg-blue-400 dark:bg-blue-950 group-hover:dark:bg-blue-900 max-md:mr-4 md:py-3">
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon variant="blue" />
            </TooltipTrigger>
            <TooltipContent className="z-[1000]">
              From the rollup perspective, Ethereum&apos;s canonical chain
              cannot contain unavailable data commitments as full nodes
              self-verify the data availability of each block, discarding blocks
              with unavailable data. The rollup state validating bridge has
              access to all the data, as it is posted on chain.
            </TooltipContent>
          </Tooltip>
          <div className="flex w-full items-center justify-between ">
            <div className="flex items-center justify-center gap-2">
              <Image
                className="min-h-[20px] min-w-[20px]"
                src={`/icons/${entry.slug}.png`}
                width={16}
                height={16}
                alt={`${entry.name} logo`}
              />
              <ProjectNameCell project={entry} />
            </div>
            <div className="flex gap-2">
              <PropertyLabel>TVS</PropertyLabel>
              <div className="text-sm font-medium leading-[14px]">
                {formatCurrency(tvsToFormat, 'usd')}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <PropertyLabel>Slashable stake</PropertyLabel>
              <div className="text-right text-sm font-medium leading-[14px]">
                <DaEconomicSecurityCell value={entry.economicSecurity} />
              </div>
            </div>

            <div className="text-sm font-medium">{entry.bridge}</div>
            <div className="flex items-center justify-center gap-2">
              <PropertyLabel>Used by</PropertyLabel>
              <ProjectsUsedIn
                usedIn={entry.usedIn}
                className="text-sm font-medium"
                noTooltip
                noLink
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function PropertyLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-end text-[13px] font-semibold uppercase leading-none text-secondary">
      {children}
    </span>
  )
}
