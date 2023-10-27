import { Meta, StoryObj } from '@storybook/react'

import { KnowledgeNuggetItem } from './KnowledgeNuggetItem'

const meta: Meta<typeof KnowledgeNuggetItem> = {
  component: KnowledgeNuggetItem,
}
export default meta
type Story = StoryObj<typeof KnowledgeNuggetItem>

const knowledgeNuggetExample = {
  title: 'Arbitrum fraud proofs tested on POW ETH',
  url: 'https://www.somelink.com',
  thumbnail: 'arbitrum-01.jpg',
}

export const KnowledgeNugget: Story = {
  args: {
    knowledgeNugget: knowledgeNuggetExample,
  },
}
