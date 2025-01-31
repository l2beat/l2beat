import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SentimentText } from './sentiment-text'

const meta = {
  title: 'Components/Sentiment Text',
} satisfies Meta<typeof SentimentText>

export default meta
type Story = StoryObj<typeof SentimentText>

export const All: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <SentimentText sentiment="good">Good</SentimentText>
      <SentimentText sentiment="bad">Bad</SentimentText>
      <SentimentText sentiment="warning">Warning</SentimentText>
      <SentimentText sentiment="neutral">Neutral</SentimentText>
      <SentimentText sentiment="UnderReview">Under Review</SentimentText>
    </div>
  ),
}
