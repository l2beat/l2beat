import React from 'react'

import { Footer, Header } from '../../components'
import { Page } from '../../components/Page'
import { DonateDetails } from './DonateDetails'
import { DonateLetter } from './DonateLetter'
import { DonatePageProps } from './getProps'
import { GitcoinButton } from './GitcoinButton'

export function DonatePage(props: DonatePageProps) {
  return (
    <Page>
      <Header title={props.title} />
      <DonateLetter />
      <GitcoinButton />
      <DonateDetails {...props.details} />
      <Footer />
    </Page>
  )
}
