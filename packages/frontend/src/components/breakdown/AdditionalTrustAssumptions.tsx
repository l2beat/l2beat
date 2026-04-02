import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { formatPercent } from '~/utils/calculatePercentageChange'

interface AdditionalTrustAssumptionsProps {
  percentage: number
}

const additionalTrustBannerVariants = cva(
  'mt-2 w-full rounded-md px-2.5 py-2',
  {
    variants: {
      sentiment: {
        good: 'bg-positive/15 dark:bg-positive/20',
        warning: 'bg-warning/15 dark:bg-warning/20',
        bad: 'bg-negative/10 dark:bg-negative/20',
      },
    },
  },
)

const additionalTrustPercentVariants = cva('font-bold', {
  variants: {
    sentiment: {
      good: 'text-positive',
      warning: 'text-warning',
      bad: 'text-negative',
    },
  },
})

export function AdditionalTrustAssumptionsText({
  percentage,
}: AdditionalTrustAssumptionsProps) {
  return (
    <div className="text-right font-medium text-[11px] text-secondary leading-none">
      <AdditionalTrustAssumptionsContent percentage={percentage}>
        with additional trust assumptions
      </AdditionalTrustAssumptionsContent>
    </div>
  )
}

export function AdditionalTrustAssumptionsBanner({
  percentage,
}: AdditionalTrustAssumptionsProps) {
  const sentiment = getAdditionalTrustSentiment(percentage)

  return (
    <div className={additionalTrustBannerVariants({ sentiment })}>
      <p className="text-pretty text-label-value-13 text-primary leading-snug">
        <AdditionalTrustAssumptionsContent percentage={percentage}>
          of TVS with additional trust assumptions compared to the tokens
          involved and the Stage assigned to the project's canonical messaging
          bridge.
        </AdditionalTrustAssumptionsContent>
      </p>
    </div>
  )
}

function AdditionalTrustAssumptionsContent({
  percentage,
  children,
}: AdditionalTrustAssumptionsProps & {
  children: ReactNode
}) {
  const sentiment = getAdditionalTrustSentiment(percentage)

  return (
    <>
      <span className={additionalTrustPercentVariants({ sentiment })}>
        {formatPercent(percentage)}
      </span>{' '}
      {children}
    </>
  )
}

type AdditionalTrustSentiment = 'good' | 'warning' | 'bad'

function getAdditionalTrustSentiment(
  percentage: number,
): AdditionalTrustSentiment {
  if (percentage <= 0.2) {
    return 'good'
  }
  if (percentage >= 0.8) {
    return 'bad'
  }
  return 'warning'
}
