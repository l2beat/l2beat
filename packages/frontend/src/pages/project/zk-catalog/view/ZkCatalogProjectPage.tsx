import { ProofVerification } from '@l2beat/config'
import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { Link } from '../../../../components/Link'
import { Markdown } from '../../../../components/Markdown'
import { PageContent } from '../../../../components/PageContent'
import { ProjectHeader } from '../../components/header/ProjectHeader'
import { RequiredTools } from './RequiredTools'
import { Verifiers } from './Verifiers'

export interface ZkCatalogProjectPageProps {
  navbar: NavbarProps
  details: ZkCatalogProjectDetails
  footer: FooterProps
}

export interface ZkCatalogProjectDetails {
  title: string
  icon: string | undefined
  proofVerification: ProofVerification
  linkToMainProjectDetails: string | undefined
}

export function ZkCatalogProjectPage(props: ZkCatalogProjectPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <header className="mt-11 md:mt-[72px]">
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
            <ProjectHeader {...props.details} />
            <Link
              href={props.details.linkToMainProjectDetails}
              showArrow
              textClassName="mb-2"
            >
              View project's detail page
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 rounded-xl bg-gray-100 dark:bg-zinc-900 p-6">
            <HeaderItem title="Number of verifiers">
              {props.details.proofVerification.verifiers.length.toString()}
            </HeaderItem>
            <HeaderItem title="Aggregation">
              {props.details.proofVerification.aggregation ? 'Yes' : 'No'}
            </HeaderItem>
          </div>
        </header>
        <div className="space-y-10 mt-16">
          <section>
            <h2 className="mb-4 text-2xl font-bold">List of verifiers</h2>
            <Verifiers items={props.details.proofVerification.verifiers} />
          </section>
          <section>
            <h2 className="mb-4 text-2xl font-bold">Description</h2>
            <Markdown>{props.details.proofVerification.description}</Markdown>
          </section>
          <section>
            <h2 className="mb-4 text-2xl font-bold">List of required tools</h2>
            <RequiredTools
              items={props.details.proofVerification.requiredTools}
            />
          </section>
        </div>
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}

function HeaderItem({ title, children }: { title: string; children: string }) {
  return (
    <div>
      <h3 className="mb-2 text-xs text-gray-600 dark:text-gray-50">{title}</h3>
      <span className="text-lg font-bold">{children}</span>
    </div>
  )
}
