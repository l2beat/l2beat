import React from 'react'

import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ReferenceList, TechnologyReference } from './ReferenceList'
import { RiskList, TechnologyRisk } from './RiskList'
import { TechnologyIncompleteShort } from './TechnologyIncomplete'

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
    <ProjectDetailsSection title={title} id={id}>
      {items.map((item, i) => (
        <div className="mt-4 md:mt-6" key={i}>
          <h3 id={item.id} className="text-xl font-bold">
            <a href={`#${item.id}`}>{item.name}</a>
          </h3>
          {item.isIncomplete && <TechnologyIncompleteShort />}
          <p className="mt-2 text-gray-850 dark:text-gray-400">
            {item.description}
          </p>
          <RiskList risks={item.risks} />
          <ReferenceList references={item.references} />
        </div>
      ))}
    </ProjectDetailsSection>
  )
}
