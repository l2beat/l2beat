import classNames from 'classnames'
import { chunk } from 'lodash'
import React, { ReactNode } from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { InfoIcon, ProjectLink } from '../icons'
import { DesktopProjectLinks } from './DesktopProjectLinks'
import { MobileProjectLinks } from './MobileProjectLinks'
import { TvlStats, TvlSummary } from './TvlSummary'

interface SummaryProps {
  type: 'bridge' | 'layer2'
  stats: FullSummaryStats
  links: ProjectLink[]
  stagesEnabled?: boolean
  detailedTvlEnabled?: boolean
  isUpcoming?: boolean
  tvlBreakdownHref?: string
  showTvlBreakdown?: boolean
}

export interface SummaryStat {
  title: string
  value: ReactNode
  tooltip?: string
  className?: string
}

export interface FullSummaryStats {
  summary: SummaryStat[]
  l2Tvl?: TvlStats
}

export function Summary(props: SummaryProps) {
  const cols =
    props.type === 'bridge' ||
    (!props.detailedTvlEnabled && props.stagesEnabled)
      ? 4
      : 3
  const groupedStats = chunk(props.stats.summary, cols)

  return (
    <>
      <div className="my-2 hidden w-full md:block">
        <DesktopProjectLinks projectLinks={props.links} />
      </div>
      <TvlSummary
        stats={props.stats.l2Tvl}
        detailedTvlEnabled={props.detailedTvlEnabled}
        tvlBreakdownHref={props.tvlBreakdownHref}
        showTvlBreakdown={props.showTvlBreakdown}
      />
      <div
        className={classNames(
          'row grid h-fit grow grid-cols-1 gap-3 px-4 md:gap-0 md:rounded-lg md:bg-gray-100 md:px-6 md:py-5 md:dark:bg-zinc-800',
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
                    tooltip={stat.tooltip}
                  />
                )
              })}
            </React.Fragment>
          )
        })}
      </div>
      <div className="w-full px-4 md:hidden md:px-0">
        <MobileProjectLinks projectLinks={props.links} />
      </div>
    </>
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
