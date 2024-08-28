import { type Meta, type StoryObj } from '@storybook/react'
import { ReferenceList } from './reference-list'

const meta = {
  title: 'UI/Projects/Sections/Permissions/Reference List',
  component: ReferenceList,
} satisfies Meta<typeof ReferenceList>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
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
