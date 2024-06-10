import { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'
import React from 'react'
import { configureThemeToggle } from '../../scripts/configureThemeToggle'
import { NavWrapper } from './NavWrapper'

const meta: Meta<typeof NavWrapper> = {
  component: NavWrapper,
  argTypes: {},
  decorators: [
    (Story) => {
      useEffect(() => {
        configureThemeToggle()
      }, [])
      return <Story />
    },
  ],
  args: {},
}
export default meta
type Story = StoryObj<typeof NavWrapper>

export const Primary: Story = {}
