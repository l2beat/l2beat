import React from 'react'

import { Footer, Header, Navbar, Page } from '../../components'
import { JobsPageProps } from './getProps'
import { JobPosting } from './JobPosting'

export function JobsPage(props: JobsPageProps) {
  return (
    <Page metadata={props.metadata}>
      <Navbar />
      <Header title={props.title} />
      <JobPosting />
      <Footer />
    </Page>
  )
}
