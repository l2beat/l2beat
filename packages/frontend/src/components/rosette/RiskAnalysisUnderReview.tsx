import { UnderReviewBadge } from '../badge/UnderReviewBadge'

export function RiskAnalysisUnderReview({ title }: { title: string }) {
  return (
    <div className="w-[300px] max-w-full text-wrap">
      <div className="mb-3">
        <span className="text-heading-16">{title}</span> is <UnderReviewBadge />
      </div>
      <p>
        Projects under review might present uncompleted information & data.
        <br />
        L2BEAT Team is working to research & validate content before publishing.
      </p>
    </div>
  )
}
