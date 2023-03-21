import React from 'react'

import { KnowledgeNuggets as KnowledgeNuggetsComponent } from './KnowledgeNuggets'

export default {
  title: 'Components/Project/KnowledgeNuggets',
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
      <KnowledgeNuggetsComponent knowledgeNuggets={knowledgeNuggetsExample} />
    </div>
  )
}
