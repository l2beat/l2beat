import type { Stage } from '@l2beat/config'
import { getStageBadgeClassName } from '~/components/badge/StageBadge'
import { cn } from '~/utils/cn'

type HomeStage = Stage | 'UnderReview' | 'NotApplicable'

/**
 * The tables' stage badge, in its colours, at the size of the row text: a
 * smaller badge in sentence case, so the row stays calm next to its figures.
 */
export function HomeStageBadge({ stage }: { stage: HomeStage }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center whitespace-nowrap rounded-sm px-1.5 font-medium text-label-value-12',
        getStageBadgeClassName(stage),
      )}
    >
      {STAGE_LABEL[stage] ?? stage}
    </span>
  )
}

const STAGE_LABEL: Partial<Record<HomeStage, string>> = {
  UnderReview: 'In review',
  NotApplicable: 'n/a',
}
