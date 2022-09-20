import React from 'react'

import { Heading } from '../../../components'
import { ReferencesList, TechnologyReference } from './ReferenceList'
import { RiskList, TechnologyRisk } from './RiskList'
import { Section } from './Section'

export interface TechnologySectionProps {
  id: string
  title: string
  items: TechnologyChoice[]
}

export interface TechnologyChoice {
  id: string
  name: string
  description: string
  isIncomplete: boolean
  risks: TechnologyRisk[]
  references: TechnologyReference[]
}

export function TechnologySection({
  id,
  title,
  items,
}: TechnologySectionProps) {
  return (
    <Section title={title} id={id} className="TechnologySection">
      {items.map((item, i) => (
        <div className="TechnologySection-Item" key={i}>
          <Heading level={3} id={item.id} title={item.name} />
          {item.isIncomplete && (
            <div className="TechnologySection-Incomplete">
              <strong>Note:</strong> This section requires more research and
              might not present accurate information.
            </div>
          )}
          <p>{item.description}</p>
          <RiskList risks={item.risks} />
          <ReferencesList references={item.references} />
        </div>
      ))}
    </Section>
  )
}
