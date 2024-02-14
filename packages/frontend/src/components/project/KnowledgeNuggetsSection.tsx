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
    <ProjectDetailsSection title={title} id={id} sectionOrder={sectionOrder}>
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
