import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

const meta = {
  title: 'Atoms/Tabs',
  component: Tabs,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: (args) => (
    <Tabs defaultValue="tab1" {...args}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content of Tab 1</TabsContent>
      <TabsContent value="tab2">Content of Tab 2</TabsContent>
      <TabsContent value="tab3">Content of Tab 3</TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Tab 2'))
  },
}

export const WithDisabledTab: Story = {
  render: (args) => (
    <Tabs defaultValue="tab1" {...args}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3" disabled>
          Disabled Tab
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content of Tab 1</TabsContent>
      <TabsContent value="tab2">Content of Tab 2</TabsContent>
      <TabsContent value="tab3">Content of Disabled Tab</TabsContent>
    </Tabs>
  ),
}
