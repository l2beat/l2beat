import type { PrivacyAdversarySentiment } from '@l2beat/config'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'
import { sentimentToOpaqueBgColor } from '~/utils/sentiment'
import {
  PRIVACY_ADVERSARY_LEGEND,
  PRIVACY_ADVERSARY_VERDICT,
} from '../adversaries/privacyAdversaryUi'

const SENTIMENTS: PrivacyAdversarySentiment[] = ['good', 'warning', 'bad']

/**
 * What the rosette colours mean, said once above all the tables in a slim
 * card of its own: the heading on the left, one column per colour beside it.
 * Swatches use the rosette's own fills.
 */
export function PrivacyRosetteLegend({ className }: { className?: string }) {
  return (
    <PrimaryCard
      className={cn(
        'flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-8',
        className,
      )}
    >
      <div className="lg:w-64 lg:shrink-0">
        <h2 className="font-bold text-heading-16">
          How to read the privacy rosette
        </h2>
        <p className="mt-1 font-medium text-label-value-12 text-secondary">
          Each slice is one adversary trying to break the protocol's privacy.
        </p>
      </div>
      <ul className="grid min-w-0 flex-1 gap-x-6 gap-y-2 md:grid-cols-3">
        {SENTIMENTS.map((sentiment) => (
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
              {PRIVACY_ADVERSARY_LEGEND[sentiment]}
            </span>
          </li>
        ))}
      </ul>
    </PrimaryCard>
  )
}
