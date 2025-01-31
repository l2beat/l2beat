import type { Meta, StoryObj } from '@storybook/react'
import { UnderReviewBar } from './under-review-bar'

const meta = {
  title: 'Components/Bars',
  component: UnderReviewBar,
  args: {
    text: 'This project is under review.',
  },
} satisfies Meta<typeof UnderReviewBar>
export default meta

type Story = StoryObj<typeof meta>

export const UnderReview: Story = {}
