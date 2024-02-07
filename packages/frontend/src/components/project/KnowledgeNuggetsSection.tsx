import { KnowledgeNugget } from '@l2beat/config'
import React from 'react'

import { getKnowledgeNuggetThumbnail } from '../../utils/project/getKnowledgeNuggetThumbnail'
import { LinkWithThumbnail } from '../LinkWithThumbnail'
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
    <ProjectDetailsSection
      title={title}
      id={id}
      sectionOrder={sectionOrder}
      className="-m-4 mt-10 bg-gray-100 p-4 dark:bg-neutral-700 md:m-0 md:mt-10 md:bg-gray-100 md:p-8 md:dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-4">
        {knowledgeNuggets.map((nugget) => (
          <LinkWithThumbnail
            src={getKnowledgeNuggetThumbnail(nugget)}
            href={nugget.url}
            title={nugget.title}
            key={nugget.title}
          />
        ))}
      </div>
    </ProjectDetailsSection>
  )
}
