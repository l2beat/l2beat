import Image from 'next/image'
import type { ReactNode } from 'react'
import { Breadcrumbs } from '~/components/breadcrumbs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { CustomLink } from '~/components/link/custom-link'
import { MainPageHeader } from '~/components/main-page-header'
import { Markdown } from '~/components/markdown/markdown'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import { InfoIcon } from '~/icons/info'
import { ProjectHeader } from './_components/project-header'
import { RequiredTools } from './_components/required-tools'
import { VerifiedCountWithDetails } from './_components/verified-count-with-details'
import { Verifiers } from './_components/verifiers'
import type { ZkCatalogProjectDetails } from './_utils/get-zk-catalog-project-details'

export function ZkCatalogProjectPage({
  projectDetails,
}: { projectDetails: ZkCatalogProjectDetails }) {
  return (
    <main>
      <MainPageHeader>
        <Breadcrumbs
          items={[
            { content: 'ZK Catalog', href: '/zk-catalog' },
            {
              content: (
                <span className="flex items-center gap-1.5">
                  <Image
                    alt={`${projectDetails.title} logo`}
                    width={16}
                    height={16}
                    src={projectDetails.icon}
                    className="inline size-4"
                  />
                  <span className="leading-none">{projectDetails.title}</span>
                </span>
              ),
            },
          ]}
        />
      </MainPageHeader>
      <div className="border-divider max-lg:pt-8 max-md:border-b max-md:bg-header-primary max-md:px-4 max-md:pb-6">
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:gap-4 md:px-6">
          <ProjectHeader
            icon={projectDetails.icon}
            title={projectDetails.title}
          />
          {projectDetails.linkToMainProjectDetails && (
            <CustomLink
              className="text-sm"
              href={projectDetails.linkToMainProjectDetails}
            >
              View project&apos;s detail page
            </CustomLink>
          )}
        </div>
        <Summary details={projectDetails} />
      </div>
      <div className="md:mt-6 md:space-y-6">
        <Section title="List of verifiers">
          <Verifiers items={projectDetails.verifiers} />
        </Section>
        {projectDetails.description && (
          <Section title="Description">
            <p className="mb-2">{projectDetails.shortDescription}</p>
            <Markdown className="zk-description">
              {projectDetails.description}
            </Markdown>
          </Section>
        )}
        {projectDetails.requiredTools.length > 0 && (
          <Section title="List of required tools">
            <RequiredTools items={projectDetails.requiredTools} />
          </Section>
        )}
      </div>
    </main>
  )
}

function Summary(props: {
  details: ZkCatalogProjectDetails
}) {
  return (
    <div className="mt-6 flex grid-cols-3 flex-col gap-1 md:mt-8 md:grid md:rounded-xl md:bg-surface-primary md:p-6">
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
      <h3 className="flex items-center gap-1.5 text-xs text-secondary md:mb-2">
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
    <PrimaryCard>
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      {children}
    </PrimaryCard>
  )
}
