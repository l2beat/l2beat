import React from 'react'

import { OtherSites as OtherSitesComponent } from '../otherSites/OtherSites'
import { PageContent } from '../PageContent'

export default {
  title: 'Components/OtherSites',
}

export function OtherSites() {
  return (
    <PageContent>
      <OtherSitesComponent />
    </PageContent>
  )
}
