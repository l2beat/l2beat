import { UnderReviewBadge } from '../../badge/under-review-badge'
import { RiskValue } from '../risk-value'
import type { PizzaRosetteCellProps } from './pizza-rosette-cell'
import { PizzaRosetteIcon } from './pizza-rosette-icon'
import { PizzaRosetteLabels } from './pizza-rosette-labels'

export function PizzaRosetteTooltip({
  values,
  isUnderReview,
}: PizzaRosetteCellProps) {
  if (isUnderReview) {
    return (
      <div className="w-[300px]">
        <div className="mb-4">
          <span className="text-base font-bold">Risk analysis</span> is{' '}
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
      <span className="text-base font-bold">
        <span className="mr-2">Risk analysis</span>
      </span>
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
        <div className="flex flex-col gap-4">
          {values.map((value) => (
            <RiskValue key={value.name} {...value} />
          ))}
        </div>
      </div>
    </div>
  )
}
