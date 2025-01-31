import { UnderReviewBadge } from '../../badge/under-review-badge'
import { RiskValue } from '../risk-value'
import type { PentagonRosetteCellProps } from './pentagon-rosette-cell'
import { PentagonRosetteIcon } from './pentagon-rosette-icon'
import { PentagonRosetteLabels } from './pentagon-rosette-labels'

export function PentagonRosetteTooltip({
  values,
  isUnderReview,
  hasNoBridge,
}: PentagonRosetteCellProps) {
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

  if (hasNoBridge) {
    return (
      <div className="w-[300px]">
        <div className="mb-4">
          <span className="text-base font-bold">No bridge</span>
        </div>

        <p className="text-wrap">
          Without a DA Bridge, Ethereum has no proof of data availability for
          this project.
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
          <PentagonRosetteIcon
            className="scale-75"
            values={values}
            background={false}
          />
          <PentagonRosetteLabels
            values={values}
            containerSize={200}
            textRadius={70}
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
