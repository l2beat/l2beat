import cx from 'classnames'
import React, { ReactNode } from 'react'

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
      <header className="mt-6 md:mt-15 px-4 md:px-0">
        <h1
          className={cx(
            'relative flex items-center justify-start gap-3 mb-4',
            'font-bold text-3xl md:text-4xl whitespace-pre',
            props.titleLength,
            props.titleClassName,
          )}
        >
          {props.icon && (
            <img
              className="w-8 h-8 md:w-10 md:h-10"
              src={props.icon}
              alt={`${props.title} logo`}
            />
          )}
          {props.title}
        </h1>
        <DetailsHeaderStats stats={props.stats} />
      </header>
      <hr className="mt-2 md:mt-6 md:border-t-2 border-gray-300 dark:border-gray-850" />
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
    <ul className="flex flex-col md:flex-row justify-between gap-2">
      {props.stats.map(({ title, value }) => (
        <li
          key={title}
          className="flex md:flex-col items-center md:items-start md:gap-1 justify-between"
        >
          <span className="text-gray-500 dark:text-gray-600 text-xs">
            {title}
          </span>
          <span className="text-lg md:text-xl font-semibold md:font-bold">
            {value}
          </span>
        </li>
      ))}
    </ul>
  )
}
