import type { Meta, StoryObj } from '@storybook/react'
import { KnowledgeNuggetsSection } from './knowledge-nuggets-section'

const meta = {
  title: 'Components/Projects/Sections/Knowledge Nuggets',
  component: KnowledgeNuggetsSection,
  args: {
    title: 'Knowledge nuggets',
    id: 'knowledge-nuggets',
    sectionOrder: '1',
  },
} satisfies Meta<typeof KnowledgeNuggetsSection>
export default meta

type Story = StoryObj<typeof meta>

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

export const Default: Story = {
  args: {
    knowledgeNuggets: knowledgeNuggetsExample,
  },
}
