import cx from 'classnames'
import React, { ReactNode } from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { ArchivedBar } from '../project/ArchivedBar'
import { UpcomingBar } from '../project/UpcomingBar'
import { BigRosette, RiskSentiments } from '../rosette'

export interface HeaderProps {
  title: string
  titleLength?: 'long' | 'very-long'
  titleClassName?: string
  icon?: string
  stats: Stat[]
  isArchived?: boolean
  isUpcoming?: boolean
  isSummary?: boolean
  risks?: RiskSentiments
}

export function DetailsHeader(props: HeaderProps) {
  return (
    <>
      <header className="md:mt-15 mt-6 px-4 md:px-0">
        <h1
          className={cx(
            'relative mb-4 flex items-center justify-start gap-3',
            'whitespace-pre text-3xl font-bold md:text-4xl',
            props.titleLength,
            props.titleClassName,
          )}
        >
          {props.icon && (
            <img
              className="h-8 w-8 md:h-10 md:w-10"
              src={props.icon}
              alt={`${props.title} logo`}
            />
          )}
          {props.title}
        </h1>
        {props.isArchived && <ArchivedBar />}
        {props.isUpcoming && <UpcomingBar />}
        {props.isSummary && props.risks ? (
          <Summary stats={props.stats} risks={props.risks} />
        ) : (
          <DetailsHeaderStats stats={props.stats} />
        )}
      </header>
      <HorizontalSeparator className="mt-2 md:mt-6" />
    </>
  )
}

interface Stat {
  title: string
  value: ReactNode
  className?: string
}

interface SummaryProps {
  stats: Stat[]
  risks: RiskSentiments
}

function Summary(props: SummaryProps) {
  const topStats = props.stats.slice(0, 4)
  const bottomStats = props.stats.slice(4)
  return (
    <div className="flex gap-8">
      <ul className="grid h-fit grow grid-cols-4">
        {topStats.map(({ title, value }) => (
          <DetailsHeaderStat key={title} title={title} value={value} />
        ))}
        <HorizontalSeparator className="col-span-4 mt-2 md:my-6" />
        {bottomStats.map(({ title, value }) => (
          <DetailsHeaderStat key={title} title={title} value={value} />
        ))}
      </ul>
      <div>
        <span className="text-xs text-gray-500 dark:text-gray-600">
          Risk analysis
        </span>
        <BigRosette risks={props.risks} />
      </div>
    </div>
  )
}

interface DetailsHeaderStatsProps {
  stats: Stat[]
}
// TODO: Remove this component when we update bridges to new stats
function DetailsHeaderStats(props: DetailsHeaderStatsProps) {
  return (
    <ul className="flex flex-col justify-between gap-2 md:flex-row">
      {props.stats.map(({ title, value }) => (
        <DetailsHeaderStat key={title} title={title} value={value} />
      ))}
    </ul>
  )
}

function DetailsHeaderStat(props: Stat) {
  return (
    <li
      className={cx(
        'flex items-center justify-between md:flex-col md:items-start md:gap-1',
        props.className,
      )}
    >
      <span className="text-xs text-gray-500 dark:text-gray-600">
        {props.title}
      </span>
      <span className="text-lg font-semibold md:text-xl md:font-bold">
        {props.value}
      </span>
    </li>
  )
}
