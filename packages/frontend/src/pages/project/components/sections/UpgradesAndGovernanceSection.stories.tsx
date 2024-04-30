import { Meta, StoryObj } from '@storybook/react'

import { UpgradesAndGovernanceSection } from './UpgradesAndGovernanceSection'

const meta: Meta<typeof UpgradesAndGovernanceSection> = {
  component: UpgradesAndGovernanceSection,
  args: {
    id: 'upgrades-and-governance',
    title: 'Upgrades & Governance',
    sectionOrder: 1,
    content:
      '## Heading\nlink: [link](https://www.google.com)\n### Subheading\n- list item 1\n- list item 2',
  },
}
export default meta
type Story = StoryObj<typeof UpgradesAndGovernanceSection>

export const Primary: Story = {}

export const WithImage: Story = {
  args: {
    image: '/fake-upgrades-and-governance.png',
  },
}
