import { Meta, StoryObj } from '@storybook/react'

import { UpcomingBar as UpcomingBarComponent } from './UpcomingBar'

const meta: Meta<typeof UpcomingBarComponent> = {
  component: UpcomingBarComponent,
}
export default meta
type Story = StoryObj<typeof UpcomingBarComponent>

export const UpcomingBar: Story = {}
