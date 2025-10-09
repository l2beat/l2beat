import { useEffect, useRef, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { ZkProgramHashRow } from '../ZkProgramHashesTable'
import { ZkProjectTooltip } from './ZkProjectTooltip'

export function ProgramHashNameCell({
  title,
  zkCatalogProject,
  description,
}: {
  title: ZkProgramHashRow['title']
  description?: ZkProgramHashRow['description']
  zkCatalogProject?: ZkProgramHashRow['zkCatalogProject']
}) {
  const titleRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current) {
        const isOverflowing =
          titleRef.current.scrollWidth > titleRef.current.clientWidth
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
            className="min-w-0 max-w-60 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-label-value-14 leading-normal"
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
