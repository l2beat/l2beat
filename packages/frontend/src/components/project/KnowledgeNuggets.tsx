import { KnowledgeNugget } from '@l2beat/config'
import React from 'react'

import { KnowledgeNuggetItem } from './KnowledgeNuggetItem'

export interface KnowledgeNuggetsProps {
  knowledgeNuggets?: KnowledgeNugget[]
}

export function KnowledgeNuggets({ knowledgeNuggets }: KnowledgeNuggetsProps) {
  if (!knowledgeNuggets) return null

  return (
    <div className="px-4 md:px-0">
      <span className="text-[28px] leading-[32.81px] font-bold">
        Knowledge nuggets
      </span>
      <div className="flex flex-col gap-3 p-4 mt-4">
        {knowledgeNuggets.map((nugget) => (
          <KnowledgeNuggetItem knowledgeNugget={nugget} key={nugget.title} />
        ))}
      </div>
    </div>
  )
}
