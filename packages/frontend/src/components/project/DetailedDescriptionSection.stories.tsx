import { Meta, StoryObj } from '@storybook/react'

import { DetailedDescriptionSection as DescriptionSectionComponent } from './DetailedDescriptionSection'

const meta: Meta<typeof DescriptionSectionComponent> = {
  component: DescriptionSectionComponent,
  args: {
    id: 'detailed-description',
    title: 'Detailed description',
  },
}
export default meta
type Story = StoryObj<typeof DescriptionSectionComponent>

export const Description: Story = {
  args: {
    description:
      'Optimistic Ethereum is an EVM-compatible Optimistic Rollup chain.',
    detailedDescription:
      'It aims to be fast, simple, and secure. With the Nov 2021 upgrade to "EVM equivalent" OVM 2.0 old fraud proof system has been disabled while the new fraud-proof system is being built (https://github.com/geohot/cannon).',
  },
}
