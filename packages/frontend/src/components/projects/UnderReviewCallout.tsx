import { UnderReviewIcon } from '~/icons/UnderReview'
import { cn } from '~/utils/cn'
import { UNDER_REVIEW_DESCRIPTION } from './sections/sectionCopy'

interface Props {
  withoutDescription?: boolean
  className?: string
}

export function UnderReviewCallout({ withoutDescription, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col rounded bg-warning/20',
        withoutDescription ? 'gap-2 p-2' : 'items-center gap-4 p-8',
        className,
      )}
    >
      <div className="flex items-center">
        <UnderReviewIcon
          className={cn(
            'relative inline-block',
            withoutDescription ? 'size-4' : 'size-6',
          )}
        />
        <span
          className={cn(
            'ml-2 inline-block font-medium',
            withoutDescription && 'text-label-value-14',
          )}
        >
          Under Review
        </span>
      </div>
      {!withoutDescription && (
        <p className="text-balance text-center text-sm">
          {UNDER_REVIEW_DESCRIPTION[0]}
          <br />
          {UNDER_REVIEW_DESCRIPTION[1]}
        </p>
      )}
    </div>
  )
}
