import React, { useEffect } from 'react'

import { configureDarkThemeToggle } from '../../components/navbar/configureDarkThemeToggle'
import { configureSidebarMenu } from '../../components/navbar/configureSidebarMenu'
import { Navbar as NavbarComponent } from '../../components/navbar/Navbar'

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
