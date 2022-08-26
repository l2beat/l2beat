import React from 'react'

import { About as AboutComponent } from '../../components/About'
import { Page } from '../../components/Page'

export default {
  title: 'Components/About',
}

export function About() {
  return (
    <Page>
      <AboutComponent />
    </Page>
  )
}
