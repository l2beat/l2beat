import type {
  CropKey,
  ResolvedCrops,
} from '@l2beat/config/build/crops/canonicalCrops'
import { useState } from 'react'
import {
  CropFindings,
  CropNote,
  CropPlantArt,
  getCropStatusText,
} from '~/pages/garden/components/CropBadge'
import { cn } from '~/utils/cn'
import {
  type CropEntry,
  countInBloom,
  SENTIMENT_BORDER,
  SENTIMENT_ROOT,
  SENTIMENT_TEXT,
  SENTIMENT_TINT,
  toCropEntries,
} from './cropsShared'

// Layout follows the section's own width (container queries), because the
// side nav collapsing under 1200px makes a landscape tablet wider than a 13"
// laptop. Measured inner widths: 680-760px on 1280px laptops and portrait
// tablets, 930-1110px on landscape tablets, 360-400px on phones. Four rooted
// columns from 720px, two with inline chips from 520px, one below.

/**
 * The four plants stand full-size in one garden bed, and each roots straight
 * down into its own findings column, so nothing is behind a click. Hovering
 * either half of a crop dims the other three.
 */
export function CropsBed({
  crops,
  inGarden,
}: {
  crops: ResolvedCrops
  inGarden: boolean
}) {
  const entries = toCropEntries(crops)
  const [litKey, setLitKey] = useState<CropKey | undefined>()
  const lightUp = (key: CropKey) => ({
    lit: litKey === undefined || litKey === key,
    onEnter: () => setLitKey(key),
    onLeave: () => setLitKey(undefined),
  })

  return (
    <div className="@container">
      <div
        className={cn(
          'relative overflow-hidden rounded-t-xl border border-b-0',
          inGarden
            ? 'border-garden-border'
            : 'border-divider dark:border-transparent',
        )}
      >
        <Sky inGarden={inGarden} />
        <Verdict inGarden={inGarden} bloomCount={countInBloom(crops)} />
        <div className="relative grid grid-cols-4 items-end pt-4">
          {entries.map((entry) => (
            <Plant key={entry.key} entry={entry} {...lightUp(entry.key)} />
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
          <Findings key={entry.key} entry={entry} {...lightUp(entry.key)} />
        ))}
      </div>
    </div>
  )
}

interface LightUp {
  lit: boolean
  onEnter: () => void
  onLeave: () => void
}

function Plant({
  entry,
  lit,
  onEnter,
  onLeave,
}: { entry: CropEntry } & LightUp) {
  const { definition, evaluation, index } = entry
  return (
    <a
      href={`#crop-${entry.key}`}
      aria-label={`${definition.label}: ${getCropStatusText(evaluation.status, evaluation.sentiment)}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className={cn(
        'group relative flex flex-col items-center gap-1.5 pb-2 outline-none transition-opacity duration-300',
        lit ? 'opacity-100' : 'opacity-45',
      )}
    >
      <span className="relative flex items-end justify-center">
        <span
          aria-hidden
          className="absolute bottom-1 h-3 w-[70%] rounded-[100%] bg-black/15 opacity-0 blur-[4px] transition-opacity duration-300 group-hover:opacity-100 dark:bg-black/60"
        />
        <CropPlantArt
          status={evaluation.status}
          sentiment={evaluation.sentiment}
          delay={index * 0.12}
          width={80}
          className={cn(
            'group-hover:-translate-y-1 group-focus-visible:-translate-y-1 relative transition-transform duration-300',
            '@max-[519.9px]:[&>svg]:h-[62px] @max-[519.9px]:[&>svg]:w-[53px]',
          )}
        />
      </span>
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
        SENTIMENT_TEXT[sentiment],
        isDashed
          ? 'border-crop-neutral border-dashed'
          : SENTIMENT_BORDER[sentiment],
        className,
      )}
      style={{
        animation: `garden-pop .5s ease-out ${entry.index * 0.12}s both`,
      }}
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 rounded-full',
          SENTIMENT_TINT[sentiment],
        )}
      />
      <span className="relative">{entry.definition.letter}</span>
    </span>
  )
}

function Findings({
  entry,
  lit,
  onEnter,
  onLeave,
}: { entry: CropEntry } & LightUp) {
  const { definition, evaluation, index } = entry
  return (
    <div
      id={`crop-${entry.key}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        'relative scroll-mt-24 transition-opacity duration-300',
        '@min-[720px]:px-3 @min-[720px]:pt-8 @min-[720px]:pb-2 @min-[720px]:first:pl-0 @min-[720px]:last:pr-0',
        '@min-[900px]:px-5',
        lit ? 'opacity-100' : 'opacity-50',
      )}
      style={{
        animation: `garden-pop .45s ease-out ${0.4 + index * 0.08}s both`,
      }}
    >
      <span
        aria-hidden
        className={cn(
          'absolute top-0 left-1/2 h-6 border-l-2 border-dashed',
          '@max-[719.9px]:hidden',
          SENTIMENT_ROOT[evaluation.sentiment],
        )}
      />
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
          SENTIMENT_TEXT[evaluation.sentiment],
        )}
      >
        {getCropStatusText(evaluation.status, evaluation.sentiment)}
      </p>
      <CropNote
        note={definition.note}
        className="mt-2 text-[12px] leading-snug"
      />
      <div
        className={cn(
          'text-paragraph-13 leading-snug',
          '@min-[900px]:text-paragraph-14',
        )}
      >
        <CropFindings evaluation={evaluation} />
      </div>
    </div>
  )
}

function Verdict({
  inGarden,
  bloomCount,
}: {
  inGarden: boolean
  bloomCount: number
}) {
  return (
    <div className="relative z-10 flex items-center gap-2 px-4 pt-4">
      <span
        className={cn(
          'rounded-full px-2.5 py-1 font-bold text-[11px] uppercase tracking-[.12em]',
          inGarden
            ? 'bg-garden-accent text-white'
            : 'bg-primary/85 text-surface-primary',
        )}
      >
        {inGarden ? 'In the garden' : 'Not in the garden'}
      </span>
      <span className="font-medium text-[12px] text-secondary">
        {bloomCount} of 4 in bloom
      </span>
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
        <span className="absolute top-3 right-4 size-14 rounded-full bg-[#ffd54a]/70 blur-[2px] dark:bg-[#e9e2c4]/10 dark:blur-[3px]" />
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
