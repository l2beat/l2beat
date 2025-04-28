import { AboutUsPage } from './about/AboutUsPage'
import { BridgesArchivedPage } from './bridges/archived/BridgesArchivedPage'
import { BridgesProjectPage } from './bridges/project/BridgesProjectPage'
import { BridgesRiskPage } from './bridges/risk/BridgesRiskPage'
import { BridgesSummaryPage } from './bridges/summary/BridgesSummaryPage'
import { DaRiskFrameworkPage } from './da-risk-framework/DaRiskFrameworkPage'
import { DataAvailabilityProjectPage } from './data-availability/project/DataAvailabilityProjectPage'
import { DataAvailabilityRiskPage } from './data-availability/risk/DataAvailabilityRiskPage'
import { DataAvailabilitySummaryPage } from './data-availability/summary/DataAvailabilitySummaryPage'
import { DataAvailabilityThroughputPage } from './data-availability/throughput/DataAvailabilityThroughputPage'
import { DonatePage } from './donate/DonatePage'
import { EcosystemProjectPage } from './ecosystems/project/EcosystemProjectPage'
import { FaqPage } from './faq/FaqPage'
import { GlossaryPage } from './glossary/GlossaryPage'
import { GovernancePage } from './governance/GovernancePage'
import { GovernancePublicationPage } from './governance/publication/GovernancePublicationPage'
import { GovernancePublicationsPage } from './governance/publications/GovernancePublicationsPage'
import { MultisigReportPage } from './multisig-report/MultisigReportPage'
import { ScalingActivityPage } from './scaling/activity/ScalingActivityPage'
import { ScalingArchivedPage } from './scaling/archived/ScalingArchivedPage'
import { ScalingCostsPage } from './scaling/costs/ScalingCostsPage'
import { ScalingDataAvailabilityPage } from './scaling/data-availability/ScalingDataAvailabilityPage'
import { ScalingFinalityPage } from './scaling/finality/ScalingFinalityPage'
import { ScalingLivenessPage } from './scaling/liveness/ScalingLivenessPage'
import { ScalingProjectPage } from './scaling/project/ScalingProjectPage'
import { ScalingProjectTvsBreakdownPage } from './scaling/project/tvs-breakdown/ScalingProjectTvsBreakdownPage'
import { ScalingRiskPage } from './scaling/risk/ScalingRiskPage'
import { ScalingSummaryPage } from './scaling/summary/ScalingSummaryPage'
import { ScalingTvsPage } from './scaling/tvs/ScalingTvsPage'
import { ScalingUpcomingPage } from './scaling/upcoming/ScalingUpcomingPage'
import { ZkCatalogPage } from './zk-catalog/ZkCatalogPage'
import { ZkCatalogProjectPage } from './zk-catalog/project/ZkCatalogProjectPage'
export type Pages = typeof pages

export type SsrData = {
  [K in keyof Pages]: {
    page: K
    props: Parameters<Pages[K]>[0]
  }
}[keyof Pages]

const pages = {
  // Scaling
  ScalingSummaryPage,
  ScalingRiskPage,
  ScalingTvsPage,
  ScalingActivityPage,
  ScalingDataAvailabilityPage,
  ScalingLivenessPage,
  ScalingFinalityPage,
  ScalingCostsPage,
  ScalingArchivedPage,
  ScalingUpcomingPage,
  ScalingProjectPage,
  ScalingProjectTvsBreakdownPage,
  // Bridges
  BridgesSummaryPage,
  BridgesRiskPage,
  BridgesArchivedPage,
  BridgesProjectPage,
  // Data Availability
  DataAvailabilitySummaryPage,
  DataAvailabilityRiskPage,
  DataAvailabilityThroughputPage,
  DataAvailabilityProjectPage,
  // ZK Catalog
  ZkCatalogPage,
  ZkCatalogProjectPage,
  // Ecosystems
  EcosystemProjectPage,
  // Governance
  GovernancePage,
  GovernancePublicationsPage,
  GovernancePublicationPage,
  // Side pages
  FaqPage,
  GlossaryPage,
  AboutUsPage,
  DonatePage,
  DaRiskFrameworkPage,
  MultisigReportPage,
}

export function ClientPageRouter({ ssrData }: { ssrData: SsrData }) {
  const Page = pages[ssrData.page]
  // @ts-expect-error TypeScript is not smart enough yet
  return <Page {...ssrData.props} />
}
