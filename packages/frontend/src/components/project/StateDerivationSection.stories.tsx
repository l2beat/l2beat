import { Meta, StoryObj } from '@storybook/react'

import { StateDerivationSection } from './StateDerivationSection'

const meta: Meta<typeof StateDerivationSection> = {
  component: StateDerivationSection,
  args: {
    title: 'State Derivation',
    id: 'state-derivation',
  },
}
export default meta
type Story = StoryObj<typeof StateDerivationSection>

export const StateDerivation: Story = {
  args: {
    nodeSoftware: 'The open-source node software can be found here.',
    compressionScheme:
      'Arbitrum One uses Brotli, a well-known general purpose compression method.',
    genesisState: 'The genesis file can be found here.',
    dataFormat:
      'The batch consists of a header along with a compressed blob which is the compression of concatenated RLP encoded transactions using the standard RLP encoding.',
  },
}
