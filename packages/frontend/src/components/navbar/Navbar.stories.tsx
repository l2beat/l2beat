import { Meta, Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { configureDarkThemeToggle } from './configureDarkThemeToggle'
import { configureSidebarMenu } from './configureSidebarMenu'
import { Navbar } from './Navbar'
import { NavbarPage } from './types'

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
      showActivity
      showHiring
      showHiringBadge
      showMultisigReport
      selectedPage={props.selectedPage}
      socialLinks={{
        discordLink: '#',
        githubLink: '#',
        linkedinLink: '#',
        mediumLink: '#',
        twitterLink: '#',
        youTubeLink: '#',
      }}
    />
  )
}

export const NoBannerScaling: Story<TemplateProps> = Template.bind({})
NoBannerScaling.args = {
  showBanner: false,
  selectedPage: 'scaling',
}

export const NoBannerBridges: Story<TemplateProps> = Template.bind({})
NoBannerBridges.args = {
  showBanner: false,
  selectedPage: 'bridges',
}

export const NoBannerDonate: Story<TemplateProps> = Template.bind({})
NoBannerDonate.args = {
  showBanner: false,
  selectedPage: 'donate',
}

export const BannerScaling: Story<TemplateProps> = Template.bind({})
BannerScaling.args = {
  showBanner: true,
  selectedPage: 'scaling',
}
