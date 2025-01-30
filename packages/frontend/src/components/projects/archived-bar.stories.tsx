import type { Meta, StoryObj } from '@storybook/react'
import { ArchivedBar } from './archived-bar'

const meta = {
  title: 'Components/Bars',
  component: ArchivedBar,
} satisfies Meta<typeof ArchivedBar>
export default meta

type Story = StoryObj<typeof meta>

export const Archived: Story = {}
