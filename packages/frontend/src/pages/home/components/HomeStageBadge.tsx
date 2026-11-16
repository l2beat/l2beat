import type { Stage } from '@l2beat/config'
import { getStageBadgeClassName } from '~/components/badge/StageBadge'
import { TableLink } from '~/components/table/TableLink'
import { cn } from '~/utils/cn'
import { HOME_CELL_LINK_CLASS } from '../homeStyles'

type HomeStage = Stage | 'UnderReview' | 'NotApplicable'

/**
 * The tables' stage badge, in its colours, at the size of the row text: a
 * smaller badge in sentence case, so the row stays calm next to its figures.
 * It links to the stage section of the project page.
 */
export function HomeStageBadge({
  stage,
  projectHref,
}: {
  stage: HomeStage
  projectHref: string
}) {
  return (
    <TableLink href={`${projectHref}#stage`} className={HOME_CELL_LINK_CLASS}>
      <span
        className={cn(
          'inline-flex h-5 items-center whitespace-nowrap rounded-sm px-1.5 font-medium text-label-value-13',
          getStageBadgeClassName(stage),
        )}
      >
        {STAGE_LABEL[stage] ?? stage}
      </span>
    </TableLink>
  )
}

const STAGE_LABEL: Partial<Record<HomeStage, string>> = {
  UnderReview: 'In review',
  NotApplicable: 'n/a',
}
