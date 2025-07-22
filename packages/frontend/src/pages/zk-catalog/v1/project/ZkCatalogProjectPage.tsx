import type { ReactNode } from 'react'
import { Breadcrumbs } from '~/components/Breadcrumbs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { CustomLink } from '~/components/link/CustomLink'
import { MainPageHeader } from '~/components/MainPageHeader'
import { Markdown } from '~/components/markdown/Markdown'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { InfoIcon } from '~/icons/Info'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ProjectHeader } from './components/ProjectHeader'
import { RequiredTools } from './components/RequiredTools'
import { VerifiedCountWithDetails } from './components/VerifiedCountWithDetails'
import { Verifiers } from './components/Verifiers'
import type { ZkCatalogProjectDetails } from './utils/getZkCatalogProjectDetails'

interface Props extends AppLayoutProps {
  projectDetails: ZkCatalogProjectDetails
}

export function ZkCatalogProjectPage({ projectDetails, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <main>
          <MainPageHeader>
            <Breadcrumbs
              items={[
                { content: 'ZK Catalog', href: '/zk-catalog' },
                {
                  content: (
                    <span className="flex items-center gap-1.5">
                      <img
                        alt={`${projectDetails.title} logo`}
                        width={16}
                        height={16}
                        src={projectDetails.icon}
                        className="inline size-4"
                      />
                      <span className="leading-none">
                        {projectDetails.title}
                      </span>
                    </span>
                  ),
                },
              ]}
            />
          </MainPageHeader>
          <div className="border-divider max-md:border-b max-md:bg-header-primary max-md:px-4 max-md:pb-6 max-lg:pt-8">
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
      </SideNavLayout>
    </AppLayout>
  )
}

function Summary(props: { details: ZkCatalogProjectDetails }) {
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
      <h3 className="flex items-center gap-1.5 text-secondary text-xs md:mb-2">
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
      <span className="font-bold text-lg">{children}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PrimaryCard>
      <h2 className="mb-4 font-bold text-2xl">{title}</h2>
      {children}
    </PrimaryCard>
  )
}
