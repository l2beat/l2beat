import { ProofVerification } from '@l2beat/config'
import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { Markdown } from '../../../../components/Markdown'
import { PageContent } from '../../../../components/PageContent'
import { ProjectHeader } from '../../../../components/ProjectHeader'
import { RequiredTools } from './RequiredTools'
import { Verifiers } from './Verifiers'

export interface ZkCatalogProjectPageProps {
  navbar: NavbarProps
  details: ProjectDetails
  footer: FooterProps
}

interface ProjectDetails {
  title: string
  icon: string | undefined
  proofVerification: ProofVerification
}

export function ZkCatalogProjectPage(props: ZkCatalogProjectPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <header className="mb-16 mt-11 md:mt-[72px]">
          <ProjectHeader {...props.details} />
          <div className="mt-8 grid grid-cols-2 rounded-xl bg-gray-100 dark:bg-zinc-900 p-6">
            <HeaderItem title="Number of verifiers">
              {props.details.proofVerification.verifiers.length.toString()}
            </HeaderItem>
            <HeaderItem title="Aggregation">
              {props.details.proofVerification.aggregation ? 'Yes' : 'No'}
            </HeaderItem>
          </div>
        </header>
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-extrabold">Verifier's details</h2>
            <p className="mt-4 text-lg font-medium text-zinc-500 dark:text-gray-50">
              We verify if the onchain verifier matches the generated ones.
            </p>
          </div>
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
