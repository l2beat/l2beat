import { Meta, StoryObj } from '@storybook/react'

import { UpgradesAndGovernanceSection } from './UpgradesAndGovernanceSection'

const meta: Meta<typeof UpgradesAndGovernanceSection> = {
  component: UpgradesAndGovernanceSection,
}
export default meta
type Story = StoryObj<typeof UpgradesAndGovernanceSection>

export const Primary: Story = {
  args: {
    id: 'upgrades-and-governance',
    title: 'Upgrades & Governance',
    sectionOrder: 1,
    content:
      '## Heading\nlink: [link](https://www.google.com)\n### Subheading\n- list item 1\n- list item 2',
  },
}
