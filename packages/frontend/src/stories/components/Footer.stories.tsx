import React from 'react'

import { Footer as FooterComponent } from '../../components/Footer'
import { Page } from '../../components/Page'

export default {
  title: 'Components/Footer',
  controls: { hideNoControlsWarning: true },
  layout: 'fullscreen',
}

export function Footer() {
  return (
    <Page>
      <FooterComponent />
    </Page>
  )
}
