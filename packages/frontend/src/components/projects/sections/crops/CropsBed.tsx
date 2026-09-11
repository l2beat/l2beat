import type { ResolvedCrops } from '@l2beat/config'
import { CropFindings, CropNote } from '~/components/garden/CropFindings'
import { CropPlant } from '~/components/garden/CropPlant'
import {
  CROP_BORDER,
  CROP_INK,
  CROP_SWATCH,
  CROP_TINT,
} from '~/components/garden/cropPalette'
import {
  type CropEntry,
  getCropStatusText,
  toCropEntries,
} from '~/components/garden/crops'
import { cn } from '~/utils/cn'

// Layout follows the section's own width (container queries), because the
// side nav collapsing under 1200px makes a landscape tablet wider than a 13"
// laptop. Measured inner widths: 680-760px on 1280px laptops and portrait
// tablets, 930-1110px on landscape tablets, 360-400px on phones. Four rooted
// columns from 720px, two with inline chips from 520px, one below.

/**
 * The four plants stand full-size in one garden bed, and each roots straight
 * down into its own findings column, so nothing is behind a click.
 */
export function CropsBed({
  crops,
  inGarden,
}: {
  crops: ResolvedCrops
  inGarden: boolean
}) {
  const entries = toCropEntries(crops)

  return (
    <div className="@container">
      <Verdict inGarden={inGarden} entries={entries} />
      <div
        className={cn(
          'relative mt-4 overflow-hidden rounded-t-xl border border-b-0',
          inGarden
            ? 'border-garden-border'
            : 'border-divider dark:border-transparent',
        )}
      >
        <Sky inGarden={inGarden} />
        <div className="relative grid grid-cols-4 items-end pt-7">
          {entries.map((entry) => (
            <Plant key={entry.key} entry={entry} />
          ))}
        </div>
        <Soil />
      </div>

      <div
        className={cn(
          'grid grid-cols-4',
          '@max-[719.9px]:grid-cols-2 @max-[719.9px]:gap-x-6 @max-[719.9px]:gap-y-5 @max-[719.9px]:pt-4',
          '@max-[519.9px]:grid-cols-1',
        )}
      >
        {entries.map((entry) => (
          <Findings key={entry.key} entry={entry} />
        ))}
      </div>
    </div>
  )
}

function Plant({ entry }: { entry: CropEntry }) {
  const { definition, evaluation, index } = entry
  return (
    <a
      href={`#crop-${entry.key}`}
      aria-label={`${definition.label}: ${getCropStatusText(evaluation.status, evaluation.sentiment)}`}
      className="flex flex-col items-center gap-1.5 pb-2"
    >
      <CropPlant
        status={evaluation.status}
        sentiment={evaluation.sentiment}
        delay={index * 0.12}
        width={80}
        className="@max-[519.9px]:[&>svg]:h-[62px] @max-[519.9px]:[&>svg]:w-[53px]"
      />
      <LetterChip entry={entry} className="size-7 text-[11px]" />
    </a>
  )
}

/** The letter under the plant, as on the garden badge. Dashed when the review is not final. */
function LetterChip({
  entry,
  className,
}: {
  entry: CropEntry
  className?: string
}) {
  const { status, sentiment } = entry.evaluation
  const isDashed = status === 'partiallyReviewed' || status === 'notReviewed'
  return (
    <span
      className={cn(
        'relative grid place-items-center rounded-full border-[1.5px] font-bold',
        // A solid backdrop under the tint keeps the sky from showing through.
        'bg-[var(--crop-plant-bg,var(--surface-primary))]',
        CROP_INK[sentiment],
        isDashed ? 'border-crop-neutral border-dashed' : CROP_BORDER[sentiment],
        className,
      )}
      style={{
        animation: `garden-pop .5s ease-out ${entry.index * 0.12}s both`,
      }}
    >
      <span
        aria-hidden
        className={cn('absolute inset-0 rounded-full', CROP_TINT[sentiment])}
      />
      <span className="relative">{entry.definition.letter}</span>
    </span>
  )
}

function Findings({ entry }: { entry: CropEntry }) {
  const { definition, evaluation } = entry
  return (
    <div
      id={`crop-${entry.key}`}
      className={cn(
        'scroll-mt-24',
        '@min-[720px]:px-3 @min-[720px]:pt-5 @min-[720px]:pb-2 @min-[720px]:first:pl-0 @min-[720px]:last:pr-0',
        '@min-[900px]:px-5',
      )}
    >
      <h3 className="flex items-center gap-2 font-bold text-paragraph-15 leading-tight">
        <LetterChip
          entry={entry}
          className={'@max-[719.9px]:grid hidden size-[22px] text-[10px]'}
        />
        {definition.label}
      </h3>
      <p
        className={cn(
          'mt-0.5 font-semibold text-[11px] uppercase tracking-[.14em]',
          CROP_INK[evaluation.sentiment],
        )}
      >
        {getCropStatusText(evaluation.status, evaluation.sentiment)}
      </p>
      <div
        className={cn(
          'text-paragraph-13 leading-snug',
          '@min-[900px]:text-paragraph-14',
        )}
      >
        <CropFindings evaluation={evaluation} />
      </div>
      <CropNote
        note={definition.note}
        className="mt-3 text-[12px] leading-snug"
      />
    </div>
  )
}

/** The verdict as a headline, with a swatch per crop so the tally can be read at a glance. */
function Verdict({
  inGarden,
  entries,
}: {
  inGarden: boolean
  entries: CropEntry[]
}) {
  const bloomCount = entries.filter(
    (e) => e.evaluation.sentiment === 'good',
  ).length
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <p
        className={cn(
          'font-bold text-heading-20 leading-tight',
          inGarden ? 'text-garden-accent' : 'text-primary',
        )}
      >
        {inGarden ? 'Grows in the garden.' : 'Not in the garden yet.'}
      </p>
      <div className="flex items-center gap-2">
        <span className="font-medium text-[12px] text-secondary uppercase tracking-wider">
          {bloomCount} of 4 in bloom
        </span>
        <span className="flex gap-1" aria-hidden>
          {entries.map((entry) => (
            <span
              key={entry.key}
              title={entry.definition.label}
              className={cn(
                'h-2 w-5 rounded-sm',
                CROP_SWATCH[entry.evaluation.sentiment],
              )}
            />
          ))}
        </span>
      </div>
    </div>
  )
}

function Sky({ inGarden }: { inGarden: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0">
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-b',
          inGarden
            ? 'from-garden-canvas via-garden-tint to-garden-tint'
            : 'from-surface-secondary/70 via-surface-secondary/30 to-surface-secondary/20',
        )}
      />
      {inGarden && (
        <span className="absolute top-3 right-4 size-14 rounded-full bg-[#ffd54a]/70 blur-[2px] dark:hidden" />
      )}
      <svg
        className="absolute inset-x-0 bottom-0 h-10 w-full"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 C200 15 380 55 600 32 C820 10 1000 50 1200 28 L1200 60 L0 60 Z"
          className={
            inGarden
              ? 'fill-garden-border/60'
              : 'fill-surface-secondary dark:fill-surface-secondary/60'
          }
        />
      </svg>
    </div>
  )
}

function Soil() {
  return (
    <div
      aria-hidden
      className="relative h-3 w-full bg-garden-soil [background-image:radial-gradient(circle_at_10%_60%,rgba(0,0,0,.08)_1px,transparent_1.5px),radial-gradient(circle_at_60%_30%,rgba(0,0,0,.08)_1px,transparent_1.5px)] [background-size:22px_12px,17px_12px]"
    />
  )
}
