import cx from 'classnames'
import React from 'react'

import { RiskValues } from '../../utils/risks/types'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { ArrowRightIcon, ProjectLink } from '../icons'
import { ArchivedBar } from '../project/ArchivedBar'
import { UpcomingBar } from '../project/UpcomingBar'
import { BigRosette } from '../rosette'
import { Summary, SummaryStat } from './Summary'

export interface HeaderProps {
  title: string
  titleLength?: 'long' | 'very-long'
  titleClassName?: string
  icon?: string
  stats: SummaryStat[]
  isArchived?: boolean
  isUpcoming?: boolean
  risks?: RiskValues
  links: ProjectLink[]
  type: 'bridge' | 'layer2'
}

export function DetailsHeader(props: HeaderProps) {
  const areAllRisksUpcoming = props.risks
    ? Object.values(props.risks).every((value) => {
        return (
          value.value === '' &&
          value.description === 'No information available.'
        )
      })
    : undefined

  return (
    <>
      <header className="md:mt-15 mt-6 flex flex-row justify-end px-4 md:px-0">
        <div className="w-full">
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
          <Summary
            type={props.type}
            stats={props.stats}
            links={props.links}
            isUpcoming={props.isUpcoming}
          />
        </div>
        {props.risks && (
          <div className="ml-8 mt-auto hidden lg:block">
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
