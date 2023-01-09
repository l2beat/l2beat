import React from 'react'

import {
  KnowledgeNuggets as KnowledgeNuggetsComponent,
  KnowledgeNuggetsProps,
} from './KnowledgeNuggets'

export default {
  title: 'Components/Project/KnowledgeNuggets',
}

const knowledgeNuggetsExample = [
  {
    title: 'Arbitrum fraud proofs tested on POW ETH',
    url: 'https://www.wp.pl',
    thumbnailUrl:
      'https://img.freepik.com/free-vector/cryptocurrency-bitcoin-golden-coin-with-digital-circuit-lines-background_1017-33592.jpg?w=2000',
  },
  {
    title: "Fuel's fraud proofs tested by L2BEAT team",
    url: 'https://www.wp.pl',
    thumbnailUrl:
      'https://velog.velcdn.com/images/dhlee91/post/f2418376-eacc-40cb-b7c8-73473580da3e/html_.png',
  },
  {
    title: 'Layer Zero contracts',
    url: 'https://www.wp.pl',
    thumbnailUrl:
      'https://edyoda.s3.amazonaws.com/media/video-thumbnail/qaifi-html-episode-28-html-form-nput-attributes.png',
  },
]

export function KnowledgeNuggets(props: KnowledgeNuggetsProps) {
  return (
    <div className="p-4">
      <KnowledgeNuggetsComponent {...props} />
    </div>
  )
}

KnowledgeNuggets.args = {
  knowledgeNuggets: knowledgeNuggetsExample,
}
