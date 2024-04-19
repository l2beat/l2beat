import { Meta, StoryObj } from '@storybook/react'

import { UpcomingDisclaimer as UpcomingDisclaimerComponent } from './UpcomingDisclaimer'

const meta: Meta<typeof UpcomingDisclaimerComponent> = {
  component: UpcomingDisclaimerComponent,
}
export default meta
type Story = StoryObj<typeof UpcomingDisclaimerComponent>

export const UpcomingDisclaimer: Story = {}
