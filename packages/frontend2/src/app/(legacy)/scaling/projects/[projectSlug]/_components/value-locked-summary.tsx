import { type WarningWithSentiment } from '@l2beat/config'
import { UpcomingBadge } from '~/app/_components/badge/upcoming-badge'
import { ValueLockedBreakdown } from '~/app/_components/breakdown/value-locked-breakdown'
import { CustomLink } from '~/app/_components/link/custom-link'
import { PercentChange } from '~/app/_components/percent-change'
import { Square } from '~/app/_components/square'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { formatCurrency } from '~/utils/format'
import { unifyPercentagesAsIntegers } from '~/utils/math'

export interface ValueLockedStats {
  tvlChange: number
  tvl: number
  canonical: number
  external: number
  native: number
}

export interface ValueLockedSummaryProps {
  stats: ValueLockedStats
  tvlBreakdownHref?: string
  tvlWarning?: WarningWithSentiment
  isArchived?: boolean
}

export function ValueLockedSummary(props: ValueLockedSummaryProps) {
  const [canonical, external, native] = unifyPercentagesAsIntegers([
    props.stats.tvl === 0
      ? 100 / 3
      : (props.stats.canonical / props.stats.tvl) * 100,
    props.stats.tvl === 0
      ? 100 / 3
      : (props.stats.external / props.stats.tvl) * 100,
    props.stats.tvl === 0
      ? 100 / 3
      : (props.stats.native / props.stats.tvl) * 100,
  ] as const)

  const tvlStats = props.stats
    ? [
        {
          label: 'Canonically Bridged',
          shortLabel: 'Canonical',
          value: formatCurrency(props.stats.canonical, 'usd'),
          usage: canonical,
          icon: <Square variant="canonical" />,
        },
        {
          label: 'Externally Bridged',
          shortLabel: 'External',
          value: formatCurrency(props.stats.external, 'usd'),
          usage: external,
          icon: <Square variant="external" />,
        },
        {
          label: 'Natively Minted',
          shortLabel: 'Native',
          value: formatCurrency(props.stats.native, 'usd'),
          usage: native,
          icon: <Square variant="native" />,
        },
      ]
    : []
  return (
    <div className="bg-gray-100 dark:bg-zinc-900 md:flex md:flex-col md:gap-3 md:rounded-lg md:px-6 md:py-4">
      <div className="flex w-full flex-wrap items-baseline justify-between md:gap-2">
        <span className="text-lg font-medium md:hidden md:text-xs md:font-normal md:text-gray-500 md:dark:text-gray-600">
          Value Locked
        </span>
        <span className="hidden text-lg font-bold text-gray-500 dark:text-gray-600 md:block md:text-xs md:font-normal">
          TVL
        </span>

        {props.stats && (props.stats.tvl > 0 || props.isArchived) ? (
          props.tvlWarning ? (
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1">
                <p className="text-lg font-bold md:text-2xl md:leading-none">
                  {formatCurrency(props.stats.tvl, 'usd')}
                </p>
                {props.stats.tvl > 0 && (
                  <p className="text-xs font-bold md:text-base">
                    <PercentChange value={props.stats.tvlChange} />
                  </p>
                )}
                {props.tvlWarning && (
                  <RoundedWarningIcon
                    className="size-4"
                    sentiment={props.tvlWarning.sentiment}
                  />
                )}
              </TooltipTrigger>
              <TooltipContent>{props.tvlWarning.content}</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-1">
              <p className="text-nowrap text-lg font-bold md:text-2xl md:leading-none">
                {formatCurrency(props.stats.tvl, 'usd')}
              </p>
              {props.stats.tvl > 0 && (
                <p className="text-xs font-bold md:text-base">
                  <PercentChange value={props.stats.tvlChange} />
                </p>
              )}
              {props.tvlWarning && (
                <RoundedWarningIcon className="size-4" sentiment="warning" />
              )}
            </div>
          )
        ) : (
          <div className="w-auto">
            <UpcomingBadge />
          </div>
        )}
      </div>
      <ValueLockedBreakdown
        canonical={canonical}
        external={external}
        native={native}
        className="my-3 h-1 w-full md:my-0"
      />
      <div className="flex h-1/2 flex-wrap gap-3 @container md:gap-0">
        {tvlStats.map((s, i) => (
          <div
            key={i}
            className="flex w-full flex-nowrap items-center justify-between gap-1"
          >
            <div className="flex items-center gap-1">
              {s.icon}
              <span className="text-xs leading-none text-gray-500 dark:text-gray-600">
                <span className="inline md:hidden">{s.label}</span>
                <span className="hidden md:inline">{s.shortLabel}</span>
              </span>
            </div>
            <span className="whitespace-nowrap text-base font-semibold leading-none">
              {s.value}
              {props.stats && props.stats.tvl > 0 && (
                <span className="hidden font-normal text-gray-500 @[200px]:inline">
                  {` (${s.usage}%)`}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
      {props.tvlBreakdownHref && (
        <div className="mt-2 flex justify-center md:mt-0">
          <CustomLink href={props.tvlBreakdownHref} className="text-xs">
            View TVL Breakdown
          </CustomLink>
        </div>
      )}
    </div>
  )
}
