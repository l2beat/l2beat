import type { Stage } from '@l2beat/config'
import { SmallStageBadge } from '~/components/badge/StageBadge'
import { TableLink } from '~/components/table/TableLink'
import { HOME_CELL_LINK_CLASS } from '../homeStyles'

/**
 * The tables' stage badge, in its colours, at the size of the row text, so
 * the row stays calm next to its figures. It links to the stage section of
 * the project page.
 */
export function HomeStageBadge({
  stage,
  projectHref,
}: {
  stage: Stage | 'UnderReview' | 'NotApplicable'
  projectHref: string
}) {
  return (
    <TableLink href={`${projectHref}#stage`} className={HOME_CELL_LINK_CLASS}>
      <SmallStageBadge stage={stage} />
    </TableLink>
  )
}
