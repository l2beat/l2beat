import range from 'lodash/range'
import React, { useEffect } from 'react'

import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import { configureHoverableDropdown } from '../scripts/configureHoverableDropdown'
import { HoverableDropdown } from './HoverableDropdown'

const meta: Meta<typeof HoverableDropdown> = {
  component: HoverableDropdown,
  decorators: [
    (Story) => {
      useEffect(() => {
        configureHoverableDropdown()
      }, [])
      return <Story />
    },
  ],
}
export default meta
type Story = StoryObj<typeof HoverableDropdown>

export const Primary: Story = {
  args: {
    children: range(4).map((i) => {
      return <div key={i}>Example dropdown item {i}</div>
    }),
    title: 'Example dropdown',
  },
}

export const Hovered: Story = {
  args: {
    children: range(4).map((i) => {
      return <div key={i}>Example dropdown item {i}</div>
    }),
    title: 'Example dropdown',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByText('Example dropdown')
    await userEvent.hover(toggle)
  },
  parameters: {
    pseudo: {
      hover: true,
    },
  },
}
