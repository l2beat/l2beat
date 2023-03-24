import React from 'react'

import { KnowledgeNuggetItem } from './KnowledgeNuggetItem'

export default {
  title: 'Components/Project/KnowledgeNuggets',
}

const knowledgeNuggetExample = {
  title: 'Arbitrum fraud proofs tested on POW ETH',
  url: 'https://www.somelink.com',
  thumbnail: 'arbitrum-01.jpg',
}

export function KnowledgeNugget() {
  return (
    <div className="p-4">
      <KnowledgeNuggetItem knowledgeNugget={knowledgeNuggetExample} />
    </div>
  )
}
