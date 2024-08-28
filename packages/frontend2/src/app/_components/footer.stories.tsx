import { type Meta, type StoryObj } from '@storybook/react'

import { Footer } from './footer'

const meta = {
  title: 'UI/Misc/Footer',
  component: Footer,
} satisfies Meta<typeof Footer>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
