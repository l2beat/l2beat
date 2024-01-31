import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { GovernanceEventsSection } from '../../../../components/governance/sections/GovernanceEventsSections'
import { OfficeHoursSection } from '../../../../components/governance/sections/OfficeHoursSection'
import { OurApproachSection } from '../../../../components/governance/sections/OurApproachSection'
import { OurMissionSection } from '../../../../components/governance/sections/OurMissionSection'
import { RecentPublicationsSection } from '../../../../components/governance/sections/RecentPublicationsSection'
import { PageContent } from '../../../../components/PageContent'
import { GovernanceEventEntry } from '../../getGovernanceEventEntry'
import { GovernancePublicationEntry } from '../../getGovernancePublicationEntry'

export interface GovernancePageProps {
  publications: GovernancePublicationEntry[]
  events: GovernanceEventEntry[]
  navbar: NavbarProps
  footer: FooterProps
}

export function GovernancePage(props: GovernancePageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent className="max-w-[1296px]">
        <main className="mt-20 grid md:grid-cols-8 md:gap-8">
          <RecentPublicationsSection
            publications={props.publications}
            className="md:col-span-5"
          />
          <OfficeHoursSection className="md:col-span-3" />
          <GovernanceEventsSection
            events={props.events}
            className="md:col-span-full"
          />
          <OurApproachSection className="md:col-span-4" />
          <OurMissionSection className="md:col-span-4" />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
