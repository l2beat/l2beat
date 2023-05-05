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
    <ProjectDetailsSection
      title={title}
      id={id}
      className="-m-4 bg-gray-100 p-4 dark:bg-neutral-700 md:m-0 md:bg-white md:bg-transparent md:p-0 md:dark:bg-transparent"
    >
      <div className="flex flex-col gap-3 rounded-lg md:m-0 md:bg-gray-100 md:p-6 md:dark:bg-neutral-700">
        {knowledgeNuggets.map((nugget) => (
          <KnowledgeNuggetItem knowledgeNugget={nugget} key={nugget.title} />
        ))}
      </div>
    </ProjectDetailsSection>
  )
}
