import { Meta, StoryObj } from '@storybook/react'

import { DescriptionSection as DescriptionSectionComponent } from './DescriptionSection'

const meta: Meta<typeof DescriptionSectionComponent> = {
  component: DescriptionSectionComponent,
  args: {
    id: 'description',
    title: 'Description',
  },
}
export default meta
type Story = StoryObj<typeof DescriptionSectionComponent>

const warning =
  'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.'

export const Description: Story = {
  args: {
    isVerified: true,
    warning,
    description:
      'Optimistic Ethereum is an EVM-compatible Optimistic Rollup chain. It aims to be fast, simple, and secure. With the Nov 2021 upgrade to "EVM equivalent" OVM 2.0 old fraud proof system has been disabled while the new fraud-proof system is being built (https://github.com/geohot/cannon).',
    issueLink: '#',
    editLink: '#',
  },
}
