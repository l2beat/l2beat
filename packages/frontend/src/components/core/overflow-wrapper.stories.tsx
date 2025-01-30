import type { Meta, StoryObj } from '@storybook/react'
import { within } from '@storybook/test'
import { userEvent, waitFor } from '@storybook/test'
import range from 'lodash/range'
import { onlyMobileModes } from '~/../.storybook/modes'
import { OverflowWrapper } from './overflow-wrapper'

const meta = {
  title: 'Atoms/Overflow Wrapper',
  component: OverflowWrapper,
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    chromatic: {
      modes: onlyMobileModes,
      delay: 300,
    },
  },
} satisfies Meta<typeof OverflowWrapper>
export default meta

type Story = StoryObj<typeof meta>

const Content = () => {
  return (
    <div className="flex gap-2">
      {range(10).map((i) => {
        return (
          <div
            key={i}
            className="whitespace-pre bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
          >
            Element {i + 1}
          </div>
        )
      })}
    </div>
  )
}

export const ScrolledToLeft: Story = {
  args: {
    children: <Content />,
  },
}

export const ScrolledToCenter: Story = {
  args: {
    children: <Content />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const arrowRight = canvas.getByTitle('Scroll right')
    await waitFor(async () => {
      await userEvent.click(arrowRight)
    })
  },
}

export const ScrolledToRight: Story = {
  args: {
    children: <Content />,
  },
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector(
      '[data-role=overflow-wrapper-content]',
    )
    content?.scrollTo(content.scrollWidth, 0)
  },
}
