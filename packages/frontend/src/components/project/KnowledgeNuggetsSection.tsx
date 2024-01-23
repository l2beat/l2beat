import { KnowledgeNugget } from '@l2beat/config'
import React from 'react'

import { KnowledgeNuggetItem } from './KnowledgeNuggetItem'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ProjectSectionId } from './sectionId'

export interface KnowledgeNuggetsProps {
  title: string
  id: ProjectSectionId
  sectionOrder: number
  knowledgeNuggets: KnowledgeNugget[]
}

export function KnowledgeNuggetsSection({
  title,
  id,
  sectionOrder,
  knowledgeNuggets,
}: KnowledgeNuggetsProps) {
  return (
    <ProjectDetailsSection title={title} id={id} sectionOrder={sectionOrder}>
      <div className="flex flex-col gap-4">
        {knowledgeNuggets.map((nugget) => (
          <KnowledgeNuggetItem knowledgeNugget={nugget} key={nugget.title} />
        ))}
      </div>
    </ProjectDetailsSection>
  )
}
