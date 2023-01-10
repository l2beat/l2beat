import React from 'react'

import { KnowledgeNuggets as KnowledgeNuggetsComponent } from './KnowledgeNuggets'

export default {
  title: 'Components/Project/KnowledgeNuggets',
}

const knowledgeNuggetsExample = [
  {
    title: 'Arbitrum fraud proofs tested on POW ETH',
    url: 'https://www.somelink.com',
    thumbnailUrl:
      'https://w0.peakpx.com/wallpaper/551/1016/HD-wallpaper-ethereum-blue-logo-blue-brickwall-ethereum-logo-cryptocurrency-ethereum-neon-logo-cryptocurrency-signs-ethereum-thumbnail.jpg',
  },
  {
    title: "Fuel's fraud proofs tested by L2BEAT team",
    url: 'https://www.somelink.com',
    thumbnailUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNmfsMWOpFJnj9IJ_6FHILHXGKduuZoCIpnA&usqp=CAU',
  },
  {
    title: 'Layer Zero contracts',
    url: 'https://www.somelink.com',
    thumbnailUrl:
      'https://i0.wp.com/marketbusinessnews.com/wp-content/uploads/2022/09/Ethereum-Thumbnail-403.jpg',
  },
]

export function KnowledgeNuggets() {
  return (
    <div className="p-4">
      <KnowledgeNuggetsComponent knowledgeNuggets={knowledgeNuggetsExample} />
    </div>
  )
}
