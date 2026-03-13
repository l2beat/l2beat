export const pageLoaders = {
  ScalingSummaryPage: async () =>
    (await import('./scaling/summary/ScalingSummaryPage')).ScalingSummaryPage,
  ScalingRiskPage: async () =>
    (await import('./scaling/risk/ScalingRiskPage')).ScalingRiskPage,
  ScalingTvsPage: async () =>
    (await import('./scaling/tvs/ScalingTvsPage')).ScalingTvsPage,
  ScalingTvsBreakdownPage: async () =>
    (await import('./scaling/tvs/breakdown/ScalingTvsBreakdownPage'))
      .ScalingTvsBreakdownPage,
  ScalingActivityPage: async () =>
    (await import('./scaling/activity/ScalingActivityPage'))
      .ScalingActivityPage,
  ScalingDataAvailabilityPage: async () =>
    (await import('./scaling/data-availability/ScalingDataAvailabilityPage'))
      .ScalingDataAvailabilityPage,
  ScalingLivenessPage: async () =>
    (await import('./scaling/liveness/ScalingLivenessPage'))
      .ScalingLivenessPage,
  ScalingCostsPage: async () =>
    (await import('./scaling/costs/ScalingCostsPage')).ScalingCostsPage,
  ScalingArchivedPage: async () =>
    (await import('./scaling/archived/ScalingArchivedPage'))
      .ScalingArchivedPage,
  ScalingUpcomingPage: async () =>
    (await import('./scaling/upcoming/ScalingUpcomingPage'))
      .ScalingUpcomingPage,
  ScalingProjectPage: async () =>
    (await import('./scaling/project/ScalingProjectPage')).ScalingProjectPage,
  ScalingProjectTvsBreakdownPage: async () =>
    (
      await import(
        './scaling/project/tvs-breakdown/ScalingProjectTvsBreakdownPage'
      )
    ).ScalingProjectTvsBreakdownPage,
  ScalingRiskStateValidationPage: async () =>
    (
      await import(
        './scaling/risk/state-validation/ScalingRiskStateValidationPage'
      )
    ).ScalingRiskStateValidationPage,
  InteropSummaryPage: async () =>
    (await import('./interop/summary/InteropSummaryPage')).InteropSummaryPage,
  InteropNonMintingPage: async () =>
    (await import('./interop/non-minting/InteropNonMintingPage'))
      .InteropNonMintingPage,
  InteropLockAndMintPage: async () =>
    (await import('./interop/lock-and-mint/InteropLockAndMintPage'))
      .InteropLockAndMintPage,
  InteropBurnAndMintPage: async () =>
    (await import('./interop/burn-and-mint/InteropBurnAndMintPage'))
      .InteropBurnAndMintPage,
  InteropProtocolPage: async () =>
    (await import('./interop/protocol/InteropProtocolPage'))
      .InteropProtocolPage,
  DataAvailabilitySummaryPage: async () =>
    (await import('./data-availability/summary/DataAvailabilitySummaryPage'))
      .DataAvailabilitySummaryPage,
  DataAvailabilityRiskPage: async () =>
    (await import('./data-availability/risk/DataAvailabilityRiskPage'))
      .DataAvailabilityRiskPage,
  DataAvailabilityThroughputPage: async () =>
    (
      await import(
        './data-availability/throughput/DataAvailabilityThroughputPage'
      )
    ).DataAvailabilityThroughputPage,
  DataAvailabilityLivenessPage: async () =>
    (await import('./data-availability/liveness/DataAvailabilityLivenessPage'))
      .DataAvailabilityLivenessPage,
  DataAvailabilityProjectPage: async () =>
    (await import('./data-availability/project/DataAvailabilityProjectPage'))
      .DataAvailabilityProjectPage,
  DataAvailabilityArchivedPage: async () =>
    (await import('./data-availability/archived/DataAvailabilityArchivedPage'))
      .DataAvailabilityArchivedPage,
  ZkCatalogPage: async () =>
    (await import('./zk-catalog/v2/ZkCatalogPage')).ZkCatalogPage,
  ZkCatalogProjectPage: async () =>
    (await import('./zk-catalog/v2/project/ZkCatalogProjectPage'))
      .ZkCatalogProjectPage,
  EcosystemProjectPage: async () =>
    (await import('./ecosystems/project/EcosystemProjectPage'))
      .EcosystemProjectPage,
  GovernancePage: async () =>
    (await import('./governance/GovernancePage')).GovernancePage,
  EthereumConnectPage: async () =>
    (await import('./governance/ethereum-connect/EthereumConnectPage'))
      .EthereumConnectPage,
  GovernancePublicationPage: async () =>
    (await import('./publications/governance/GovernancePublicationPage'))
      .GovernancePublicationPage,
  FaqPage: async () => (await import('./faq/FaqPage')).FaqPage,
  GlossaryPage: async () =>
    (await import('./glossary/GlossaryPage')).GlossaryPage,
  AboutUsPage: async () => (await import('./about/AboutUsPage')).AboutUsPage,
  ChangelogPage: async () =>
    (await import('./changelog/ChangelogPage')).ChangelogPage,
  DonatePage: async () => (await import('./donate/DonatePage')).DonatePage,
  DaRiskFrameworkPage: async () =>
    (await import('./da-risk-framework/DaRiskFrameworkPage'))
      .DaRiskFrameworkPage,
  MultisigReportPage: async () =>
    (await import('./multisig-report/MultisigReportPage')).MultisigReportPage,
  TermsOfServicePage: async () =>
    (await import('./terms-of-service/TermsOfServicePage')).TermsOfServicePage,
  StagesPage: async () => (await import('./stages/StagesPage')).StagesPage,
  MonthlyUpdatePage: async () =>
    (await import('./publications/monthly-updates/MonthlyUpdatePage'))
      .MonthlyUpdatePage,
  PublicationsPage: async () =>
    (await import('./publications/PublicationsPage')).PublicationsPage,
}

export async function getPage<K extends keyof typeof pageLoaders>(
  page: K,
): Promise<Awaited<ReturnType<(typeof pageLoaders)[K]>>> {
  const loadPage = pageLoaders[page] as () => Promise<
    Awaited<ReturnType<(typeof pageLoaders)[K]>>
  >

  return await loadPage()
}
