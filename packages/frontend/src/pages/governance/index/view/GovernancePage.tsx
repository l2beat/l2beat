import chunk from 'lodash/chunk'
import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { FullPageHeader } from '../../../../components/FullPageHeader'
import { GovernanceHeaderIllustration } from '../../../../components/governance/GovernanceHeaderIllustration'
import { GovernanceEventsSection } from '../../../../components/governance/sections/GovernanceEventsSection'
import { OfficeHoursSection } from '../../../../components/governance/sections/OfficeHoursSection'
import { OurApproachSection } from '../../../../components/governance/sections/OurApproachSection'
import { OurMissionSection } from '../../../../components/governance/sections/OurMissionSection'
import { RecentPublicationsSection } from '../../../../components/governance/sections/RecentPublicationsSection'
import { OutLinkIcon } from '../../../../components/icons'
import { Link } from '../../../../components/Link'
import { PageContent } from '../../../../components/PageContent'
import { GovernanceDelegatedProjectEntry } from '../props/getGovernanceDelegatedProjectEntry'
import { GovernanceEventEntry } from '../props/getGovernanceEventEntries'
import { GovernancePublicationEntry } from '../props/getGovernancePublicationEntry'

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
      <Header
        delegatedProjects={props.delegatedProjects}
        pageContentClassName="md:px-6 lg:px-12 justify-start"
      />
      <PageContent className="md:px-6 lg:px-12">
        <main className="grid md:mt-20 md:gap-6 lg:grid-cols-8 lg:gap-8 [&>*:nth-child(odd)]:bg-transparent md:[&>*:nth-child(odd)]:bg-gray-100 md:[&>*:nth-child(odd)]:dark:dark:bg-zinc-900">
          <RecentPublicationsSection
            publications={props.publications}
            className="lg:col-span-5"
          />
          <OfficeHoursSection className="lg:col-span-3" />
          <GovernanceEventsSection
            events={props.events}
            className="lg:col-span-full"
          />
          <OurApproachSection className="lg:col-span-4" />
          <OurMissionSection className="lg:col-span-4" />
        </main>
      </PageContent>
      <Footer {...props.footer} className="mt-0 md:mt-20" />
    </>
  )
}

function Header(props: {
  delegatedProjects: GovernanceDelegatedProjectEntry[]
  pageContentClassName?: string
}) {
  const chunkedProjects = chunk(props.delegatedProjects, 3)

  return (
    <FullPageHeader pageContentClassName={props.pageContentClassName}>
      <div className="flex items-center gap-10">
        <div className="leading-normal lg:max-w-[585px]">
          <h1 className="text-5xl font-bold md:text-6xl">Governance</h1>
          <p className="mt-6 text-lg md:text-base">
            By delegating your governance votes to L2BEAT, you're supporting our
            mission to protect the interests of the Ethereum community and
            uphold our shared values. Together, we can lead the L2 ecosystem
            towards a safer, more secure decentralized future.
          </p>

          <div className="mt-6">
            <span className="text-sm text-purple-100 dark:text-pink-200">
              DELEGATE YOUR TOKENS
            </span>
            {chunkedProjects.map((projects, i) => {
              return (
                <div
                  className="mt-2 flex flex-col gap-2 md:flex-row md:flex-wrap"
                  key={i}
                >
                  {projects.map((delegatedProject) => (
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
              )
            })}
          </div>
          <p className="mt-6 text-xs md:text-sm">
            If you’d like to see us act as a delegate in another protocol,
            please let us know and we’ll see what we can do.
          </p>
        </div>
        <GovernanceHeaderIllustration className="hidden size-full min-w-[500px] lg:block" />
      </div>
    </FullPageHeader>
  )
}
