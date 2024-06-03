import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import React, { useEffect } from 'react'

import { onlyDesktopModes } from '../../../../../.storybook/modes'
import { configureOverflowWrappers } from '../../../../scripts/configureOverflowWrappers'
import { configureProjectFilters } from '../../../../scripts/configureProjectFilters'
import { configureTabs } from '../../../../scripts/configureTabs'
import { configureTables } from '../../../../scripts/table/configureTables'
import { ScalingSummaryView } from './ScalingSummaryView'

const meta = {
  title: 'Pages/Scaling/SummaryView',
  component: ScalingSummaryView,
  args: {
    //TODO: GENERATE NEW
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        configureTables()
        configureTabs()
        configureProjectFilters()
        configureOverflowWrappers()
      }, [])
      return <Story />
    },
  ],
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
} satisfies Meta<typeof ScalingSummaryView>
export default meta

type Story = StoryObj<typeof ScalingSummaryView>

export const Active: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const activeTab = canvas.getByText('Active projects')
    await userEvent.click(canvas.getByText('Active projects'), { delay: 25 })
    setTimeout(() => activeTab.blur(), 1000)
  },
}

export const ActiveWithRollupsOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Active projects'), { delay: 25 })
    await userEvent.click(canvas.getByText('Rollups only'))
  },
}

export const Upcoming: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Upcoming projects'), { delay: 25 })
  },
}

export const UpcomingWithRollupsOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Upcoming projects'), { delay: 25 })
    await userEvent.click(canvas.getByText('Rollups only'))
  },
}

export const Archived: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Archived projects'), { delay: 25 })
  },
}

export const ArchivedWithRollupsOnly: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Archived projects'), { delay: 25 })
    await userEvent.click(canvas.getByText('Rollups only'))
  },
}
