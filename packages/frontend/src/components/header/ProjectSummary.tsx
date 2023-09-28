import classNames from 'classnames'
import { chunk } from 'lodash'
import React, { ReactNode } from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { InfoIcon } from '../icons'

interface Props {
  type: 'bridge' | 'layer2'
  stats: ProjectSummaryStat[]
  detailedTvlEnabled: boolean
  className?: string
}

export interface ProjectSummaryStat {
  title: string
  value: ReactNode
  tooltip?: string
  className?: string
}

export function ProjectSummary(props: Props) {
  const cols = props.type === 'bridge' || !props.detailedTvlEnabled ? 4 : 3
  const groupedStats = chunk(props.stats, cols)
  return (
    <div
      className={classNames(
        'row grid h-fit grow gap-3 px-4 md:gap-x-3 md:rounded-lg md:bg-gray-100 md:px-6 md:py-5 md:dark:bg-zinc-800',
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
                className="col-span-full mt-2 hidden md:my-4 md:block"
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
      className={classNames(
        'flex items-center justify-between md:flex-col md:items-start md:justify-start md:gap-3',
        props.className,
      )}
    >
      <div className="flex flex-row gap-1.5">
        <span className="text-xs text-gray-500 dark:text-gray-600">
          {props.title}
        </span>
        {props.tooltip && (
          <span
            className="Tooltip -translate-y-px md:translate-y-0"
            title={props.tooltip}
          >
            <InfoIcon className="mt-[2px] fill-gray-500 dark:fill-gray-600 md:h-3.5 md:w-3.5" />
          </span>
        )}
      </div>

      <span className="text-lg font-semibold !leading-none md:text-xl md:font-bold">
        {props.value}
      </span>
    </li>
  )
}
