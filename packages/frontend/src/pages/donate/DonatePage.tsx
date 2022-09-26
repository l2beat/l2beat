import React from 'react'

import { Footer, FooterProps, Header } from '../../components'
import { Page } from '../../components/Page'
import { DonateDetails, DonationDetailsProps } from './DonateDetails'
import { DonateLetter } from './DonateLetter'
import { GitcoinButton } from './GitcoinButton'

export interface DonatePageProps {
  title: string
  details: DonationDetailsProps
  footer: FooterProps
}

export function DonatePage(props: DonatePageProps) {
  return (
    <Page>
      <Header title={props.title} />
      <DonateLetter />
      <GitcoinButton />
      <DonateDetails {...props.details} />
      <Footer {...props.footer} />
    </Page>
  )
}
