import { Meta, StoryObj } from '@storybook/react'

import { ArchivedBar as ArchivedBarComponent } from './ArchivedBar'

const meta: Meta<typeof ArchivedBarComponent> = {
  component: ArchivedBarComponent,
}
export default meta
type Story = StoryObj<typeof ArchivedBarComponent>

export const ArchivedBar: Story = {}
