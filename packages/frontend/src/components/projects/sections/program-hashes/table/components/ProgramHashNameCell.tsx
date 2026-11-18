import { useCallback, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { withIdentifierBreaks } from '../../../identifierBreaks'
import type { ProgramHashRow } from '../ProgramHashesTable'
import { ZkProjectTooltip } from './ZkProjectTooltip'

export function ProgramHashNameCell({
  title,
  zkCatalogProject,
  description,
  reserveIcon,
}: {
  title: ProgramHashRow['title']
  description?: ProgramHashRow['description']
  zkCatalogProject?: ProgramHashRow['zkCatalogProject']
  /** Another row has an icon: keep its slot so every name starts at one x. */
  reserveIcon?: boolean
}) {
  const [isOverflowing, setIsOverflowing] = useState(false)

  // Only the clamp, which changes with the title's own box, can make it
  // overflow. The observer reads it after layout, so no row forces one. A
  // ref callback, because turning the tooltip on remounts the title.
  const observeTitle = useCallback((titleElement: HTMLDivElement | null) => {
    if (!titleElement) return
    const observer = new ResizeObserver(() => {
      setIsOverflowing(titleElement.scrollHeight > titleElement.clientHeight)
    })
    observer.observe(titleElement)
    return () => observer.disconnect()
  }, [])

  return (
    // The project icon leads, so every row's icon and name sit at one x.
    <div className="flex items-center gap-2 py-2">
      {zkCatalogProject ? (
        <ZkProjectTooltip zkProject={zkCatalogProject} />
      ) : (
        reserveIcon && <span aria-hidden className="size-5 shrink-0" />
      )}
      <Tooltip>
        <TooltipTrigger
          disabled={!isOverflowing && !description}
          className="text-left"
        >
          <div
            ref={observeTitle}
            className="line-clamp-6 w-max max-w-44 text-pretty break-words font-bold text-label-value-14 leading-normal md:line-clamp-4 md:max-w-60 2xl:max-w-72"
          >
            {withIdentifierBreaks(title, { atCapitals: false })}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-heading-16">{title}</p>
          {description && <p className="mt-2">{description}</p>}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
