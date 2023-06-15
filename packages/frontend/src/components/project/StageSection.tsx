import { StageConfig } from '@l2beat/config'
import React from 'react'

import {
  ChevronDownIcon,
  MissingIcon,
  SatisfiedIcon,
  UnderReviewIcon,
} from '../icons'
import { StageBadge } from '../stages/StageBadge'
import { StageDisclaimer } from '../stages/StageDisclaimer'
import { ProjectDetailsSection } from './ProjectDetailsSection'

export interface StageSectionProps {
  title: string
  id: string
  icon: string
  name: string
  type: string
  stage?: StageConfig
}

export function StageSection(props: StageSectionProps) {
  if (props.stage === undefined) {
    return null
  }

  // TODO: implement under review section
  if (props.stage.stage === 'UnderReview') {
    return <span>Under Review 🕵️‍♀️</span>
  }
  return (
    <ProjectDetailsSection title={props.title} id={props.id} className="mt-4">
      <div className="mb-6 font-medium">
        <img
          src={props.icon}
          alt={props.name}
          className="relative -top-0.5 mr-2 inline-block h-6 w-6"
        />
        {props.name} is a <StageBadge stage={props.stage.stage} big />{' '}
        <span className="lowercase">{props.type}</span>.
      </div>
      {props.stage.summary.map((stage) => {
        const satisfied = stage.requirements.filter((r) => r.satisfied === true)
        const missing = stage.requirements.filter((r) => r.satisfied === false)
        const underReview = stage.requirements.filter(
          (r) => r.satisfied === 'UnderReview',
        )

        return (
          <div
            key={stage.stage}
            className="Dropdown mb-4 rounded-lg bg-neutral-700 "
          >
            <label className="flex cursor-pointer justify-between p-4">
              <input
                type="checkbox"
                autoComplete="off"
                className=" Dropdown-Button peer hidden"
              />
              <div>
                <StageBadge stage={stage.stage} big />
                <span className="ml-2 inline-block">
                  {missing.length === 0 ? (
                    <>
                      <SatisfiedIcon className="relative -top-0.5 inline-block" />
                      <span className="ml-2 inline-block">
                        {reqText(satisfied.length, 'met')}
                      </span>

                      {underReview.length > 0 && (
                        <>
                          <UnderReviewIcon className=" relative -top-0.5 ml-3 inline-block" />
                          <span className="ml-2 inline-block">
                            {underReview.length} under review
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <MissingIcon className="relative -top-0.5 inline-block" />
                      <span className="ml-3 inline-block">
                        {reqText(missing.length, 'missing')}
                      </span>
                    </>
                  )}
                </span>
              </div>
              <ChevronDownIcon className="transition-transform duration-300 peer-checked:-rotate-180" />
            </label>
            <ul className="Dropdown-Item pointer-events-none mx-4 hidden space-y-2 pb-6">
              {satisfied.map((req, i) => (
                <li key={i} className="flex">
                  <SatisfiedIcon className="shrink-0" />
                  <span className="ml-2 inline-block">{req.description}</span>
                </li>
              ))}
              {underReview.map((req, i) => (
                <li key={i} className="flex">
                  <UnderReviewIcon className="shrink-0" />
                  <span className="ml-2 inline-block">{req.description}</span>
                </li>
              ))}
              {missing.map((req, i) => (
                <li key={i} className="flex">
                  <MissingIcon className=" shrink-0" />
                  <span className="ml-2 inline-block">{req.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      <StageDisclaimer
        className="mt-6"
        text="Please keep in mind that these stages do not reflect rollup security, this is an opinionated assessment of rollup maturity based on subjective criteria, created with a goal of incentivizing projects to push toward better decentralization. Each team may have taken different paths to achieve this goal."
      />
    </ProjectDetailsSection>
  )
}

function reqText(amount: number, suffix: string) {
  if (amount === 1) {
    return `1 requirement ${suffix}`
  }
  return `${amount} requirements ${suffix}`
}
