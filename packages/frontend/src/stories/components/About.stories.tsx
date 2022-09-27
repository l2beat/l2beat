import React from 'react'

import { About as AboutComponent } from '../../components/About'
import { PageContent } from '../../components/PageContent'

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
