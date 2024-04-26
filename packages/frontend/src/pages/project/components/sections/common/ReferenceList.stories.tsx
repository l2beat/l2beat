import { Meta, StoryObj } from '@storybook/react'

import { ReferenceList as ReferenceListComponent } from './ReferenceList'

const meta: Meta<typeof ReferenceListComponent> = {
  component: ReferenceListComponent,
}
export default meta
type Story = StoryObj<typeof ReferenceListComponent>

export const ReferenceList: Story = {
  args: {
    references: [
      {
        href: '#',
        text: 'Withdrawing back to L1 - Optimism Help Center',
      },
      {
        href: '#',
        text: 'mockOVM_BondManager.sol#L71 - Etherscan source code',
      },
    ],
  },
}
