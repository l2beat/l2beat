import React from 'react'

import {
  Footer,
  FooterProps,
  Header,
  Navbar,
  NavbarProps,
} from '../../components'
import { MultisigReportAnnouncementBar } from '../../components/announcement/AnnouncementBar'
import { FloatingBanner } from '../../components/floating-banner/FloatingBanner'
import { PageContent } from '../../components/PageContent'
import { DonateDetails, DonationDetailsProps } from './DonateDetails'
import { DonateLetter } from './DonateLetter'
import { GitcoinButton } from './GitcoinButton'

export interface DonatePageProps {
  title: string
  details: DonationDetailsProps
  footer: FooterProps
  showGitcoinButton: boolean
  navbar: NavbarProps
  showMultisigReport: boolean
}

export function DonatePage(props: DonatePageProps) {
  return (
    <>
      {props.showMultisigReport && (
        <>
          <MultisigReportAnnouncementBar />
          <FloatingBanner />
        </>
      )}
      <Navbar {...props.navbar} />
      <PageContent narrow>
        <Header title={props.title} />
        <DonateLetter />
        {props.showGitcoinButton && <GitcoinButton />}
        <DonateDetails {...props.details} />
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
