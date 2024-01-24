import { Meta, StoryObj } from '@storybook/react'
import { userEvent, waitFor } from '@storybook/testing-library'
import range from 'lodash/range'
import React, { useEffect } from 'react'

import { onlyMobileModes } from '../../.storybook/modes'
import { configureOverflowWrappers } from '../scripts/configureOverflowWrappers'
import { makeQuery } from '../scripts/query'
import { OverflowWrapper } from './OverflowWrapper'

const meta: Meta<typeof OverflowWrapper> = {
  component: OverflowWrapper,
  decorators: [
    (Story) => {
      useEffect(() => {
        configureOverflowWrappers()
      }, [])

      return <Story />
    },
  ],
  parameters: {
    chromatic: {
      modes: onlyMobileModes,
      delay: 300,
    },
  },
}
export default meta
type Story = StoryObj<typeof OverflowWrapper>

const Content = () => {
  return (
    <div className="flex gap-2">
      {range(10).map((i) => {
        return (
          <div className="whitespace-pre bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
            Element {i + 1}
          </div>
        )
      })}
    </div>
  )
}

export const ScrolledToLeft: Story = {
  render: () => (
    <OverflowWrapper>
      <Content />
    </OverflowWrapper>
  ),
}

export const ScrolledToCenter: Story = {
  render: () => (
    <OverflowWrapper>
      <Content />
    </OverflowWrapper>
  ),
  play: async ({ canvasElement }) => {
    const { $ } = makeQuery(canvasElement)
    const arrowRight = $('[data-role=overflow-wrapper-arrow-right]')
    await waitFor(async () => {
      await userEvent.click(arrowRight)
    })
  },
}

export const ScrolledToRight: Story = {
  render: () => (
    <OverflowWrapper>
      <Content />
    </OverflowWrapper>
  ),
  play: ({ canvasElement }) => {
    const { $ } = makeQuery(canvasElement)
    const content = $('[data-role=overflow-wrapper-content]')
    content.scrollTo(content.scrollWidth, 0)
  },
}
