import React from 'react'

import { Page } from '../../../components/Page'
import { DonateLetter } from '../../../pages/Donate/DonateLetter'

export default {
  title: 'Pages/Donate/Letter',
  controls: { hideNoControlsWarning: true },
  layout: 'fullscreen',
}

export function Letter() {
  return (
    <Page>
      <DonateLetter />
    </Page>
  )
}
