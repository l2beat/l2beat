import { formatCurrency } from '@l2beat/shared-pure'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { HomeCardHeader } from '~/pages/home/components/HomeCardHeader'
import { HOME_ROW_LINES_CLASS, HOME_TEXT } from '~/pages/home/homeStyles'
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
          link={{ href: '/stages', label: 'About stages' }}
        />
        <div className="flex items-baseline justify-between gap-x-6">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className={HOME_TEXT.number}>
              {formatShare(atLeastStage1 / shares.total)}
            </span>
            <span className="text-label-value-15 text-secondary">
              of value secured is at Stage 1 or above
            </span>
          </p>
          {/* Across the page, beside the headline, where it costs no row. */}
          <Caption
            shares={shares}
            className="@min-[760px]/stages:block hidden shrink-0"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <StageBar shares={shares} />
          <Caption shares={shares} className="@min-[760px]/stages:hidden" />
        </div>
        <ul
          className={cn(
            'flex flex-col',
            HOME_ROW_LINES_CLASS,
            '@min-[760px]/stages:hidden flex-1',
          )}
        >
          {shares.stages.map((s) => (
            <li
              key={s.stage}
              // At least a home row; beside the charts the rows share the
              // card's height, so the last ends level with their legends.
              className="flex min-h-10 flex-1 items-center gap-3"
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
        <ul className="@min-[760px]/stages:grid hidden auto-cols-fr grid-flow-col gap-x-8">
          {shares.stages.map((s) => (
            <li key={s.stage} className="flex min-w-0 flex-col gap-1.5">
              <span className="flex min-w-0 items-center gap-2">
                <StageSwatch stage={s.stage} />
                <span className={cn('truncate', HOME_TEXT.row)}>
                  {STAGE_LABELS[s.stage]}
                </span>
                {/* Dropped where a quarter of the card can't fit it beside
                  the longest label. */}
                <span
                  className={cn(
                    '@max-[1000px]/stages:hidden shrink-0',
                    HOME_TEXT.meta,
                  )}
                >
                  {formatProjectCount(s.projectCount)}
                </span>
              </span>
              {/* Value, then share, as in the rows; under the label, past the
                10px swatch and its 8px gap. */}
              <span className="flex items-baseline gap-3 pl-[18px]">
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
      // A thin rule rather than a block: the numbers carry the card, the bar
      // only shows their proportions.
      className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full"
    >
      {shares.stages.map((s) =>
        s.value / shares.total >= 0.002 ? (
          <div
            key={s.stage}
            className={cn('h-full', STAGE_FILLS[s.stage])}
            style={{ flexGrow: s.value, flexBasis: 0 }}
          />
        ) : null,
      )}
    </div>
  )
}

/** The total and date, so the shares can be checked against the chart. */
function Caption({
  shares,
  className,
}: {
  shares: L2StageTvsShares
  className?: string
}) {
  return (
    <p className={cn(HOME_TEXT.meta, className)}>
      Of {formatCurrency(shares.total, 'usd')} ·{' '}
      {formatSnapshotTimestamp(shares.timestamp, shares.resolution)}
    </p>
  )
}

function StageSwatch({ stage }: { stage: L2StageShareKey }) {
  return (
    <span
      aria-hidden
      className={cn(
        'size-2.5 shrink-0 rounded-[2px] dark:ring-1 dark:ring-white/10',
        STAGE_FILLS[stage],
      )}
    />
  )
}

function formatProjectCount(count: number) {
  return `${count} ${count === 1 ? 'project' : 'projects'}`
}

/**
 * The stage badges' fills (see `getStageBadgeClassName`), without their
 * borders. In the dark, Stage 2 is lighter than its badge: a badge's text sets
 * it apart from the card, a bare swatch has only its colour.
 */
const STAGE_FILLS: Record<L2StageShareKey, string> = {
  'Stage 2': 'bg-green-900 dark:bg-[#1f8a2a]',
  'Stage 1': 'bg-[#FFC61B]',
  'Stage 0': 'bg-orange-600 dark:bg-[#E03109]',
  UnderReview: 'bg-n-yellow-700/40 dark:bg-yellow-200/40',
  // The charts' colour for Others, which are the projects without a stage.
  NotApplicable: 'bg-(--chart-slate)',
}

/** Whole percents, one decimal under 10%, and "<0.1%" for slivers. */
function formatShare(ratio: number) {
  const percent = ratio * 100
  if (percent > 0 && percent < 0.1) return '<0.1%'
  return `${percent < 10 ? percent.toFixed(1) : Math.round(percent)}%`
}
