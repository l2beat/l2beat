export const pageLoaders = {
  IconPreviewPage: async () =>
    (await import('./dev/icons/IconPreviewPage')).IconPreviewPage,
  HomePage: async () => (await import('./home/HomePage')).HomePage,
  Layer2sSummaryPage: async () =>
    (await import('./layer2s/summary/Layer2sSummaryPage')).Layer2sSummaryPage,
  Layer2sRiskPage: async () =>
    (await import('./layer2s/risk/Layer2sRiskPage')).Layer2sRiskPage,
  Layer2sTvsPage: async () =>
    (await import('./layer2s/tvs/Layer2sTvsPage')).Layer2sTvsPage,
  Layer2sTvsBreakdownPage: async () =>
    (await import('./layer2s/tvs/breakdown/Layer2sTvsBreakdownPage'))
      .Layer2sTvsBreakdownPage,
  Layer2sActivityPage: async () =>
    (await import('./layer2s/activity/Layer2sActivityPage'))
      .Layer2sActivityPage,
  Layer2sRiskDataAvailabilityPage: async () =>
    (
      await import(
        './layer2s/risk/data-availability/Layer2sRiskDataAvailabilityPage'
      )
    ).Layer2sRiskDataAvailabilityPage,
  Layer2sRiskSequencingPage: async () =>
    (await import('./layer2s/risk/sequencing/Layer2sRiskSequencingPage'))
      .Layer2sRiskSequencingPage,
  Layer2sLivenessPage: async () =>
    (await import('./layer2s/liveness/Layer2sLivenessPage'))
      .Layer2sLivenessPage,
  Layer2sCostsPage: async () =>
    (await import('./layer2s/costs/Layer2sCostsPage')).Layer2sCostsPage,
  Layer2sArchivedPage: async () =>
    (await import('./layer2s/archived/Layer2sArchivedPage'))
      .Layer2sArchivedPage,
  Layer2sProjectPage: async () =>
    (await import('./layer2s/project/Layer2sProjectPage')).Layer2sProjectPage,
  Layer2sProjectTvsBreakdownPage: async () =>
    (
      await import(
        './layer2s/project/tvs-breakdown/Layer2sProjectTvsBreakdownPage'
      )
    ).Layer2sProjectTvsBreakdownPage,
  Layer2sRiskStateValidationPage: async () =>
    (
      await import(
        './layer2s/risk/state-validation/Layer2sRiskStateValidationPage'
      )
    ).Layer2sRiskStateValidationPage,
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
