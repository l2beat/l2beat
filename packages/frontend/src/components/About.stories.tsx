import { Meta, StoryObj } from '@storybook/react'

import { About as AboutComponent } from './About'

const meta: Meta<typeof AboutComponent> = {
  component: AboutComponent,
}
export default meta
type Story = StoryObj<typeof AboutComponent>

export const About: Story = {}
