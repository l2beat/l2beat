import { Meta, StoryObj } from '@storybook/react'

import { OtherSites as OtherSitesComponent } from './OtherSites'

const meta: Meta<typeof OtherSitesComponent> = {
  component: OtherSitesComponent,
}
export default meta
type Story = StoryObj<typeof OtherSitesComponent>

export const OtherSites: Story = {}
