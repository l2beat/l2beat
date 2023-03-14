import cx from 'classnames'
import React, { ReactNode } from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { OutLink } from '../OutLink'
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
  links?: Link[]
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
        {props.isSummary && props.risks && props.links ? (
          <Summary
            stats={props.stats}
            risks={props.risks}
            links={props.links}
          />
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

export interface Link {
  name: string
  links: string[]
}

interface SummaryProps {
  stats: Stat[]
  risks: RiskSentiments
  links: Link[]
}

function Summary(props: SummaryProps) {
  const topStats = props.stats.slice(0, 4)
  const bottomStats = props.stats.slice(4)
  return (
    <div className="flex w-full gap-2">
      <div className="min-w-0">
        <ul className="mb-10 grid h-fit grow grid-cols-4">
          {topStats.map(({ title, value }) => (
            <DetailsHeaderStat key={title} title={title} value={value} />
          ))}
          <HorizontalSeparator className="col-span-4 mt-2 md:my-6" />
          {bottomStats.map(({ title, value }) => (
            <DetailsHeaderStat key={title} title={title} value={value} />
          ))}
        </ul>
        <div className="rounded-lg bg-gray-100 px-6 py-4 dark:bg-neutral-700">
          <ul className="flex gap-4">
            {props.links.map(({ name, links }, i) => (
              <li className="flex min-w-0 flex-col gap-2">
                <span key={i} className="text-xs text-gray-550">
                  {name}
                </span>
                {links.map((link, i) => (
                  <OutLink
                    key={i}
                    href={link}
                    className="truncate text-link underline"
                  >
                    {link.slice(8)}
                  </OutLink>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>

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
        'flex items-center md:flex-col md:items-start md:gap-3',
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
