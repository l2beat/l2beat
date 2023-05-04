import React from 'react'

import { KnowledgeNuggetsSection as KnowledgeNuggetsComponent } from './KnowledgeNuggetsSection'

export default {
  title: 'Components/Project/KnowledgeNuggetsSection',
}

const knowledgeNuggetsExample = [
  {
    title: 'Arbitrum fraud proofs tested on POW ETH',
    url: 'https://www.somelink.com',
    thumbnail: 'arbitrum-01.jpg',
  },
  {
    title: "Fuel's fraud proofs tested by L2BEAT team",
    url: 'https://www.somelink.com',
    thumbnail: 'fuel-01.jpg',
  },
]

export function KnowledgeNuggets() {
  return (
    <div className="p-4">
      <KnowledgeNuggetsComponent
        title="Knowledge nuggets"
        id="knowledge-nuggets"
        knowledgeNuggets={knowledgeNuggetsExample}
      />
    </div>
  )
}
