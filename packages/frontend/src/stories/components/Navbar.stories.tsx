import React, { useEffect } from 'react'

import { configureDarkThemeToggle } from '../../components/navbar/configureDarkThemeToggle'
import { configureSidebarMenu } from '../../components/navbar/configureSidebarMenu'
import { Navbar as NavbarComponent } from '../../components/navbar/Navbar'
import { Page } from '../../components/Page'

export default {
  title: 'Components/Navbar',
}

export function Navbar() {
  useEffect(() => {
    configureDarkThemeToggle()
    configureSidebarMenu()
  }, [])
  return (
    <Page>
      <NavbarComponent />
    </Page>
  )
}
