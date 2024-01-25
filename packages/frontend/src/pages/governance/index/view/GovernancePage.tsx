import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import {
  GovernanceCard,
  GovernanceCardHeader,
} from '../../../../components/governance/GovernanceCard'
import { RecentPublicationsSection } from '../../../../components/governance/sections/RecentPublicationsSection'
import { PageContent } from '../../../../components/PageContent'
import { GovernancePublicationEntry } from '../../getGovernancePublicationEntry'

export interface GovernancePageProps {
  publications: GovernancePublicationEntry[]
  navbar: NavbarProps
  footer: FooterProps
}

export function GovernancePage(props: GovernancePageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent className="max-w-[1296px]">
        <main className="mt-20 grid grid-cols-8 gap-8">
          <RecentPublicationsSection
            publications={props.publications}
            className="col-span-5"
          />
          <GovernanceCard as="section" className="col-span-3" type="purple">
            <GovernanceCardHeader title="Office hours" />
          </GovernanceCard>
          <GovernanceCard as="section" className="col-span-8">
            <GovernanceCardHeader title="Governance Events" />
          </GovernanceCard>
          <GovernanceCard as="section" className="col-span-4">
            <GovernanceCardHeader title="Our approach" />
          </GovernanceCard>
          <GovernanceCard as="section" className="col-span-4">
            <GovernanceCardHeader title="Our Mission" />
          </GovernanceCard>
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
