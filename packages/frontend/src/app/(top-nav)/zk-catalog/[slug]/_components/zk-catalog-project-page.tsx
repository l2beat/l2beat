import Image from 'next/image'
import { type ReactNode } from 'react'

import { HorizontalSeparator } from '~/components/core/horizontal-separator'

import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { CustomLink } from '~/components/link/custom-link'
import { Markdown } from '~/components/markdown/markdown'
import { InfoIcon } from '~/icons/info'
import { type ZkCatalogProofVerification } from '../../_utils/types'
import { ProjectHeader } from './project-header'
import { RequiredTools } from './required-tools'
import { VerifiedCountWithDetails } from './verified-count-with-details'
import { Verifiers } from './verifiers'

export interface ZkCatalogProjectPageProps {
  details: ZkCatalogProjectDetails
  askForVerificationLink: string
}

export interface ZkCatalogProjectDetails extends ZkCatalogProofVerification {
  title: string
  icon: string
  description: string | undefined
  trustedSetup: string
  linkToMainProjectDetails: string | undefined
}

export function ZkCatalogProjectPage(props: ZkCatalogProjectPageProps) {
  return (
    <>
      <div className="bg-gray-100 px-4 pb-6 pt-8 dark:bg-zinc-900 md:!bg-transparent md:px-0 md:pb-0 md:pt-[72px]">
        <Breadcrumbs icon={props.details.icon} title={props.details.title} />
        <Header {...props} />
      </div>
      <div className="mt-8 space-y-10 px-4 md:mt-16 md:px-0">
        <Section title="List of verifiers">
          <Verifiers
            items={props.details.verifiers}
            askForVerificationLink={props.askForVerificationLink}
          />
        </Section>
        {props.details.description && (
          <Section title="Description">
            <p className="mb-2">{props.details.shortDescription}</p>
            <Markdown className="zk-description">
              {props.details.description}
            </Markdown>
          </Section>
        )}
        {props.details.requiredTools.length > 0 && (
          <Section title="List of required tools">
            <RequiredTools items={props.details.requiredTools} />
          </Section>
        )}
      </div>
    </>
  )
}

function Breadcrumbs(props: { icon: string; title: string }) {
  return (
    <nav className="flex select-none gap-1 space-x-1 font-medium dark:text-gray-50">
      <Link href="/zk-catalog">ZK Catalog</Link>
      <span>/</span>
      <span className="flex items-center gap-1.5">
        <Image
          alt={`Icon for the ${props.title}`}
          width={16}
          height={16}
          src={props.icon}
          className="inline size-4"
        />
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
          <CustomLink
            className="mt-1 md:mt-0"
            href={props.details.linkToMainProjectDetails}
          >
            View project&apos;s detail page
          </CustomLink>
        ) : undefined}
      </div>
      <HorizontalSeparator className="mb-5 mt-6 md:hidden" />
      <div className="flex grid-cols-3 flex-col gap-1 bg-gray-100 dark:bg-zinc-900 md:mt-8 md:grid md:rounded-xl md:p-6">
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
          {props.details.trustedSetup}
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
    <div className="flex items-baseline justify-between md:block">
      <h3 className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-50 md:mb-2">
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
