import type { PrivacyAdversarySentiment } from '@l2beat/config'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import type { RosetteValue } from '~/components/rosette/types'
import { cn } from '~/utils/cn'
import { sentimentToOpaqueBgColor } from '~/utils/sentiment'
import { PRIVACY_ADVERSARY_VERDICT } from '../adversaries/privacyAdversaryUi'

const LEGEND: {
  sentiment: PrivacyAdversarySentiment
  description: string
}[] = [
  {
    sentiment: 'good',
    description:
      "The promise holds for a careful user with the app's own settings.",
  },
  {
    sentiment: 'warning',
    description:
      'The promise holds only with significant extra work, like a custom build or your own servers.',
  },
  {
    sentiment: 'bad',
    description: 'The promise breaks, and no reasonable effort prevents that.',
  },
]

const EXAMPLE_ROSETTE: RosetteValue[] = (
  ['good', 'warning', 'good', 'bad', 'good'] as const
).map((sentiment, i) => ({
  name: `Adversary ${i + 1}`,
  value: PRIVACY_ADVERSARY_VERDICT[sentiment],
  sentiment,
}))

export function PrivacyRosetteLegend({ className }: { className?: string }) {
  return (
    <PrimaryCard
      className={cn('flex items-start gap-3 lg:items-center', className)}
    >
      <PizzaRosetteIcon
        values={EXAMPLE_ROSETTE}
        className="size-10 shrink-0"
        background={false}
        disableSectionLinking
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
        <div className="lg:w-64 lg:shrink-0">
          <h2 className="font-bold text-heading-16">
            How to read the privacy rosette
          </h2>
          <p className="mt-1 text-pretty font-medium text-label-value-12 text-secondary">
            Each slice is one adversary testing the protocol's privacy promise.
          </p>
        </div>
        <ul className="grid min-w-0 flex-1 gap-x-6 gap-y-2 md:grid-cols-3">
          {LEGEND.map(({ sentiment, description }) => (
            <li
              key={sentiment}
              className="flex items-start gap-1.5 text-paragraph-12 text-secondary"
            >
              <span
                className={cn(
                  'mt-0.5 size-2.5 shrink-0 rounded-xs',
                  sentimentToOpaqueBgColor(sentiment),
                )}
              />
              <span>
                <span className="font-medium text-primary">
                  {PRIVACY_ADVERSARY_VERDICT[sentiment]}:
                </span>{' '}
                {description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </PrimaryCard>
  )
}
