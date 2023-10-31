import { Meta, StoryObj } from '@storybook/react'

import { TokenEntry } from './TokenEntry'

const meta: Meta<typeof TokenEntry> = {
  component: TokenEntry,
}
export default meta
type Story = StoryObj<typeof TokenEntry>

export const TokenEntryStory: Story = {
  args: {
    l2Tokens: ['ARB'],
  },
}
