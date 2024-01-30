import chunk from 'lodash/chunk'
import React, { ReactNode } from 'react'

import { cn } from '../../utils/cn'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { InfoIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

interface Props {
  type: 'bridge' | 'layer2' | 'layer3'
  stats: ProjectSummaryStat[]
  className?: string
}

export interface ProjectSummaryStat {
  title: string
  value: ReactNode
  tooltip?: string
  className?: string
}

export function ProjectSummary(props: Props) {
  let cols
  switch (props.type) {
    case 'layer2':
    case 'layer3':
      cols = 3
      break
    case 'bridge':
      cols = 4
      break
  }
  const groupedStats = chunk(props.stats, cols)
  return (
    <div
      className={cn(
        'grid h-fit grow gap-3 bg-gray-100 p-4 dark:bg-zinc-900 md:gap-x-3 md:rounded-lg md:px-6 md:py-5',
        cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3',
        props.className,
      )}
    >
      {groupedStats.map((group, groupIndex) => {
        return (
          <React.Fragment key={`summary-group${groupIndex}`}>
            {groupIndex !== 0 && (
              <HorizontalSeparator
                key={`horizontal-separator${groupIndex}`}
                className="col-span-full mt-2 hidden md:my-0 md:block"
              />
            )}
            {group.map((stat) => {
              return (
                <DetailsHeaderStat
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  tooltip={stat.tooltip}
                />
              )
            })}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function DetailsHeaderStat(props: ProjectSummaryStat) {
  return (
    <li
      className={cn(
        'flex items-center justify-between md:flex-col md:items-start md:justify-start md:gap-3',
        props.className,
      )}
    >
      <div className="flex flex-row gap-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-600">
          {props.title}
        </span>
        {props.tooltip && (
          <Tooltip>
            <TooltipTrigger className="-translate-y-px md:translate-y-0">
              <InfoIcon className="mt-[2px] fill-gray-500 dark:fill-gray-600 md:size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{props.tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <span className="text-lg font-semibold !leading-none md:text-xl md:font-bold">
        {props.value}
      </span>
    </li>
  )
}
