import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { GovernanceHeaderIllustration } from '../../../../components/governance/GovernanceHeaderIllustration'
import { GovernanceEventsSection } from '../../../../components/governance/sections/GovernanceEventsSections'
import { OfficeHoursSection } from '../../../../components/governance/sections/OfficeHoursSection'
import { OurApproachSection } from '../../../../components/governance/sections/OurApproachSection'
import { OurMissionSection } from '../../../../components/governance/sections/OurMissionSection'
import { RecentPublicationsSection } from '../../../../components/governance/sections/RecentPublicationsSection'
import { OutLinkIcon } from '../../../../components/icons'
import { Link } from '../../../../components/Link'
import { PageContent } from '../../../../components/PageContent'
import { GovernanceDelegatedProjectEntry } from '../../getGovernanceDelegatedProjectEntry'
import { GovernanceEventEntry } from '../../getGovernanceEventEntries'
import { GovernancePublicationEntry } from '../../getGovernancePublicationEntry'

export interface GovernancePageProps {
  publications: GovernancePublicationEntry[]
  events: GovernanceEventEntry[]
  delegatedProjects: GovernanceDelegatedProjectEntry[]
  navbar: NavbarProps
  footer: FooterProps
}

export function GovernancePage(props: GovernancePageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <Header delegatedProjects={props.delegatedProjects} />
      <PageContent type="wider">
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

function Header(props: {
  delegatedProjects: GovernanceDelegatedProjectEntry[]
}) {
  return (
    <div className="bg-[#FFFFFF] px-4 py-[72px] dark:bg-zinc-900 lg:px-0 lg:py-10">
      <PageContent type="wider">
        <div className="flex items-center">
          <div className="leading-normal">
            <h1 className="text-6xl font-bold">Governance</h1>
            <p className="mt-6 text-balance">
              By delegating your governance votes to L2BEAT, you're supporting
              our mission to protect the interests of the Ethereum community and
              uphold our shared values. Together, we can lead the L2 ecosystem
              towards a safer, more secure decentralized future.
            </p>

            <div className="mt-6">
              <span className="text-sm text-purple-100 dark:text-pink-200">
                DELEGATE YOUR TOKENS
              </span>
              <div className="mt-2 flex flex-col gap-2 md:flex-row md:flex-wrap">
                {props.delegatedProjects.map((delegatedProject) => (
                  <Link
                    key={delegatedProject.id}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-400 bg-gray-100 py-3 transition-colors duration-[250] hover:bg-gray-200 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:bg-zinc-900 md:px-3 md:py-1"
                    textClassName="text-sm font-medium"
                    href={delegatedProject.link}
                    underline={false}
                  >
                    <img
                      className="size-5"
                      src={`/icons/${delegatedProject.id}.png`}
                    />
                    {delegatedProject.name}
                    <OutLinkIcon className="fill-current" />
                  </Link>
                ))}
              </div>
            </div>
            <p className="mt-6">
              If you’d like to see us act as a delegate in another protocol,
              please let us know and we’ll see what we can do.
            </p>
          </div>
          <GovernanceHeaderIllustration className="size-full min-w-[500px]" />
        </div>
      </PageContent>
    </div>
  )
}
