import React from 'react'

import { KnowledgeNuggetItem } from './KnowledgeNuggetItem'

export default {
  title: 'Components/Project/KnowledgeNuggets',
}

const knowledgeNuggetExample = {
  title: 'Arbitrum fraud proofs tested on POW ETH',
  url: 'https://www.somelink.com',
  thumbnailUrl:
    'https://w0.peakpx.com/wallpaper/551/1016/HD-wallpaper-ethereum-blue-logo-blue-brickwall-ethereum-logo-cryptocurrency-ethereum-neon-logo-cryptocurrency-signs-ethereum-thumbnail.jpg',
}

export function KnowledgeNugget() {
  return (
    <div className="p-4">
      <KnowledgeNuggetItem knowledgeNugget={knowledgeNuggetExample} />
    </div>
  )
}
