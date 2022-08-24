import React, { useEffect } from 'react'

import { Navbar as NavbarComponent } from '../../components/Navbar'
import { Page } from '../../components/Page'
import { configureDarkMode } from '../../scripts/configureDarkMode'

export default {
  title: 'Components/Navbar',
  controls: { hideNoControlsWarning: true },
  layout: 'fullscreen',
}

export function Navbar() {
  useEffect(() => {
    configureDarkMode()
  }, [])
  return (
    <Page>
      <NavbarComponent />
    </Page>
  )
}
