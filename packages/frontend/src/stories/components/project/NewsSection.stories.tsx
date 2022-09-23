import React from 'react'

import { NewsSection as NewsSectionComponent } from '../../../components/project/NewsSection'

export default {
  title: 'Components/Project/NewsSection',
}

export function NewsSection() {
  return (
    <div className="leading-normal p-4">
      <NewsSectionComponent
        news={[
          {
            date: '2022 Jun 23',
            domain: 'twitter.com',
            href: '#',
            title: 'Voting Cycle #1 completed',
          },
          {
            date: '2022 Jun 07',
            domain: 'medium.com',
            href: '#',
            title: 'Airdrop problems explained',
          },
        ]}
      />
    </div>
  )
}
