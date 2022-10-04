import React, { useEffect } from 'react'

import { configureDarkThemeToggle } from './configureDarkThemeToggle'
import { configureSidebarMenu } from './configureSidebarMenu'
import { Navbar as NavbarComponent } from './Navbar'

export default {
  title: 'Components/Navbar',
}

export function Navbar() {
  useEffect(() => {
    configureDarkThemeToggle()
    configureSidebarMenu()
  }, [])
  return (
    <NavbarComponent
      showBanner={false}
      forumLink="#"
      uglyBridgesScalingSwitch={false}
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
