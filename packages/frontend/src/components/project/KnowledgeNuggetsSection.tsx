import { KnowledgeNugget } from '@l2beat/config'
import React from 'react'

import { KnowledgeNuggetItem } from './KnowledgeNuggetItem'
import { ProjectDetailsSection } from './ProjectDetailsSection'

export interface KnowledgeNuggetsProps {
  title: string
  id: string
  knowledgeNuggets: KnowledgeNugget[]
}

export function KnowledgeNuggetsSection({
  title,
  id,
  knowledgeNuggets,
}: KnowledgeNuggetsProps) {
  return (
    <ProjectDetailsSection title={title} id={id}>
      <div className="mt-4 flex flex-col gap-3 p-4">
        {knowledgeNuggets.map((nugget) => (
          <KnowledgeNuggetItem knowledgeNugget={nugget} key={nugget.title} />
        ))}
      </div>
    </ProjectDetailsSection>
  )
}
