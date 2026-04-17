import { Banner } from '~/components/Banner'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import { DesktopProjectNavigation } from '~/components/projects/navigation/DesktopProjectNavigation'
import type { ProjectNavigationSection } from '~/components/projects/navigation/types'
import { ProjectHeader } from '~/components/projects/ProjectHeader'
import { ProjectSummaryBars } from '~/components/projects/ProjectSummaryBars'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import { ContractsSection } from '~/components/projects/sections/contracts/ContractsSection'
import { MarkdownSection } from '~/components/projects/sections/MarkdownSection'
import { ProjectSection } from '~/components/projects/sections/ProjectSection'
import { PermissionsSection } from '~/components/projects/sections/permissions/PermissionsSection'
import { TrustedSetupSection } from '~/components/projects/sections/TrustedSetupsSection'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { MobileSectionNavigation } from '~/components/section-navigation/MobileSectionNavigation'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { PrivacyDepositsBreakdownTable } from './components/PrivacyDepositsBreakdownTable'
import { PrivacyProjectStats } from './components/PrivacyProjectStats'
import { PrivacyValueBreakdownTable } from './components/PrivacyValueBreakdownTable'
import type { PrivacyProjectEntry } from './getPrivacyProjectData'

interface Props extends AppLayoutProps {
  entry: PrivacyProjectEntry
}

export function PrivacyProjectPage({ entry, ...props }: Props) {
  const navigationSections = getNavigationSections(entry)
  const bucketCount = entry.assets.reduce(
    (sum, asset) => sum + asset.bucketCount,
    0,
  )
  const protocolDescription = entry.detailedDescription ?? ''
  const hasProtocolDescription = !!entry.detailedDescription

  return (
    <AppLayout {...props}>
      <SideNavLayout childrenWrapperClassName="md:pt-0">
        <div
          className="smooth-scroll group/section-wrapper relative z-0 max-md:bg-surface-primary"
          data-project-page
        >
          <div className="relative z-0 max-md:bg-surface-primary">
            <div className="grid-cols-[minmax(0,_1fr)_180px] gap-x-6 lg:grid">
              <div className="pt-6 max-md:px-4 lg:pt-4">
                <ProjectHeader project={entry} />
                <ProjectSummaryBars
                  project={{
                    underReviewStatus: entry.isUnderReview
                      ? 'config'
                      : undefined,
                    header: {
                      warning: entry.warnings.yellow,
                      redWarning: entry.warnings.red,
                      emergencyWarning: entry.warnings.emergency,
                    },
                  }}
                />
                <div className="mb-3 max-md:hidden">
                  <DesktopProjectLinks
                    projectLinks={entry.projectLinks}
                    discoUiHref={entry.discoveryHref}
                  />
                </div>
              </div>

              <div className="row-start-2 w-full">
                <div className="md:-mx-(--tablet-content-horizontal-padding) sticky top-0 z-100 lg:hidden">
                  <MobileSectionNavigation sections={navigationSections} />
                </div>
                <HighlightableLinkContextProvider>
                  <PrimaryCard
                    id="summary"
                    data-role="nav-section"
                    className="space-y-6 max-md:rounded-none md:mt-2"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-3xl space-y-3">
                        <div>
                          <div className="font-semibold text-secondary text-subtitle-12 uppercase">
                            About
                          </div>
                          <p className="mt-2 text-paragraph-15 text-primary md:text-paragraph-16">
                            {entry.description}
                          </p>
                        </div>
                        <div className="text-paragraph-14 text-secondary">
                          {entry.assets.length} tracked assets across{' '}
                          {formatInteger(bucketCount)} buckets.
                        </div>
                      </div>
                    </div>
                    <PrivacyProjectStats
                      totalValueSecuredUsd={entry.summary.totalValueSecuredUsd}
                      deposits={entry.summary.deposits}
                    />
                    {entry.badges.length > 0 && (
                      <BadgesSection
                        badges={entry.badges}
                        className="lg:min-w-0"
                      />
                    )}
                    {entry.unpricedAssets.length > 0 && (
                      <Banner type="warning">
                        {`USD totals exclude ${entry.unpricedAssets.join(', ')} because a demo price is not available.`}
                      </Banner>
                    )}
                  </PrimaryCard>

                  {hasProtocolDescription && (
                    <MarkdownSection
                      id="detailed-description"
                      title="Protocol description"
                      sectionOrder="01"
                      content={protocolDescription}
                    />
                  )}

                  <ProjectSection
                    id="tvs"
                    title="Value Secured Breakdown"
                    sectionOrder={hasProtocolDescription ? '02' : '01'}
                  >
                    <PrivacyValueBreakdownTable assets={entry.assets} />
                  </ProjectSection>

                  <ProjectSection
                    id="activity"
                    title="Deposits Breakdown"
                    sectionOrder={hasProtocolDescription ? '03' : '02'}
                  >
                    <PrivacyDepositsBreakdownTable assets={entry.assets} />
                  </ProjectSection>

                  <TrustedSetupSection
                    id="trusted-setups"
                    title="Trusted Setup"
                    sectionOrder={hasProtocolDescription ? '04' : '03'}
                    trustedSetups={[
                      {
                        name: entry.trustedSetup.name,
                        risk: entry.trustedSetup.risk,
                        description: entry.trustedSetup.description,
                        proofSystems: [],
                      },
                    ]}
                  />

                  {entry.permissionsSection && (
                    <PermissionsSection
                      {...entry.permissionsSection}
                      id="permissions"
                      title="Permissions"
                      sectionOrder={hasProtocolDescription ? '05' : '04'}
                      discoUi={entry.discoUi}
                    />
                  )}

                  {entry.contractsSection && (
                    <ContractsSection
                      {...entry.contractsSection}
                      id="contracts"
                      title="Smart contracts"
                      sectionOrder={
                        hasProtocolDescription
                          ? entry.permissionsSection
                            ? '06'
                            : '05'
                          : entry.permissionsSection
                            ? '05'
                            : '04'
                      }
                      discoUi={entry.discoUi}
                    />
                  )}
                </HighlightableLinkContextProvider>
              </div>

              <div className="row-start-2 mt-2 hidden shrink-0 lg:block">
                <DesktopProjectNavigation
                  project={{
                    title: entry.shortName ?? entry.name,
                    slug: entry.slug,
                    isUnderReview: entry.isUnderReview,
                    icon: entry.icon,
                  }}
                  sections={navigationSections}
                />
              </div>
            </div>
          </div>
          <ScrollToTopButton />
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}

function getNavigationSections(
  entry: PrivacyProjectEntry,
): ProjectNavigationSection[] {
  return [
    {
      id: 'summary',
      title: 'Summary',
    },
    ...(entry.detailedDescription
      ? [
          {
            id: 'detailed-description',
            title: 'Protocol description',
          },
        ]
      : []),
    {
      id: 'tvs',
      title: 'Value Secured',
    },
    {
      id: 'activity',
      title: 'Deposits',
    },
    {
      id: 'trusted-setups',
      title: 'Trusted Setup',
    },
    ...(entry.permissionsSection
      ? [
          {
            id: 'permissions',
            title: 'Permissions',
          },
        ]
      : []),
    ...(entry.contractsSection
      ? [
          {
            id: 'contracts',
            title: 'Smart contracts',
          },
        ]
      : []),
  ]
}
