import { type Meta, type StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'
import { RadioGroup, RadioGroupItem } from './radio-group'

const meta = {
  title: 'Atoms/Radio Group',
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <RadioGroupItem value="option1">Option 1</RadioGroupItem>
      <RadioGroupItem value="option2">Option 2</RadioGroupItem>
      <RadioGroupItem value="option3">Option 3</RadioGroupItem>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Option 2'))
  },
}

export const WithHighlightedVariant: Story = {
  render: () => (
    <RadioGroup defaultValue="highlighted1" variant="highlighted">
      <RadioGroupItem value="highlighted1">Highlighted 1</RadioGroupItem>
      <RadioGroupItem value="highlighted2">Highlighted 2</RadioGroupItem>
      <RadioGroupItem value="highlighted3">Highlighted 3</RadioGroupItem>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <RadioGroupItem value="option1">Enabled</RadioGroupItem>
      <RadioGroupItem value="option2" disabled>
        Disabled
      </RadioGroupItem>
    </RadioGroup>
  ),
}
