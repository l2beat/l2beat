import { KnowledgeNugget } from '@l2beat/config'
import React from 'react'

import { LinkWithThumbnail } from '../../../components/LinkWithThumbnail'
import { ProjectSectionId } from '../../../components/project/sectionId'
import { getKnowledgeNuggetThumbnail } from '../../../utils/project/getKnowledgeNuggetThumbnail'
import { Section } from './Section'

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
    <Section title={title} id={id} sectionOrder={sectionOrder}>
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
    </Section>
  )
}
