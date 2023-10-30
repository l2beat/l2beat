import { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'

import { configureDarkThemeToggle } from './configureDarkThemeToggle'
import { configureSidebarMenu } from './configureSidebarMenu'
import { Navbar } from './Navbar'

const meta: Meta<typeof Navbar> = {
  component: Navbar,
  argTypes: {
    selectedPage: {
      options: ['scaling', 'bridges', 'donate', 'faq'],
      control: { type: 'select' },
    },
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        configureSidebarMenu()
        configureDarkThemeToggle()
      }, [])
      return <Story />
    },
  ],
  args: {
    forumLink: '#',
    showActivity: true,
    showHiringBadge: true,
    socialLinks: {
      discordLink: '#',
      githubLink: '#',
      linkedinLink: '#',
      mediumLink: '#',
      twitterLink: '#',
      youTubeLink: '#',
    },
  },
}
export default meta
type Story = StoryObj<typeof Navbar>

export const NoBannerScaling: Story = {
  args: {
    showBanner: false,
    selectedPage: 'scaling',
  },
}

export const NoBannerBridges: Story = {
  args: {
    showBanner: false,
    selectedPage: 'bridges',
  },
}

export const NoBannerDonate: Story = {
  args: {
    showBanner: false,
    selectedPage: 'donate',
  },
}

export const BannerScaling: Story = {
  args: {
    showBanner: true,
    selectedPage: 'scaling',
  },
}
