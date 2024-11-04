import { UnderReviewBadge } from '../../badge/under-review-badge'
import { type GrissiniCellProps } from './grissini-cell'
import { GrissiniDetails } from './grissini-details'

export function GrissiniTooltip({ values, isUnderReview }: GrissiniCellProps) {
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
    <div className="flex flex-col gap-4">
      <span className="text-base font-bold">
        <span className="mr-2">Risk analysis</span>
      </span>

      <div className="flex flex-col gap-4">
        <GrissiniDetails values={values} className="w-auto min-w-[264px]" />
      </div>
    </div>
  )
}
