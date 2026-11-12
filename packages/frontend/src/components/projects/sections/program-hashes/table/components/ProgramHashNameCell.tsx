import { useEffect, useRef, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
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
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger disabled={!isOverflowing && !description}>
          <div
            ref={titleRef}
            className="line-clamp-2 min-w-0 max-w-72 text-pretty font-bold text-label-value-14 leading-normal"
          >
            {title}
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
