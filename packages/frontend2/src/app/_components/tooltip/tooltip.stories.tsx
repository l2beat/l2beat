import { type Meta, type StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

const meta = {
  title: 'UI/Atoms/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="m-6">
      <Tooltip>
        <TooltipTrigger className="bg-red-500 p-3">Trigger</TooltipTrigger>
        <TooltipContent>
          <p>Tooltip content</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.hover(canvas.getByText('Trigger'))
  },
}
