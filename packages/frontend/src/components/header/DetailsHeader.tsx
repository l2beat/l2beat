import cx from 'classnames'
import React, { ReactNode } from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'

export interface HeaderProps {
  title: string
  titleLength?: 'long' | 'very-long'
  titleClassName?: string
  icon?: string
  stats: Stat[]
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
        <DetailsHeaderStats stats={props.stats} />
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

interface DetailsHeaderStatsProps {
  stats: Stat[]
}

function DetailsHeaderStats(props: DetailsHeaderStatsProps) {
  return (
    <ul className="flex flex-col justify-between gap-2 md:flex-row">
      {props.stats.map(({ title, value }) => (
        <li
          key={title}
          className="flex items-center justify-between md:flex-col md:items-start md:gap-1"
        >
          <span className="text-xs text-gray-500 dark:text-gray-600">
            {title}
          </span>
          <span className="text-lg font-semibold md:text-xl md:font-bold">
            {value}
          </span>
        </li>
      ))}
    </ul>
  )
}
