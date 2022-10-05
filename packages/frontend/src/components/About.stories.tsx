import React from 'react'

import { About as AboutComponent } from './About'
import { PageContent } from './PageContent'

export default {
  title: 'Components/About',
}

export function About() {
  return (
    <PageContent>
      <AboutComponent />
    </PageContent>
  )
}
