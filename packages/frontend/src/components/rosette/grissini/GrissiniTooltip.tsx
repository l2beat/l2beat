import { UnderReviewBadge } from '../../badge/UnderReviewBadge'
import type { GrissiniCellProps } from './GrissiniCell'
import { GrissiniDetails } from './GrissiniDetails'

export function GrissiniTooltip({ values, isUnderReview }: GrissiniCellProps) {
  const hasNoBridge = values.length === 0
  if (isUnderReview) {
    return (
      <div className="w-[300px]">
        <div className="mb-4">
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

  if (hasNoBridge) {
    return (
      <div className="w-[300px]">
        <span className="text-heading-16">
          <span className="mr-2">Risk analysis</span>
        </span>

        <p className="text-wrap">
          Without a DA Bridge, Ethereum has no proof of data availability for
          this project.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <span className="text-heading-16">
        <span className="mr-2">Risk analysis</span>
      </span>

      <GrissiniDetails
        values={values}
        className="w-auto min-w-[264px]"
        info="compact"
      />
    </div>
  )
}
