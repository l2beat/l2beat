import React, { ReactNode } from 'react'

import { HorizontalSeparator } from '../../../../components/HorizontalSeparator'
import { Link } from '../../../../components/Link'
import { Markdown } from '../../../../components/Markdown'
import { InfoIcon } from '../../../../components/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/tooltip/Tooltip'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { ZkCatalogProofVerification } from '../../../../utils/zk-catalog/types'
import { ProjectHeader } from '../../components/header/ProjectHeader'
import { RequiredTools } from './RequiredTools'
import { VerifiedCountWithDetails } from './VerifiedCountWithDetails'
import { Verifiers } from './Verifiers'

export interface ZkCatalogProjectPageProps {
  details: ZkCatalogProjectDetails
  askForVerificationLink: string
}

export interface ZkCatalogProjectDetails extends ZkCatalogProofVerification {
  title: string
  icon: string
  description: string
  hasTrustedSetup: boolean
  linkToMainProjectDetails: string | undefined
}

export function ZkCatalogProjectPage(props: ZkCatalogProjectPageProps) {
  return (
    <DashboardLayout>
      <div className="bg-gray-100 dark:bg-zinc-900 md:!bg-transparent pt-8 px-4 pb-6 md:px-0 md:pb-0 md:pt-[72px]">
        <Breadcrumbs icon={props.details.icon} title={props.details.title} />
        <Header {...props} />
      </div>
      <div className="space-y-10 mt-8 md:mt-16 px-4 md:px-0">
        <Section title="List of verifiers">
          <Verifiers
            items={props.details.verifiers}
            askForVerificationLink={props.askForVerificationLink}
          />
        </Section>
        <Section title="Description">
          <Markdown>{props.details.description}</Markdown>
        </Section>
        <Section title="List of required tools">
          <RequiredTools items={props.details.requiredTools} />
        </Section>
      </div>
    </DashboardLayout>
  )
}

function Breadcrumbs(props: { icon: string; title: string }) {
  return (
    <nav className="space-x-1 select-none dark:text-gray-50 flex gap-1 font-medium">
      <a href="/zk-catalog">ZK Catalog</a>
      <span>/</span>
      <span>
        <img src={props.icon} className="size-4 mr-1.5 inline" />
        <span>{props.title}</span>
      </span>
    </nav>
  )
}

function Header(props: ZkCatalogProjectPageProps) {
  return (
    <header className="mt-8">
      <div>
        <ProjectHeader {...props.details} />
        {props.details.linkToMainProjectDetails ? (
          <Link
            href={props.details.linkToMainProjectDetails}
            showArrow
            textClassName="mt-1 md:mt-0"
          >
            View project's detail page
          </Link>
        ) : undefined}
      </div>
      <HorizontalSeparator className="md:hidden mt-6 mb-5" />
      <div className="flex flex-col md:grid gap-1 md:mt-8 grid-cols-3 md:rounded-xl bg-gray-100 dark:bg-zinc-900 md:p-6">
        <HeaderItem title="Number of verifiers">
          <VerifiedCountWithDetails verifiers={props.details.verifiers} />
        </HeaderItem>
        <HeaderItem
          title="Aggregation"
          tooltip="Shows if recursive proof aggregation is used."
        >
          {props.details.aggregation ? 'Yes' : 'No'}
        </HeaderItem>
        <HeaderItem
          title="Trusted setup"
          tooltip="Shows if a trusted setup is used anywhere in the proving stack."
        >
          {props.details.hasTrustedSetup ? 'Yes' : 'No'}
        </HeaderItem>
      </div>
    </header>
  )
}

function HeaderItem({
  title,
  tooltip,
  children,
}: {
  title: string
  tooltip?: string
  children: ReactNode
}) {
  return (
    <div className="flex justify-between md:block items-baseline">
      <h3 className="flex items-center gap-1.5 md:mb-2 text-xs text-gray-600 dark:text-gray-50">
        {title}
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="fill-current md:size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        ) : null}
      </h3>
      <span className="text-lg font-bold">{children}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      {children}
    </section>
  )
}
