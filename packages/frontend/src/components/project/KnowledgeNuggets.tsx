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
      <span className="text-[28px] font-bold leading-[32.81px]">
        Knowledge nuggets
      </span>
      <div className="mt-4 flex flex-col gap-3 p-4">
        {knowledgeNuggets.map((nugget) => (
          <KnowledgeNuggetItem knowledgeNugget={nugget} key={nugget.title} />
        ))}
      </div>
    </div>
  )
}
