import { ProjectRiskCategory } from '@l2beat/config'
import React from 'react'

import { ShieldIcon } from '../icons'
import { UnverifiedIcon } from '../icons/symbols/UnverifiedIcon'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ProjectSectionId } from './sectionId'
import { WarningBar } from './WarningBar'

export interface RiskSectionProps {
  title: string
  id: ProjectSectionId
  riskGroups: RiskGroup[]
  warning: string | undefined
  isVerified: boolean | undefined
  redWarning: string | undefined
}

export interface RiskGroup {
  start: number
  name: ProjectRiskCategory
  items: RiskItem[]
}

export interface RiskItem {
  text: string
  referencedId: string
  isCritical: boolean
}

export function RiskSection({
  title,
  id,
  riskGroups,
  isVerified,
  redWarning,
  warning,
}: RiskSectionProps) {
  if (riskGroups.length === 0) {
    return null
  }
  return (
    <ProjectDetailsSection title={title} id={id} className="mt-4">
      {isVerified === false && (
        <WarningBar
          text="This project includes unverified contracts."
          color="red"
          isCritical={true}
          className="mt-4"
          icon={UnverifiedIcon}
        />
      )}
      {redWarning && (
        <WarningBar
          text={redWarning}
          color="red"
          className="mt-4"
          icon={ShieldIcon}
        />
      )}
      {warning && (
        <WarningBar
          text={warning}
          color="yellow"
          isCritical={false}
          className="mt-4"
        />
      )}
      {riskGroups.map((group, i) => (
        <div className="mt-4 md:mt-6" key={i}>
          <h3 className="font-bold text-red-300 md:text-lg">{group.name}</h3>
          <ol
            className="list-inside list-decimal p-1.5 text-gray-850 dark:text-gray-400"
            start={group.start}
          >
            {group.items.map((item, i) => (
              <li key={i}>
                <a href={`#${item.referencedId}`} className="underline">
                  {item.isCritical ? (
                    <>
                      {item.text.slice(0, -1)}{' '}
                      <span className="text-red-300 underline">
                        {' '}
                        (CRITICAL)
                      </span>
                      {item.text.slice(-1)}
                    </>
                  ) : (
                    item.text
                  )}
                </a>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </ProjectDetailsSection>
  )
}
