import React from 'react'

import { Footer, Header, Navbar, Page } from '../../common'
import { DonateDetails } from './DonateDetails'
import { DonateLetter } from './DonateLetter'
import { DonatePageProps } from './getProps'

export function DonatePage(props: DonatePageProps) {
  return (
    <Page metadata={props.metadata}>
      <Navbar />
      <Header title={props.title} />
      <DonateLetter />
      <DonateDetails {...props.details} />
      <Footer />
    </Page>
  )
}
