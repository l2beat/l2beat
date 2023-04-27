import cx from 'classnames'
import React, { ReactNode } from 'react'

import { RiskValues } from '../../utils/risks/types'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { ArrowRightIcon, ChevronDownIcon, ProjectLink } from '../icons'
import { ArchivedBar } from '../project/ArchivedBar'
import { LinkSectionLink } from '../project/links/LinkSectionLink'
import { UpcomingBar } from '../project/UpcomingBar'
import { BigRosette } from '../rosette'
import { LinkSection } from './LinkSection'

export interface HeaderProps {
  title: string
  titleLength?: 'long' | 'very-long'
  titleClassName?: string
  icon?: string
  stats: Stat[]
  isArchived?: boolean
  isUpcoming?: boolean
  isSummary?: boolean
  risks?: RiskValues
  links?: ProjectLink[]
}

export function DetailsHeader(props: HeaderProps) {
  const areAllRisksUpcoming = props.risks
    ? Object.values(props.risks).every((value) => {
        return (
          value.value === '' &&
          value.description === 'No information available.'
        )
      })
    : false
  return (
    <>
      <header className="md:mt-15 mt-6 flex flex-row justify-end px-4 md:px-0">
        <div className="w-full md:mr-8">
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
          {props.isSummary && props.links ? (
            <Summary
              stats={props.stats}
              links={props.links}
              isUpcoming={props.isUpcoming}
            />
          ) : (
            <DetailsHeaderStats stats={props.stats} />
          )}
        </div>
        {props.risks && (
          <div className="ml-auto mt-auto hidden lg:block">
            <BigRosette
              risks={props.risks}
              isUpcoming={props.isUpcoming ?? areAllRisksUpcoming}
            />
            {!props.isUpcoming && (
              <a
                href="#risks"
                className="mt-3 block text-center text-sm font-bold text-link underline"
              >
                Learn more about Risks analysis{' '}
                <ArrowRightIcon className="inline-block fill-current" />
              </a>
            )}
          </div>
        )}
      </header>
      <HorizontalSeparator className="md:mt-6" />
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
  links: ProjectLink[]
  isUpcoming?: boolean
}

function Summary(props: SummaryProps) {
  const topStats = props.stats.slice(0, 3)
  const bottomStats = props.stats.slice(3)

  return (
    <div className="w-full min-w-0">
      <div className="my-6 hidden md:block">
        <LinkSection projectLinks={props.links} />
      </div>

      <div className="grid h-fit grow grid-cols-1 gap-3 md:grid-cols-3 md:gap-0 md:rounded-lg md:bg-gray-100 md:px-6 md:py-5 md:dark:bg-zinc-800">
        {topStats.map(({ title, value }) => (
          <DetailsHeaderStat key={title} title={title} value={value} />
        ))}
        <HorizontalSeparator className="col-span-4 mt-2 hidden md:my-4 md:block" />
        {bottomStats.map(({ title, value }) => (
          <DetailsHeaderStat key={title} title={title} value={value} />
        ))}
      </div>
      <div className="Dropdown md:hidden">
        <HorizontalSeparator className="-mx-4 mt-4 w-[calc(100%+2rem)]" />
        <label className="flex items-center justify-between py-4">
          <input
            type="checkbox"
            autoComplete="off"
            className="Dropdown-Button peer hidden"
          />
          <div>
            <span className="font-bold">Links:</span>
            <span className="ml-2 font-medium text-gray-600">
              Website, Docs, etc.
            </span>
          </div>
          <ChevronDownIcon className="peer-checked:rotate-180" />
        </label>
        <div className="Dropdown-Item hidden">
          <table className="w-full table-fixed border-collapse text-left text-xs">
            <tbody>
              {props.links.map(({ name, links }, i) => (
                <tr
                  className="border-t-[1px] border-gray-300 first:border-none dark:border-gray-850"
                  key={i}
                >
                  <th
                    className={cx(
                      'w-[110px] py-3 align-top font-medium text-gray-500 dark:text-gray-550',
                      i === 0 && 'pt-0',
                    )}
                  >
                    {name}
                  </th>
                  <td className={cx('py-3', i === 0 && 'pt-0')}>
                    {links.map((x, i) => (
                      <LinkSectionLink key={i} href={x} name={name} />
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    <ul className="flex flex-col justify-between gap-2">
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
