import type { DehydratedState } from '@tanstack/react-query'
import { HydrationBoundary } from '@tanstack/react-query'
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
import type { ProjectSectionId } from '~/components/projects/sections/types'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { MobileSectionNavigation } from '~/components/section-navigation/MobileSectionNavigation'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { ChartRange } from '~/utils/range/range'
import { PrivacyBreakdownTable } from './components/PrivacyBreakdownTable'
import { PrivacyChartsSection } from './components/PrivacyChartsSection'
import { PrivacyProjectStats } from './components/PrivacyProjectStats'
import type { PrivacyProjectEntry } from './getPrivacyProjectData'

interface Props extends AppLayoutProps {
  entry: PrivacyProjectEntry
  defaultChartRange: ChartRange
  queryState: DehydratedState
}

export function PrivacyProjectPage({
  entry,
  defaultChartRange,
  queryState,
  ...props
}: Props) {
  const navigationSections = getNavigationSections(entry)
  const bucketCount = entry.assets.reduce(
    (sum, asset) => sum + asset.bucketCount,
    0,
  )
  const hasRiskSummary = !!entry.riskSummary
  const hasUpgradesAndGovernance = !!entry.upgradesAndGovernance

  let order = 0
  const nextOrder = () => String(++order).padStart(2, '0')
  const riskSummaryOrder = hasRiskSummary ? nextOrder() : undefined
  const upgradesAndGovernanceOrder = hasUpgradesAndGovernance
    ? nextOrder()
    : undefined
  const chartsOrder = nextOrder()
  const trustedSetupsOrder = nextOrder()
  const permissionsOrder = entry.permissionsSection ? nextOrder() : undefined
  const contractsOrder = entry.contractsSection ? nextOrder() : undefined

  return (
    <AppLayout {...props}>
      <HydrationBoundary state={queryState}>
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
                        </div>
                      </div>
                      <PrivacyProjectStats
                        totalValueSecuredUsd={
                          entry.summary.totalValueSecuredUsd
                        }
                        assetsCount={entry.assets.length}
                        bucketsCount={bucketCount}
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
                          {`USD totals exclude ${entry.unpricedAssets.join(', ')} because a price is not available.`}
                        </Banner>
                      )}
                    </PrimaryCard>

                    {hasRiskSummary &&
                      entry.riskSummary &&
                      riskSummaryOrder && (
                        <MarkdownSection
                          id="risk-summary"
                          title="Risk summary"
                          sectionOrder={riskSummaryOrder}
                          content={entry.riskSummary}
                          mdClassName="[&_h2]:mb-0 [&_h2]:font-bold [&_h2]:text-red-300 [&_h2]:text-paragraph-15 md:[&_h2]:text-paragraph-16 [&_ol]:mb-0 [&_ol]:list-inside [&_ol]:pl-1.5 [&_li]:ml-0"
                        />
                      )}

                    {hasUpgradesAndGovernance &&
                      entry.upgradesAndGovernance &&
                      upgradesAndGovernanceOrder && (
                        <MarkdownSection
                          id="upgrades-and-governance"
                          title="Upgrades & Governance"
                          sectionOrder={upgradesAndGovernanceOrder}
                          content={entry.upgradesAndGovernance}
                        />
                      )}

                    <ProjectSection
                      id={'charts' as unknown as ProjectSectionId}
                      title="Value Locked"
                      sectionOrder={chartsOrder}
                    >
                      <PrivacyChartsSection
                        defaultRange={defaultChartRange}
                        project={{
                          id: entry.id,
                          name: entry.name,
                          shortName: entry.shortName,
                          iconUrl: entry.icon,
                        }}
                      />
                      <div className="mt-8">
                        <h3 className="mb-3 font-bold text-lg md:text-xl">
                          Assets Breakdown
                        </h3>
                        <PrivacyBreakdownTable assets={entry.assets} />
                      </div>
                    </ProjectSection>

                    <TrustedSetupSection
                      id="trusted-setups"
                      title="Trusted setup"
                      sectionOrder={trustedSetupsOrder}
                      trustedSetups={[
                        {
                          name: entry.trustedSetup.name,
                          risk: entry.trustedSetup.risk,
                          description: entry.trustedSetup.longDescription,
                          proofSystems: [],
                        },
                      ]}
                    />

                    {entry.permissionsSection && permissionsOrder && (
                      <PermissionsSection
                        {...entry.permissionsSection}
                        id="permissions"
                        title="Permissions"
                        sectionOrder={permissionsOrder}
                        discoUi={entry.discoUi}
                      />
                    )}

                    {entry.contractsSection && contractsOrder && (
                      <ContractsSection
                        {...entry.contractsSection}
                        id="contracts"
                        title="Smart contracts"
                        sectionOrder={contractsOrder}
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
      </HydrationBoundary>
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
    ...(entry.riskSummary
      ? [
          {
            id: 'risk-summary',
            title: 'Risk summary',
          },
        ]
      : []),
    ...(entry.upgradesAndGovernance
      ? [
          {
            id: 'upgrades-and-governance',
            title: 'Upgrades & Governance',
          },
        ]
      : []),
    {
      id: 'charts',
      title: 'Value Locked',
    },
    {
      id: 'trusted-setups',
      title: 'Trusted setup',
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
