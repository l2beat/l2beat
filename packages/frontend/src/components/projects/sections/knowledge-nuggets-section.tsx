import { type KnowledgeNugget } from '@l2beat/config'
import React from 'react'
import { getKnowledgeNuggetThumbnail } from '~/utils/project/get-knowledge-nugget-thumbnail'
import { LinkWithThumbnail } from '../../link-with-thumbnail'
import { ProjectSection } from './project-section'
import { type ProjectSectionId } from './types'

export interface KnowledgeNuggetsSectionProps {
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
}: KnowledgeNuggetsSectionProps) {
  return (
    <ProjectSection title={title} id={id} sectionOrder={sectionOrder}>
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
    </ProjectSection>
  )
}
