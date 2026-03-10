export type Pages = {
  ScalingSummaryPage: typeof import('./scaling/summary/ScalingSummaryPage').ScalingSummaryPage
  ScalingRiskPage: typeof import('./scaling/risk/ScalingRiskPage').ScalingRiskPage
  ScalingTvsPage: typeof import('./scaling/tvs/ScalingTvsPage').ScalingTvsPage
  ScalingTvsBreakdownPage: typeof import('./scaling/tvs/breakdown/ScalingTvsBreakdownPage').ScalingTvsBreakdownPage
  ScalingActivityPage: typeof import('./scaling/activity/ScalingActivityPage').ScalingActivityPage
  ScalingDataAvailabilityPage: typeof import('./scaling/data-availability/ScalingDataAvailabilityPage').ScalingDataAvailabilityPage
  ScalingLivenessPage: typeof import('./scaling/liveness/ScalingLivenessPage').ScalingLivenessPage
  ScalingCostsPage: typeof import('./scaling/costs/ScalingCostsPage').ScalingCostsPage
  ScalingArchivedPage: typeof import('./scaling/archived/ScalingArchivedPage').ScalingArchivedPage
  ScalingUpcomingPage: typeof import('./scaling/upcoming/ScalingUpcomingPage').ScalingUpcomingPage
  ScalingProjectPage: typeof import('./scaling/project/ScalingProjectPage').ScalingProjectPage
  ScalingProjectTvsBreakdownPage: typeof import('./scaling/project/tvs-breakdown/ScalingProjectTvsBreakdownPage').ScalingProjectTvsBreakdownPage
  ScalingRiskStateValidationPage: typeof import('./scaling/risk/state-validation/ScalingRiskStateValidationPage').ScalingRiskStateValidationPage
  InteropSummaryPage: typeof import('./interop/summary/InteropSummaryPage').InteropSummaryPage
  InteropNonMintingPage: typeof import('./interop/non-minting/InteropNonMintingPage').InteropNonMintingPage
  InteropLockAndMintPage: typeof import('./interop/lock-and-mint/InteropLockAndMintPage').InteropLockAndMintPage
  InteropBurnAndMintPage: typeof import('./interop/burn-and-mint/InteropBurnAndMintPage').InteropBurnAndMintPage
  DataAvailabilitySummaryPage: typeof import('./data-availability/summary/DataAvailabilitySummaryPage').DataAvailabilitySummaryPage
  DataAvailabilityRiskPage: typeof import('./data-availability/risk/DataAvailabilityRiskPage').DataAvailabilityRiskPage
  DataAvailabilityThroughputPage: typeof import('./data-availability/throughput/DataAvailabilityThroughputPage').DataAvailabilityThroughputPage
  DataAvailabilityLivenessPage: typeof import('./data-availability/liveness/DataAvailabilityLivenessPage').DataAvailabilityLivenessPage
  DataAvailabilityProjectPage: typeof import('./data-availability/project/DataAvailabilityProjectPage').DataAvailabilityProjectPage
  DataAvailabilityArchivedPage: typeof import('./data-availability/archived/DataAvailabilityArchivedPage').DataAvailabilityArchivedPage
  ZkCatalogPage: typeof import('./zk-catalog/v2/ZkCatalogPage').ZkCatalogPage
  ZkCatalogProjectPage: typeof import('./zk-catalog/v2/project/ZkCatalogProjectPage').ZkCatalogProjectPage
  EcosystemProjectPage: typeof import('./ecosystems/project/EcosystemProjectPage').EcosystemProjectPage
  GovernancePage: typeof import('./governance/GovernancePage').GovernancePage
  EthereumConnectPage: typeof import('./governance/ethereum-connect/EthereumConnectPage').EthereumConnectPage
  GovernancePublicationPage: typeof import('./publications/governance/GovernancePublicationPage').GovernancePublicationPage
  FaqPage: typeof import('./faq/FaqPage').FaqPage
  GlossaryPage: typeof import('./glossary/GlossaryPage').GlossaryPage
  AboutUsPage: typeof import('./about/AboutUsPage').AboutUsPage
  ChangelogPage: typeof import('./changelog/ChangelogPage').ChangelogPage
  DonatePage: typeof import('./donate/DonatePage').DonatePage
  DaRiskFrameworkPage: typeof import('./da-risk-framework/DaRiskFrameworkPage').DaRiskFrameworkPage
  MultisigReportPage: typeof import('./multisig-report/MultisigReportPage').MultisigReportPage
  TermsOfServicePage: typeof import('./terms-of-service/TermsOfServicePage').TermsOfServicePage
  StagesPage: typeof import('./stages/StagesPage').StagesPage
  MonthlyUpdatePage: typeof import('./publications/monthly-updates/MonthlyUpdatePage').MonthlyUpdatePage
  PublicationsPage: typeof import('./publications/PublicationsPage').PublicationsPage
}

export type PageName = keyof Pages

export type SsrData = {
  [K in PageName]: {
    page: K
    props: Parameters<Pages[K]>[0]
  }
}[PageName]
