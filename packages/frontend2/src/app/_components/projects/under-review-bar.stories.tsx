import { type Meta, type StoryObj } from '@storybook/react'
import { UnderReviewBar } from './under-review-bar'

const meta = {
  title: 'UI/Misc/Bars/Under Review',
  component: UnderReviewBar,
  args: {
    text: 'This project is under review.',
  },
} satisfies Meta<typeof UnderReviewBar>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
