import cx from 'classnames'
import React, { ReactNode } from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { ArrowRightIcon, DropdownArrowIcon } from '../icons'
import { ArchivedBar } from '../project/ArchivedBar'
import { LinkSectionLink } from '../project/links/LinkSectionLink'
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
      <HorizontalSeparator className="mt-4 md:mt-6" />
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
  social?: boolean
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
      <div className="w-full min-w-0">
        <ul className="grid h-fit grow grid-cols-1 gap-3 md:mb-10 md:grid-cols-4 md:gap-0">
          {topStats.map(({ title, value }) => (
            <DetailsHeaderStat key={title} title={title} value={value} />
          ))}
          <HorizontalSeparator className="col-span-4 mt-2 hidden md:my-6 md:block" />
          {bottomStats.map(({ title, value }) => (
            <DetailsHeaderStat key={title} title={title} value={value} />
          ))}
        </ul>
        <div className="hidden rounded-lg bg-gray-100 px-6 py-4 dark:bg-neutral-700 md:block">
          <ul className="flex gap-4">
            {props.links.map(({ name, links, social }, i) => (
              <li className="flex min-w-0 flex-col gap-2" key={i}>
                <span className="text-xs text-gray-550">{name}</span>
                {links.map((link, i) => (
                  <span className="text-sm">
                    <LinkSectionLink key={i} href={link} social={social} />
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
        <div className="Dropdown md:hidden">
          <HorizontalSeparator className="-mx-4 my-4 w-[calc(100%+2rem)]" />
          <div className="Dropdown-Button flex items-center justify-between">
            <div>
              <span className="font-bold">Links</span>
              <span className="ml-2 font-medium text-gray-600">
                Website, Docs, etc.
              </span>
            </div>
            <DropdownArrowIcon className="Dropdown-Arrow" />
          </div>
          <div className="Dropdown-Items hidden">
            <table className="mt-1 w-full table-fixed border-collapse text-left text-xs">
              <tbody>
                {props.links.map(({ name, links, social }) => (
                  <tr className="border-t-[1px] border-gray-300 first:border-none dark:border-gray-850">
                    <th className="w-[110px] py-3 align-top font-medium text-gray-500 dark:text-gray-550">
                      {name}
                    </th>
                    <td className="py-3 last:pb-0">
                      {links.map((x, i) => (
                        <LinkSectionLink key={i} href={x} social={social} />
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <span className="text-xs text-gray-500 dark:text-gray-600">
          Risks analysis
        </span>
        <BigRosette risks={props.risks} />
        <a
          href="/scaling/risk"
          className="mt-4 block text-center text-sm font-bold text-link underline"
        >
          Learn more about Risks analysis{' '}
          <ArrowRightIcon className="inline-block fill-current" />
        </a>
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
