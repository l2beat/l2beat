import { Layer2RiskCategory } from '@l2beat/config'
import React from 'react'

import { Section } from './Section'

export interface RiskSectionProps {
  riskGroups: RiskGroup[]
}

export interface RiskGroup {
  start: number
  name: Layer2RiskCategory
  items: RiskItem[]
}

export interface RiskItem {
  text: string
  referencedId: string
  isCritical: boolean
}

export function RiskSection({ riskGroups }: RiskSectionProps) {
  if (riskGroups.length === 0) {
    return null
  }
  return (
    <Section title="Risk summary" id="risks" className="RiskSection">
      {riskGroups.map((group, i) => (
        <div className="RiskSection-Group" key={i}>
          <p className="RiskSection-Title">{group.name}&hellip;</p>
          <ol className="RiskSection-Risks" start={group.start}>
            {group.items.map((item, i) => (
              <li className="RiskSection-Risk" key={i}>
                <a href={`#${item.referencedId}`}>
                  {item.isCritical ? (
                    <>
                      {item.text.slice(0, -1)} <strong>(CRITICAL)</strong>
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
    </Section>
  )
}
