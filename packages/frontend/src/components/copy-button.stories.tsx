import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, waitFor, within } from '@storybook/test'
import { CopyButton } from './copy-button'

const meta = {
  title: 'Components/Copy Button',
  component: CopyButton,
  args: {
    toCopy: 'some url',
  },
  decorators: [
    (Story) => {
      return (
        <div className="p-10">
          <Story />
        </div>
      )
    },
  ],
} satisfies Meta<typeof CopyButton>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.hover(canvas.getByRole('button'))
    await waitFor(async () => {
      const tooltip = within(canvas.getByRole('tooltip'))
      await expect(tooltip.getByText('Copy URL')).toBeInTheDocument()
    })
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(async () => {
      const tooltip = within(canvas.getByRole('tooltip'))
      await expect(tooltip.getByText('Copied!')).toBeInTheDocument()
    })
  },
}
