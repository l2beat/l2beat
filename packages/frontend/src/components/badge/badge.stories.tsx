import type { Meta, StoryObj } from '@storybook/react'

import { Badge } from './badge'

const meta = {
  title: 'Atoms/Badge',
} satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge type="error">Error</Badge>
      <Badge type="warning">Warning</Badge>
      <Badge type="brightYellow">Bright Yellow</Badge>
      <Badge type="purple">Purple</Badge>
      <Badge type="gray">Gray</Badge>
    </div>
  ),
}
