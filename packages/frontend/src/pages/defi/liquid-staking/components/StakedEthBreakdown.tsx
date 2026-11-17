import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { InfoIcon } from '~/icons/Info'
import type { LiquidStakingStatsEntry } from '~/server/features/defi/liquid-staking/getLiquidStakingEntries'
import {
  getLargestOperator,
  type LiquidStakingOperators,
} from '~/server/features/defi/liquid-staking/getLiquidStakingOperators'
import type { LiquidStakingEthStaked } from '~/server/features/defi/liquid-staking/getLiquidStakingSummary'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { generateAccessibleColors } from '~/utils/generateColors'
import {
  CONSENSUS_THRESHOLDS,
  ETH_STAKED_TITLE,
  ETH_STAKED_TOOLTIP,
  formatEthStaked,
  formatEthStakedWithUsd,
  STAKED_ETH_BAR_NOTE,
  STAKED_ETH_SHARE_TOOLTIP,
} from '../liquidStakingMetrics'

const OTHER_STAKERS_LABEL = 'Other stakers'

interface Segment {
  id: string
  name: string
  share: number
  color: string
  operators?: LiquidStakingOperators
}

type StakedEthBarEntry = Pick<
  LiquidStakingStatsEntry,
  'id' | 'name' | 'shortName' | 'stakedEthShare' | 'operators'
>

/** The liquid staking page's card: the ETH staked over its split. */
export function StakedEthBreakdown({
  entries,
  ethStaked,
}: {
  entries: StakedEthBarEntry[]
  ethStaked: LiquidStakingEthStaked
}) {
  return (
    <PrimaryCard className="max-md:border-divider max-md:border-b md:mt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex items-center gap-1.5">
          <h2 className="font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
            {ETH_STAKED_TITLE}
          </h2>
          <Tooltip>
            <TooltipTrigger className="translate-y-px">
              <InfoIcon className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent className="max-w-80">
              <p>
                {ETH_STAKED_TOOLTIP} The bar splits it between the liquid
                staking protocols below.
              </p>
              <p className="mt-2">{STAKED_ETH_SHARE_TOOLTIP}</p>
              <p className="mt-2">{STAKED_ETH_BAR_NOTE}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-label-value-14 text-secondary">
          <span className="font-semibold text-primary">
            {formatEthStakedWithUsd(ethStaked.value, ethStaked.valueUsd)}
          </span>{' '}
          as of {formatTimestamp(ethStaked.timestamp, { mode: 'date' })}
        </p>
      </div>
      <StakedEthBar entries={entries} ethStaked={ethStaked} />
    </PrimaryCard>
  )
}

/**
 * The share of staked ETH of each protocol on one bar, marked where a share
 * of stake starts to matter, with a legend and the ETH each mark takes.
 */
