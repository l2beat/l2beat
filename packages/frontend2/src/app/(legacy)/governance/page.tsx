import { chunk } from 'lodash'
import { type Metadata } from 'next'
import Image from 'next/image'
import React from 'react'
import { CustomLink } from '~/app/_components/custom-link'
import { FullPageHeader } from '~/app/_components/full-page-header'
import { getCollection } from '~/content/getCollection'
import OutLinkIcon from '~/icons/outlink.svg'
import { GovernanceHeaderIllustration } from './_components/governance-header-illustration'

export const metadata: Metadata = {
  title: 'Governance - L2BEAT',
  description:
    'Discover everything about the L2BEAT Governance Team, including the latest insights, analyses, and updates',
  openGraph: {
    url: '/governance',
  },
}

export default function Page() {
  return (
    <div>
      <Header />
    </div>
  )
}

function Header() {
  const delegatedProjects = getCollection('delegatedProjects')
  const chunkedProjects = chunk(delegatedProjects, 3)

  return (
    <FullPageHeader>
      <div className="flex items-center gap-10">
        <div className="leading-normal lg:max-w-[585px]">
          <h1 className="text-5xl font-bold md:text-6xl">Governance</h1>
          <p className="mt-6 text-lg md:text-base">
            By delegating your governance votes to L2BEAT, you&apos;re
            supporting our mission to protect the interests of the Ethereum
            community and uphold our shared values. Together, we can lead the L2
            ecosystem towards a safer, more secure decentralized future.
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
                    <CustomLink
                      key={delegatedProject.id}
                      className="flex items-center text-sm font-medium justify-center gap-1.5 rounded-lg border border-gray-400 bg-gray-100 py-3 transition-colors duration-[250] hover:bg-gray-200 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:bg-zinc-900 md:px-3 md:py-1 w-full md:w-max"
                      href={delegatedProject.data.delegateTokensUrl}
                      underline={false}
                    >
                      <Image
                        alt={`Logo of ${delegatedProject.data.name}`}
                        width={20}
                        height={20}
                        src={`/icons/${delegatedProject.id}.png`}
                      />
                      {delegatedProject.data.name}
                      <OutLinkIcon className="fill-current" />
                    </CustomLink>
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
