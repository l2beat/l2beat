import cx from 'classnames'
import React from 'react'

import { RiskValues } from '../../utils/risks/types'
import { HorizontalSeparator } from '../HorizontalSeparator'
import { ProjectLink } from '../icons'
import { Link } from '../Link'
import { ArchivedBar } from '../project/ArchivedBar'
import { UnderReviewBar } from '../project/UnderReviewBar'
import { UpcomingBar } from '../project/UpcomingBar'
import { WarningBar } from '../project/WarningBar'
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
  isUnderReview?: boolean
  showProjectUnderReview?: boolean
  risks?: RiskValues
  links: ProjectLink[]
  type: 'bridge' | 'layer2'
  stagesEnabled?: boolean
  warning?: string | { text: string; href: string }
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
          {props.showProjectUnderReview && <UnderReviewBar />}
          {props.warning && (
            <WarningBar
              text={
                typeof props.warning === 'string'
                  ? props.warning
                  : props.warning.text
              }
              href={
                typeof props.warning !== 'string'
                  ? props.warning.href
                  : undefined
              }
              color="yellow"
              isCritical={false}
              className="mb-4 items-center justify-center py-2.5 px-2.5 text-xs md:px-4 md:text-base"
            />
          )}
          <Summary
            type={props.type}
            stats={props.stats}
            links={props.links}
            isUpcoming={props.isUpcoming}
            stagesEnabled={props.stagesEnabled}
          />
        </div>
        {props.risks && (
          <div className="ml-8 mt-auto hidden lg:block">
            <BigRosette
              risks={props.risks}
              isUpcoming={props.isUpcoming ?? areAllRisksUpcoming}
              isUnderReview={props.isUnderReview}
            />
            {!props.isUpcoming && !props.isUnderReview && (
              <Link
                href="#risk-analysis"
                className="mt-3 block text-center text-sm"
                showArrow
              >
                Learn more about Risks analysis
              </Link>
            )}
          </div>
        )}
      </header>
      <HorizontalSeparator className="md:mt-6" />
    </>
  )
}
