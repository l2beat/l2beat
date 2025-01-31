import type { Meta, StoryObj } from '@storybook/react'
import { WarningBar } from './warning-bar'

const meta = {
  title: 'Components/Bars',
  component: WarningBar,
  args: {
    color: 'yellow',
    text: 'This is an example text for the warning.',
  },
} satisfies Meta<typeof WarningBar>
export default meta
type Story = StoryObj<typeof WarningBar>

export const Warning: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <WarningBar {...args} />
      <WarningBar {...args} color="gray" />
      <WarningBar {...args} color="red" />
      <WarningBar {...args} color="red" isCritical={true} />
      <WarningBar
        {...args}
        text="This is yellow warning bar with link."
        href="https://example.com"
      />
    </div>
  ),
}
