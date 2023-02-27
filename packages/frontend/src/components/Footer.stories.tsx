import React from 'react'

import { Footer as FooterComponent } from './Footer'
import { PageContent } from './PageContent'

export default {
  title: 'Components/Footer',
}

export function Footer() {
  return (
    <PageContent>
      <FooterComponent
        twitterLink="#"
        discordLink="#"
        githubLink="#"
        linkedinLink="#"
        mediumLink="#"
        youTubeLink="#"
      />
    </PageContent>
  )
}
