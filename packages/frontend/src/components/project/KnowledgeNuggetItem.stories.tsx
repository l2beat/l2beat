import React from 'react'

import {
  KnowledgeNuggetItem,
  KnowledgeNuggetProps,
} from './KnowledgeNuggetItem'

export default {
  title: 'Components/Project/KnowledgeNugget',
}

const knowledgeNuggetExample = {
  title: 'Arbitrum fraud proofs tested on POW ETH',
  url: 'https://www.somelink.com',
  thumbnailUrl:
    'https://w0.peakpx.com/wallpaper/551/1016/HD-wallpaper-ethereum-blue-logo-blue-brickwall-ethereum-logo-cryptocurrency-ethereum-neon-logo-cryptocurrency-signs-ethereum-thumbnail.jpg',
}

export function KnowledgeNugget(props: KnowledgeNuggetProps) {
  return (
    <div className="p-4">
      <KnowledgeNuggetItem {...props} />
    </div>
  )
}

KnowledgeNugget.args = {
  knowledgeNugget: knowledgeNuggetExample,
}
