import classNames from 'classnames'
import { chunk } from 'lodash'
import React, { ReactNode } from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { ProjectLink } from '../icons'
import { DesktopProjectLinks } from './DesktopProjectLinks'
import { MobileProjectLinks } from './MobileProjectLinks'

interface SummaryProps {
  type: 'bridge' | 'layer2'
  stats: SummaryStat[]
  links: ProjectLink[]
  isUpcoming?: boolean
}

export interface SummaryStat {
  title: string
  value: ReactNode
  className?: string
}

export function Summary(props: SummaryProps) {
  const cols = props.type === 'bridge' ? 4 : 3
  const groupedStats = chunk(props.stats, cols)

  return (
    <div className="w-full min-w-0">
      <div className="my-6 hidden md:block">
        <DesktopProjectLinks projectLinks={props.links} />
      </div>
      <div
        className={classNames(
          'row grid h-fit grow grid-cols-1 gap-3 md:gap-0 md:rounded-lg md:bg-gray-100 md:px-6 md:py-5 md:dark:bg-zinc-800',
          cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3',
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
                  />
                )
              })}
            </React.Fragment>
          )
        })}
      </div>
      <div className="md:hidden">
        <MobileProjectLinks projectLinks={props.links} />
      </div>
    </div>
  )
}

function DetailsHeaderStat(props: SummaryStat) {
  return (
    <li
      className={classNames(
        'flex items-center justify-between md:flex-col md:items-start md:justify-start md:gap-3',
        props.className,
      )}
    >
      <span className="text-xs text-gray-500 dark:text-gray-600">
        {props.title}
      </span>
      <span className="text-lg font-semibold !leading-none md:text-xl md:font-bold">
        {props.value}
      </span>
    </li>
  )
}
