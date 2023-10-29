import { Meta, StoryObj } from '@storybook/react'

import { UnverifiedContractsWarning as UnverifiedContractsWarningComponent } from './UnverifiedContractsWarning'

const meta: Meta<typeof UnverifiedContractsWarningComponent> = {
  component: UnverifiedContractsWarningComponent,
}
export default meta
type Story = StoryObj<typeof UnverifiedContractsWarningComponent>

export const UnverifiedContractsWarning: Story = {}
