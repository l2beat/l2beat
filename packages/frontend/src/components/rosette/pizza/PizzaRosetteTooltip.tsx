import { UnderReviewBadge } from '../../badge/UnderReviewBadge'
import { RiskValue } from '../RiskValue'
import type { RosetteValue } from '../types'
import { PizzaRosetteIcon } from './PizzaRosetteIcon'
import { PizzaRosetteLabels } from './PizzaRosetteLabels'

export function PizzaRosetteTooltip({
  values,
  isUnderReview,
}: {
  values: RosetteValue[]
  isUnderReview?: boolean
}) {
  if (isUnderReview) {
    return (
      <div className="w-[300px]">
        <div className="mb-3">
          <span className="text-heading-16">Risk analysis</span> is{' '}
          <UnderReviewBadge />
        </div>

        <p className="text-wrap">
          Projects under review might present uncompleted information & data.
          <br />
          L2BEAT Team is working to research & validate content before
          publishing.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <span className="mb-2 text-heading-16">Risk analysis</span>
      <div className="flex items-center gap-6">
        <div className="relative flex size-[200px] items-center justify-center">
          <PizzaRosetteIcon
            values={values}
            className="scale-75"
            isUnderReview={isUnderReview}
            background="surface"
          />
          <PizzaRosetteLabels
            values={values}
            containerSize={200}
            textRadius={76}
            size="small"
          />
        </div>
        <div className="flex flex-col gap-3">
          {values.map((value) => (
            <RiskValue key={value.name} {...value} />
          ))}
        </div>
      </div>
    </div>
  )
}
