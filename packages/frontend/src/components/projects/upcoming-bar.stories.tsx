import type { Meta, StoryObj } from '@storybook/react'
import { UpcomingBar } from './upcoming-bar'

const meta = {
  title: 'Components/Bars',
  component: UpcomingBar,
} satisfies Meta<typeof UpcomingBar>
export default meta

type Story = StoryObj<typeof meta>

export const Upcoming: Story = {}
