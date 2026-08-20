export const pageLoaders = {
  IconPreviewPage: async () =>
    (await import('./dev/icons/IconPreviewPage')).IconPreviewPage,
  HomePage: async () => (await import('./home/HomePage')).HomePage,
  L2SummaryPage: async () =>
    (await import('./layer2s/summary/L2SummaryPage')).L2SummaryPage,
  L2RiskPage: async () =>
    (await import('./layer2s/risk/L2RiskPage')).L2RiskPage,
  L2TvsPage: async () => (await import('./layer2s/tvs/L2TvsPage')).L2TvsPage,
  L2TvsBreakdownPage: async () =>
    (await import('./layer2s/tvs/breakdown/L2TvsBreakdownPage'))
      .L2TvsBreakdownPage,
  L2ActivityPage: async () =>
    (await import('./layer2s/activity/L2ActivityPage')).L2ActivityPage,
  L2RiskDataAvailabilityPage: async () =>
    (
      await import(
        './layer2s/risk/data-availability/L2RiskDataAvailabilityPage'
      )
    ).L2RiskDataAvailabilityPage,
  L2RiskSequencingPage: async () =>
    (await import('./layer2s/risk/sequencing/L2RiskSequencingPage'))
      .L2RiskSequencingPage,
  SecurityPage: async () =>
    (await import('./security/SecurityPage')).SecurityPage,
  L2LivenessPage: async () =>
    (await import('./layer2s/liveness/L2LivenessPage')).L2LivenessPage,
  L2CostsPage: async () =>
    (await import('./layer2s/costs/L2CostsPage')).L2CostsPage,
  L2ArchivedPage: async () =>
    (await import('./layer2s/archived/L2ArchivedPage')).L2ArchivedPage,
  L2ProjectPage: async () =>
    (await import('./layer2s/project/L2ProjectPage')).L2ProjectPage,
  L2ProjectTvsBreakdownPage: async () =>
    (await import('./layer2s/project/tvs-breakdown/L2ProjectTvsBreakdownPage'))
      .L2ProjectTvsBreakdownPage,
  L2RiskStateValidationPage: async () =>
    (await import('./layer2s/risk/state-validation/L2RiskStateValidationPage'))
      .L2RiskStateValidationPage,
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
  InteropTokenPage: async () =>
    (await import('./interop/token/InteropTokenPage')).InteropTokenPage,
  InteropTokenFrameworksPage: async () =>
    (await import('./interop/token-frameworks/InteropTokenFrameworksPage'))
      .InteropTokenFrameworksPage,
  InteropIntentBridgesPage: async () =>
    (await import('./interop/intent-bridges/InteropIntentBridgesPage'))
      .InteropIntentBridgesPage,
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
  PrivacySummaryPage: async () =>
    (await import('./privacy/summary/PrivacySummaryPage')).PrivacySummaryPage,
  PrivacyProjectPage: async () =>
    (await import('./privacy/project/PrivacyProjectPage')).PrivacyProjectPage,
  DefiSummaryPage: async () =>
    (await import('./defi/summary/DefiSummaryPage')).DefiSummaryPage,
  DefiProjectPage: async () =>
    (await import('./defi/project/DefiProjectPage')).DefiProjectPage,
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
  NativeRollupsPage: async () =>
    (await import('./native-rollups/NativeRollupsPage')).NativeRollupsPage,
  EthereumConnectPage: async () =>
    (await import('./governance/ethereum-connect/EthereumConnectPage'))
      .EthereumConnectPage,
  PublicationPage: async () =>
    (await import('./publications/PublicationPage')).PublicationPage,
  FaqPage: async () => (await import('./faq/FaqPage')).FaqPage,
  GlossaryPage: async () =>
    (await import('./glossary/GlossaryPage')).GlossaryPage,
  AboutUsPage: async () => (await import('./about/AboutUsPage')).AboutUsPage,
  BrandKitPage: async () =>
    (await import('./brand-kit/BrandKitPage')).BrandKitPage,
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
