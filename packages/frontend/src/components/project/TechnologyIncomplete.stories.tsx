import { Meta, StoryObj } from '@storybook/react'

import { TechnologyIncomplete as TechnologyIncompleteComponent } from './TechnologyIncomplete'

const meta: Meta<typeof TechnologyIncompleteComponent> = {
  component: TechnologyIncompleteComponent,
  args: {
    editLink: '#',
    twitterLink: '#',
  },
}
export default meta
type Story = StoryObj<typeof TechnologyIncompleteComponent>

export const TechnologyIncomplete: Story = {}
