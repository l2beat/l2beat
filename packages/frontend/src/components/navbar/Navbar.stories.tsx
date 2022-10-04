import { Meta, Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { configureDarkThemeToggle } from './configureDarkThemeToggle'
import { configureSidebarMenu } from './configureSidebarMenu'
import { Navbar, NavbarPage } from './Navbar'

export default {
  title: 'Components/Navbar',
  argTypes: {
    selectedPage: {
      options: ['scaling', 'bridges', 'donate', 'faq'],
      control: { type: 'select' },
    },
  },
} as Meta

interface TemplateProps {
  showBridges: boolean
  showBanner: boolean
  selectedPage: NavbarPage
}

function Template(props: TemplateProps) {
  useEffect(() => {
    configureDarkThemeToggle()
    configureSidebarMenu()
  }, [])
  return (
    <Navbar
      showBanner={props.showBanner}
      forumLink="#"
      showBridges={props.showBridges}
      selectedPage={props.selectedPage}
      socialLinks={{
        discordLink: '#',
        githubLink: '#',
        mediumLink: '#',
        twitterLink: '#',
        youTubeLink: '#',
      }}
    />
  )
}

export const NoBannerScaling: Story<TemplateProps> = Template.bind({})
NoBannerScaling.args = {
  showBridges: true,
  showBanner: false,
  selectedPage: 'scaling',
}

export const NoBannerBridges: Story<TemplateProps> = Template.bind({})
NoBannerBridges.args = {
  showBridges: true,
  showBanner: false,
  selectedPage: 'bridges',
}

export const NoBannerDonate: Story<TemplateProps> = Template.bind({})
NoBannerDonate.args = {
  showBridges: true,
  showBanner: false,
  selectedPage: 'donate',
}

export const BannerScaling: Story<TemplateProps> = Template.bind({})
BannerScaling.args = {
  showBridges: true,
  showBanner: true,
  selectedPage: 'scaling',
}
