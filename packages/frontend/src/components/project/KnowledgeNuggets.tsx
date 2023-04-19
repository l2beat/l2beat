import { KnowledgeNugget } from '@l2beat/config'
import React from 'react'

import { KnowledgeNuggetItem } from './KnowledgeNuggetItem'
import { Section } from './Section'

export interface KnowledgeNuggetsProps {
  knowledgeNuggets?: KnowledgeNugget[]
}

export function KnowledgeNuggets({ knowledgeNuggets }: KnowledgeNuggetsProps) {
  if (!knowledgeNuggets) return null

  return (
    <Section title="Knowledge nuggets" id="knowledge-nuggets">
      <div className="mt-4 grid grid-cols-3 gap-4 rounded-md bg-gray-900 p-4">
        {knowledgeNuggets.map((nugget) => (
          <KnowledgeNuggetItem knowledgeNugget={nugget} key={nugget.title} />
        ))}
      </div>
    </Section>
  )
}
