import { TooltipVisualOnly } from '../../core/tooltip/Tooltip'
import { RiskAnalysisUnderReview } from '../RiskAnalysisUnderReview'
import { RiskValue } from '../RiskValue'
import type { RosetteValue } from '../types'
import { PizzaRosetteWithLabels } from './PizzaRosetteWithLabels'

export function PizzaRosetteTooltip({
  values,
  isUnderReview,
  title = 'Risk analysis',
}: {
  values: RosetteValue[]
  isUnderReview?: boolean
  title?: string
}) {
  if (isUnderReview) {
    return <RiskAnalysisUnderReview title={title} />
  }

  return (
    <div className="flex flex-col">
      <span className="mb-2 text-heading-16">{title}</span>
      <div className="flex items-center gap-6">
        <TooltipVisualOnly>
          <PizzaRosetteWithLabels values={values} />
        </TooltipVisualOnly>
        <div className="flex flex-col gap-3">
          {values.map((value) => (
            <RiskValue key={value.name} {...value} />
          ))}
        </div>
      </div>
    </div>
  )
}
