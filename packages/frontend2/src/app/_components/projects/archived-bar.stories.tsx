import { type Meta, type StoryObj } from '@storybook/react'
import { ArchivedBar } from './archived-bar'

const meta = {
  component: ArchivedBar,
} satisfies Meta<typeof ArchivedBar>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
