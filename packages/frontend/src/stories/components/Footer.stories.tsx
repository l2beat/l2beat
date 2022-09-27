import React from 'react'

import { Footer as FooterComponent } from '../../components/Footer'
import { PageContent } from '../../components/PageContent'

export default {
  title: 'Components/Footer',
}

export function Footer() {
  return (
    <PageContent>
      <FooterComponent twitterLink="#" discordLink="#" githubLink="#" />
    </PageContent>
  )
}
