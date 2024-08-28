import { type Meta, type StoryObj } from '@storybook/react'
import { CopyButton } from './copy-button'
import { userEvent, within } from '@storybook/test'

const meta = {
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

export const Default: Story = {}

export const Copied: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
  },
}
