import type { PrivacyAdversarySentiment } from '@l2beat/config'
import { useState } from 'react'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { cn } from '~/utils/cn'
import {
  foldPrivacyAdversaries,
  PRIVACY_ADVERSARY_VERDICT,
} from '../../adversaries/privacyAdversaryUi'
import { PrivacySentimentDot } from '../../PrivacySentimentDot'
import { FigureProgress } from './FigureProgress'
import { type FigureData, MethodologyFigure } from './MethodologyFigure'
import { useFigureAutoplay } from './useFigureAutoplay'

const INTERVAL_MS = 3000

type Rule = 'red' | 'majority' | 'tie' | 'future'

/** Ratings in adversary order, one example per rule. */
const EXAMPLES: { rule: Rule; sentiments: PrivacyAdversarySentiment[] }[] = [
  { rule: 'red', sentiments: ['good', 'good', 'good', 'bad', 'good'] },
  {
    rule: 'majority',
    sentiments: ['good', 'warning', 'warning', 'warning', 'good'],
  },
  { rule: 'tie', sentiments: ['good', 'warning', 'good', 'warning', 'good'] },
  { rule: 'future', sentiments: ['good', 'good', 'good', 'warning', 'bad'] },
]

const RULES: Record<Rule, string> = {
  red: 'Any red makes it red',
  majority: 'Otherwise the majority wins',
  tie: 'A tie is green',
  future: 'The future adversary is left out',
}

const NEXT: Record<PrivacyAdversarySentiment, PrivacyAdversarySentiment> = {
  good: 'warning',
  warning: 'bad',
  bad: 'good',
}

export function SummaryFoldFigure({ data }: { data: FigureData }) {
  const { step, pick, playing, containerProps } = useFigureAutoplay(
    EXAMPLES.length,
    INTERVAL_MS,
  )
  const [custom, setCustom] = useState<PrivacyAdversarySentiment[]>()
  const sentiments = custom ?? EXAMPLES[step]?.sentiments ?? []
  const cells = data.adversaries.map(({ id }, i) => ({
    id,
    sentiment: sentiments[i] ?? 'good',
  }))
  const fold = foldPrivacyAdversaries(cells)
  // Graded as if it counted, to show when leaving it out matters.
  const withFuture = foldPrivacyAdversaries(
    cells.map((c) => ({ ...c, id: 'publicObserver' as const })),
  )
  const applied = getAppliedRules(
    cells.length - 1,
    fold,
    withFuture.sentiment !== fold.sentiment,
  )

  return (
    <MethodologyFigure caption="How five ratings become the one dot in the summary table. Tap a rating to change it, or a rule to see an example.">
      <div
        {...containerProps}
        className="grid min-w-0 items-center gap-6 md:grid-cols-[auto_1fr]"
      >
        <div className="flex items-end justify-center gap-1 sm:gap-3">
          {data.adversaries.map(({ id, label }, i) => {
            const sentiment = sentiments[i] ?? 'good'
            const future = id === 'futureAdversary'
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  pick(step)
                  setCustom(sentiments.map((s, j) => (j === i ? NEXT[s] : s)))
                }}
                aria-label={`${label}: ${PRIVACY_ADVERSARY_VERDICT[sentiment]}. Change`}
                className={cn(
                  'group flex w-11 flex-col items-center gap-2 sm:w-16',
                  future && 'opacity-40',
                )}
              >
                <span className="min-h-7 text-center font-medium text-[10px] text-secondary leading-tight sm:text-label-value-12">
                  {label}
                </span>
                <PrivacySentimentDot
                  sentiment={sentiment}
                  size="lg"
                  className="size-6 transition-[transform,background-color] duration-300 group-hover:scale-110 group-active:scale-95 sm:size-8"
                />
              </button>
            )
          })}
          <ArrowRightIcon className="mb-1.5 size-3.5 shrink-0 fill-secondary sm:mb-2.5 sm:size-4" />
          <div className="flex w-11 flex-col items-center gap-2 sm:w-16">
            <span className="min-h-7 font-bold text-[10px] leading-tight sm:text-label-value-12">
              Summary
            </span>
            <PrivacySentimentDot
              key={fold.sentiment}
              sentiment={fold.sentiment}
              size="lg"
              className="motion-safe:zoom-in-50 size-6 scale-125 motion-safe:animate-in motion-safe:duration-300 sm:size-8"
            />
          </div>
        </div>
        <div>
          <ul className="space-y-1">
            {(Object.keys(RULES) as Rule[]).map((rule) => (
              <li key={rule}>
                <button
                  type="button"
                  onClick={() => {
                    setCustom(undefined)
                    pick(EXAMPLES.findIndex((e) => e.rule === rule))
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left font-medium text-label-value-14 transition-colors',
                    applied.has(rule)
                      ? 'bg-brand/10 text-brand'
                      : 'text-secondary hover:bg-brand/5',
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 shrink-0 rounded-full transition-colors',
                      applied.has(rule) ? 'bg-brand' : 'bg-divider',
                    )}
                  />
                  {RULES[rule]}
                </button>
              </li>
            ))}
          </ul>
          <FigureProgress
            steps={EXAMPLES.length}
            step={step}
            playing={playing && custom === undefined}
            intervalMs={INTERVAL_MS}
            className="mt-3 px-2.5"
          />
        </div>
      </div>
    </MethodologyFigure>
  )
}

/** The rules that decided this summary colour. */
function getAppliedRules(
  graded: number,
  fold: ReturnType<typeof foldPrivacyAdversaries>,
  futureMatters: boolean,
): Set<Rule> {
  const applied = new Set<Rule>()
  if (fold.bad > 0) applied.add('red')
  else if (fold.warnings * 2 === graded) applied.add('tie')
  else applied.add('majority')
  if (futureMatters) applied.add('future')
  return applied
}
