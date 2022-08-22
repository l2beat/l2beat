import React from 'react'

import { Footer, Header, Navbar, Page } from '../../components'
import { DonateDetails } from './DonateDetails'
import { DonateLetter } from './DonateLetter'
import { DonatePageProps } from './getProps'
import { GitcoinButton } from './GitcoinButton'

export function DonatePage(props: DonatePageProps) {
  return (
    <Page metadata={props.metadata}>
      <Navbar />
      <Header title={props.title} />
      <DonateLetter />
      <GitcoinButton />
      <DonateDetails {...props.details} />
      <Footer />
    </Page>
  )
}
