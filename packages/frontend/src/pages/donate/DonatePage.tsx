import React from 'react'

import { Footer, FooterProps, Header, NavbarProps } from '../../components'
import { Page } from '../../components/Page'
import { DonateDetails, DonationDetailsProps } from './DonateDetails'
import { DonateLetter } from './DonateLetter'
import { GitcoinButton } from './GitcoinButton'

export interface DonatePageProps {
  title: string
  details: DonationDetailsProps
  footer: FooterProps
  showGitcoinButton: boolean
  navbar: NavbarProps
}

export function DonatePage(props: DonatePageProps) {
  return (
    <Page narrow navbar={props.navbar}>
      <Header title={props.title} />
      <DonateLetter />
      {props.showGitcoinButton && <GitcoinButton />}
      <DonateDetails {...props.details} />
      <Footer {...props.footer} />
    </Page>
  )
}
