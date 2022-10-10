import { Story } from '@storybook/react'
import React from 'react'

import {
  NewsSection as NewsSectionComponent,
  NewsSectionProps,
} from './NewsSection'

export default {
  title: 'Components/Project/NewsSection',
}

function Template(props: NewsSectionProps) {
  return (
    <div className="leading-normal p-4">
      <NewsSectionComponent {...props} />
    </div>
  )
}

export const News: Story<NewsSectionProps> = Template.bind({})
News.args = {
  news: [
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
  ],
}

export const EmptyNews: Story<NewsSectionProps> = Template.bind({})
EmptyNews.args = {
  news: [],
}
