import { Meta, StoryObj } from '@storybook/react'

import { KnowledgeNuggetsSection as KnowledgeNuggetsComponent } from './KnowledgeNuggetsSection'

const meta: Meta<typeof KnowledgeNuggetsComponent> = {
  component: KnowledgeNuggetsComponent,
  args: {
    title: 'Knowledge nuggets',
    id: 'knowledge-nuggets',
  },
}
export default meta
type Story = StoryObj<typeof KnowledgeNuggetsComponent>

const knowledgeNuggetsExample = [
  {
    title: 'Arbitrum fraud proofs tested on POW ETH',
    url: 'https://www.somelink.com',
    thumbnail: 'arbitrum-01.jpg',
  },
  {
    title: "Fuel's fraud proofs tested by L2BEAT team",
    url: 'https://www.somelink.com',
    thumbnail: 'fuel-01.jpg',
  },
]

export const KnowledgeNuggets: Story = {
  args: {
    knowledgeNuggets: knowledgeNuggetsExample,
  },
}
