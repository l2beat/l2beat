import { Meta, StoryObj } from '@storybook/react'
import React, { useEffect } from 'react'

import { ConfigFeatures } from '../../build/config/Config'
import { configureSidebarMenu } from '../../scripts/configureSidebarMenu'
import { configureThemeToggle } from '../../scripts/configureThemeToggle'
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
        configureThemeToggle()
      }, [])
      return <Story />
    },
  ],
  args: {
    forumLink: '#',
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

export const Primary: Story = {
  args: {
    selectedPage: 'scaling',
  },
}

export const Banner: Story = {
  args: {
    features: getFeatures({ banner: true }),
    selectedPage: 'scaling',
  },
}

export const HiringBadge: Story = {
  args: {
    features: getFeatures({ hiringBadge: true }),
    selectedPage: 'scaling',
  },
}

function getFeatures(features: Partial<ConfigFeatures>): ConfigFeatures {
  return features as ConfigFeatures
}
