import { useEffect, useRef, useState } from 'react'
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
}: {
  title: ProgramHashRow['title']
  description?: ProgramHashRow['description']
  zkCatalogProject?: ProgramHashRow['zkCatalogProject']
}) {
  const titleRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current) {
        const isOverflowing =
          titleRef.current.scrollHeight > titleRef.current.clientHeight
        setIsOverflowing(isOverflowing)
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)

    return () => window.removeEventListener('resize', checkOverflow)
  }, [])

  return (
    <div className="flex items-start gap-1 py-2">
      <Tooltip>
        <TooltipTrigger
          disabled={!isOverflowing && !description}
          className="text-left"
        >
          <div
            ref={titleRef}
            className="line-clamp-5 w-44 shrink-0 text-pretty font-bold text-label-value-14 leading-normal [overflow-wrap:anywhere] md:line-clamp-4 md:w-60 2xl:w-72"
          >
            {withIdentifierBreaks(title)}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-bold text-heading-18">{title}</p>
          {description && (
            <p className="mt-2 font-medium text-paragraph-13">{description}</p>
          )}
        </TooltipContent>
      </Tooltip>
      {zkCatalogProject && <ZkProjectTooltip zkProject={zkCatalogProject} />}
    </div>
  )
}