export function StakedEthBar({
  entries,
  ethStaked,
  className,
}: {
  className?: string
  /** In the order of the page's charts, so each colour matches its line. */
  entries: StakedEthBarEntry[]
  ethStaked: LiquidStakingEthStaked
}) {
  // Colours by position in the full list, as the charts pick them.
  const colors = generateAccessibleColors(entries.length)
  const segments: Segment[] = entries.flatMap((entry, i) =>
    entry.stakedEthShare
      ? [
          {
            id: entry.id,
            name: entry.shortName ?? entry.name,
            share: entry.stakedEthShare.value,
            color: colors[i] ?? 'var(--secondary)',
            operators: entry.operators,
          },
        ]
      : [],
  )
  const trackedShare = Math.min(
    segments.reduce((sum, segment) => sum + segment.share, 0),
    1,
  )
  const otherShare = 1 - trackedShare

  return (
    <div className={className}>
      <StakeBar segments={segments} otherShare={otherShare} />

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-label-value-13">
        {segments.map((segment) => (
          <LegendItem
            key={segment.id}
            color={segment.color}
            name={segment.name}
            share={segment.share}
            detail={
              segment.operators &&
              `${formatCount(segment.operators.operatorCount)} operators`
            }
          />
        ))}
        <LegendItem
          color="var(--surface-tertiary)"
          name={OTHER_STAKERS_LABEL}
          share={otherShare}
          muted
        />
      </ul>

      <OperatorsNote segments={segments} />

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 border-divider border-t pt-3 text-label-value-13">
        {CONSENSUS_THRESHOLDS.map((threshold) => (
          <li key={threshold.fraction}>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5 text-left">
                <span className="font-bold text-primary">
                  {threshold.fraction}
                </span>
                <span className="font-medium">{threshold.title}</span>
                <span className="whitespace-nowrap text-secondary">
                  {formatEthStaked(ethStaked.value * threshold.share)}
                </span>
                <InfoIcon className="size-3" />
              </TooltipTrigger>
              <TooltipContent className="max-w-72">
                {threshold.description}
              </TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StakeBar({
  segments,
  otherShare,
}: {
  segments: Segment[]
  otherShare: number
}) {
  const label = [
    ...segments.map(
      (segment) => `${segment.name} ${formatPercent(segment.share)}`,
    ),
    `${OTHER_STAKERS_LABEL} ${formatPercent(otherShare)}`,
  ].join(', ')

  return (
    // The labels sit above the bar; the marks run through it.
    <div className="relative mt-3 pt-6">
      <div
        role="img"
        aria-label={`Share of staked ETH: ${label}`}
        className="flex h-3 w-full overflow-hidden rounded bg-surface-tertiary"
      >
        {segments.map((segment) =>
          segment.operators ? (
            <OperatorSegments
              key={segment.id}
              segment={segment}
              operators={segment.operators}
            />
          ) : (
            <Tooltip key={segment.id}>
              <TooltipTrigger
                asChild
                disabledOnTouch
                aria-label={`${segment.name}: ${formatPercent(segment.share)}`}
              >
                <div
                  className="h-full border-surface-primary border-r last:border-r-0"
                  style={{
                    width: `${segment.share * 100}%`,
                    backgroundColor: segment.color,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                {segment.name}: {formatPercent(segment.share)} of staked ETH
              </TooltipContent>
            </Tooltip>
          ),
        )}
        {otherShare > 0 && (
          <Tooltip>
            <TooltipTrigger
              asChild
              disabledOnTouch
              aria-label={`${OTHER_STAKERS_LABEL}: ${formatPercent(otherShare)}`}
            >
              {/* Fills the rest, so rounding never leaves a gap at the end. */}
              <div className="h-full flex-1" />
            </TooltipTrigger>
            <TooltipContent className="max-w-72">
              {OTHER_STAKERS_LABEL}: {formatPercent(otherShare)} of staked ETH.
              Everyone who stakes outside the protocols listed here, such as
              solo stakers, exchanges and other staking services.
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {CONSENSUS_THRESHOLDS.map((threshold) => (
        <div
          key={threshold.fraction}
          aria-hidden
          className="-translate-x-1/2 pointer-events-none absolute top-0 bottom-0 flex flex-col items-center"
          style={{ left: `${threshold.share * 100}%` }}
        >
          <span className="whitespace-nowrap font-medium text-label-value-12 text-secondary leading-4">
            <span className="font-bold text-primary">{threshold.fraction}</span>
            <span className="max-md:hidden"> {threshold.title}</span>
          </span>
          <span className="mt-0.5 w-0 flex-1 border-primary border-l border-dashed" />
        </div>
      ))}
    </div>
  )
}

/**
 * A protocol's slice split between the operators that run its validators, by
 * their part of the protocol's stake on the beacon chain.
 */
function OperatorSegments({
  segment,
  operators,
}: {
  segment: Segment
  operators: LiquidStakingOperators
}) {
  return (
    <div
      className="flex h-full border-surface-primary border-r last:border-r-0"
      style={{ width: `${segment.share * 100}%` }}
    >
      {operators.operators.map((operator, i) => (
        <Tooltip key={operator.name}>
          <TooltipTrigger
            asChild
            disabledOnTouch
            aria-label={`${operator.name}, ${segment.name}: ${formatPercent(operator.stakedEthShare)} of staked ETH`}
          >
            <div
              className="h-full"
              style={{
                width: `${operator.protocolShare * 100}%`,
                backgroundColor: segment.color,
                // Every other operator lighter, so neighbours stay apart.
                opacity: i % 2 === 0 ? 1 : 0.7,
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="max-w-72">
            <p className="font-medium">{operator.name}</p>
            <p className="text-secondary">
              {operator.operatorCount
                ? `${formatCount(operator.operatorCount)} ${segment.name} operators`
                : `${segment.name} operator`}
            </p>
            <p className="mt-1">
              {formatEthStaked(operator.eth)} in{' '}
              {formatCount(operator.validators)} validators:{' '}
              {formatPercent(operator.stakedEthShare)} of staked ETH
            </p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

/** When the operators were read, and the largest one. */
function OperatorsNote({ segments }: { segments: Segment[] }) {
  const traced = segments.flatMap((segment) =>
    segment.operators
      ? segment.operators.operators.map((operator) => ({
          operator,
          protocol: segment.name,
          timestamp: segment.operators?.timestamp ?? 0,
        }))
      : [],
  )
  const largest = getLargestOperator(traced.map((t) => t.operator))
  const first = traced[0]
  if (!largest || !first) return null
  const protocol = traced.find((t) => t.operator === largest)?.protocol

  return (
    <p className="mt-2 text-label-value-13 text-secondary leading-5">
      Protocols split by the operators that run their validators, from the
      beacon chain on {formatTimestamp(first.timestamp, { mode: 'date' })}. The
      largest single operator, {largest.name} ({protocol}), runs{' '}
      {formatPercent(largest.stakedEthShare)} of staked ETH.
    </p>
  )
}

function formatCount(value: number) {
  return value.toLocaleString('en-US')
}

function LegendItem({
  color,
  name,
  share,
  detail,
  muted,
}: {
  color: string
  name: string
  share: number
  detail?: string
  muted?: boolean
}) {
  return (
    <li className="flex items-center gap-1.5">
      <span
        className="size-2.5 shrink-0 rounded-sm"
        style={{ backgroundColor: color }}
      />
      <span className={cn('font-medium', muted && 'text-secondary')}>
        {name}
      </span>
      <span className="text-secondary">
        {formatPercent(share)}
        {detail && ` · ${detail}`}
      </span>
    </li>
  )
}
