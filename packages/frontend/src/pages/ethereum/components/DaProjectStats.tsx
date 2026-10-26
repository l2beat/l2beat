import { Fragment } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  ProjectSummaryStat,
  type ProjectSummaryStatProps,
} from '~/components/projects/ProjectSummaryStat'
import { cn } from '~/utils/cn'

interface Props {
  stats: (ProjectSummaryStatProps & { key: string })[]
  className?: string
}
const GROUPS = 4

export function DaProjectStats({ stats, className }: Props) {
  const chunked = chunkArray(stats, GROUPS)

  return (
    <div className={cn('grid grid-cols-1 gap-3 md:grid-cols-4', className)}>
      {chunked.map((statGroup, i) => {
        const isLastGroup = i === chunked.length - 1

        return (
          <Fragment key={i}>
            {statGroup.map(({ key, ...stat }) => (
              <ProjectSummaryStat key={key} {...stat} />
            ))}
            {!isLastGroup && (
              <HorizontalSeparator className="col-span-full my-1 max-md:hidden" />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

function chunkArray<T>(array: T[], divider: number): T[][] {
  const chunkedArray: T[][] = []
  for (let i = 0; i < array.length; i += divider) {
    const chunk = array.slice(i, i + divider)
    chunkedArray.push(chunk)
  }
  return chunkedArray
}
