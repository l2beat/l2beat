import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import range from 'lodash/range'
import React, { useEffect } from 'react'

import { configureExpandableContainer } from '../scripts/configureExpandableContainer'
import { ExpandableContainer as ExpandableContainerComponent } from './ExpandableContainer'

const meta: Meta<typeof ExpandableContainerComponent> = {
  component: ExpandableContainerComponent,
  decorators: [
    (Story) => {
      useEffect(() => {
        configureExpandableContainer()
      }, [])
      return (
        <div className="max-w-[50%]">
          <Story />
        </div>
      )
    },
  ],
}
export default meta
type Story = StoryObj<typeof ExpandableContainerComponent>

const items = range(8).map(() => {
  return (
    <div className="my-2">
      Sit Lorem est ad ut est do consectetur. Ipsum mollit pariatur sit sit enim
      ullamco qui anim ex id aliquip deserunt quis. Voluptate occaecat anim elit
      magna officia sunt. Proident irure commodo culpa officia nisi labore
      veniam esse irure minim pariatur culpa. Culpa exercitation amet deserunt
      dolor veniam dolor.
    </div>
  )
})

export const Collapsed: Story = {
  args: {
    children: items,
  },
}

export const Expanded: Story = {
  args: {
    children: items,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Show more'))
  },
}

export const NonExpandable: Story = {
  args: {
    children: (
      <div className="my-2">
        Sit Lorem est ad ut est do consectetur. Ipsum mollit pariatur sit sit
        enim ullamco qui anim ex id aliquip deserunt quis. Voluptate occaecat
        anim elit magna officia sunt.
      </div>
    ),
  },
}
