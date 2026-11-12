import { formatCurrency } from '@l2beat/shared-pure'
import { getStageBadgeClassName } from '~/components/badge/StageBadge'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { HomeCardHeader } from '~/pages/home/components/HomeCardHeader'
import {
  HOME_ROW_CLASS,
  HOME_ROW_LINES_CLASS,
  HOME_TEXT,
} from '~/pages/home/homeStyles'
import type {
  L2StageShareKey,
  L2StageTvsShares,
} from '~/server/features/layer2s/summary/getL2StageTvsShares'
import { cn } from '~/utils/cn'
import { formatSnapshotTimestamp } from '~/utils/dates'

const STAGE_LABELS: Record<L2StageShareKey, string> = {
  'Stage 2': 'Stage 2',
  'Stage 1': 'Stage 1',
  'Stage 0': 'Stage 0',
  UnderReview: 'Under review',
  NotApplicable: 'No stage (Others)',
}

/**
 * How the value secured splits by stage: the share at Stage 1 or above as
 * the headline, a bar in the stage badges' colours, and a row per stage.
 * Beside the charts it is a column of rows; across the page
 * (`@min-[760px]`) the rows become a legend under the bar.
 */
export function L2SummaryStageShare({
  shares,
  className,
}: {
  shares: L2StageTvsShares
  className?: string
}) {
  const atLeastStage1 = shares.stages
    .filter((s) => s.stage === 'Stage 1' || s.stage === 'Stage 2')
    .reduce((sum, s) => sum + s.value, 0)

  return (
    <PrimaryCard
      className={cn('@container/stages flex min-w-0 flex-col', className)}
    >
      {/* Title to figure as in the charts' headers, so the three figures
        line up side by side. */}
      <div className="flex flex-col gap-3">
        <HomeCardHeader
          title="Value secured by stage"
          subtitle="Incl. Others"
          link={{ href: '/stages', label: 'About stages' }}
        />
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className={HOME_TEXT.number}>
            {formatShare(atLeastStage1 / shares.total)}
          </span>
          <span className="text-label-value-15 text-secondary">
            of value secured is at Stage 1 or above
          </span>
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-6">
        <div className="flex min-w-0 flex-col gap-2">
          <StageBar shares={shares} />
          {/* The total and date, so the shares can be checked against the
            Value secured chart. */}
          <p className={HOME_TEXT.meta}>
            Of {formatCurrency(shares.total, 'usd')} ·{' '}
            {formatSnapshotTimestamp(shares.timestamp, shares.resolution)}
          </p>
        </div>
        <ul
          className={cn(
            'flex flex-col',
            HOME_ROW_LINES_CLASS,
            '@min-[760px]/stages:hidden',
          )}
        >
          {shares.stages.map((s) => (
            <li
              key={s.stage}
              className={cn('flex items-center gap-3', HOME_ROW_CLASS)}
            >
              <StageSwatch stage={s.stage} />
              <span className={cn('min-w-0 truncate', HOME_TEXT.row)}>
                {STAGE_LABELS[s.stage]}
              </span>
              {/* Dropped on phones, where the longest label meets the
                  value. */}
              <span
                className={cn(
                  '@max-[400px]/stages:hidden shrink-0',
                  HOME_TEXT.meta,
                )}
              >
                {formatProjectCount(s.projectCount)}
              </span>
              <span
                className={cn('ml-auto shrink-0 text-right', HOME_TEXT.value)}
              >
                {formatCurrency(s.value, 'usd')}
              </span>
              <span
                className={cn(
                  'w-14 shrink-0 text-right font-semibold',
                  HOME_TEXT.value,
                )}
              >
                {formatShare(s.value / shares.total)}
              </span>
            </li>
          ))}
        </ul>
        {/* Across the page, a legend under the bar: one column a stage. */}
        <ul className="@min-[760px]/stages:grid hidden auto-cols-max grid-flow-col justify-between gap-x-8">
          {shares.stages.map((s) => (
            <li key={s.stage} className="flex min-w-0 flex-col gap-1.5">
              <span className="flex min-w-0 items-center gap-2">
                <StageSwatch stage={s.stage} />
                <span className={cn('truncate', HOME_TEXT.row)}>
                  {STAGE_LABELS[s.stage]}
                </span>
                <span className={cn('shrink-0', HOME_TEXT.meta)}>
                  {formatProjectCount(s.projectCount)}
                </span>
              </span>
              {/* Value, then share, as in the rows. */}
              <span className="flex items-baseline gap-2 pl-5">
                <span className={HOME_TEXT.value}>
                  {formatCurrency(s.value, 'usd')}
                </span>
                <span className={cn('font-semibold', HOME_TEXT.value)}>
                  {formatShare(s.value / shares.total)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </PrimaryCard>
  )
}

/**
 * Each stage as wide as its share; the rows carry the numbers. A stage under
 * 0.2% would be thinner than the gaps around it, so it is left out.
 */
function StageBar({ shares }: { shares: L2StageTvsShares }) {
  return (
    <div
      role="img"
      aria-label={shares.stages
        .map(
          (s) =>
            `${STAGE_LABELS[s.stage]} ${formatShare(s.value / shares.total)}`,
        )
        .join(', ')}
      className="flex h-8 w-full gap-0.5 overflow-hidden rounded-md"
    >
      {shares.stages.map((s) =>
        s.value / shares.total >= 0.002 ? (
          <div
            key={s.stage}
            className={cn(
              'h-full rounded-[3px]',
              getStageColorClassName(s.stage),
            )}
            style={{ flexGrow: s.value, flexBasis: 0 }}
          />
        ) : null,
      )}
    </div>
  )
}

function StageSwatch({ stage }: { stage: L2StageShareKey }) {
  return (
    <span
      aria-hidden
      className={cn(
        'size-3 shrink-0 rounded-[3px] dark:ring-1 dark:ring-white/10',
        getStageColorClassName(stage),
      )}
    />
  )
}

function formatProjectCount(count: number) {
  return `${count} ${count === 1 ? 'project' : 'projects'}`
}

/**
 * The stage badges' colours, except where a dark badge fill is nearly the
 * card's colour, which a badge's text makes up for and a swatch cannot.
 */
function getStageColorClassName(stage: L2StageShareKey) {
  if (stage === 'NotApplicable') return 'bg-[#B4C7D5] dark:bg-[#6B7194]'
  // Its badge's dark green is too close to the dark card for a bare swatch.
  if (stage === 'Stage 2')
    return cn(getStageBadgeClassName(stage), 'dark:bg-[#1f8a2a]')
  return getStageBadgeClassName(stage)
}

/** Whole percents, one decimal under 10%, and "<0.1%" for slivers. */
function formatShare(ratio: number) {
  const percent = ratio * 100
  if (percent > 0 && percent < 0.1) return '<0.1%'
  return `${percent < 10 ? percent.toFixed(1) : Math.round(percent)}%`
}
