import { AboutUsPage } from './about/AboutUsPage'
import { BridgesArchivedPage } from './bridges/archived/BridgesArchivedPage'
import { BridgesProjectPage } from './bridges/project/BridgesProjectPage'
import { BridgesSummaryPage } from './bridges/summary/BridgesSummaryPage'
import { DaRiskFrameworkPage } from './da-risk-framework/DaRiskFrameworkPage'
import { DataAvailabilityArchivedPage } from './data-availability/archived/DataAvailabilityArchivedPage'
import { DataAvailabilityLivenessPage } from './data-availability/liveness/DataAvailabilityLivenessPage'
import { DataAvailabilityProjectPage } from './data-availability/project/DataAvailabilityProjectPage'
import { DataAvailabilityRiskPage } from './data-availability/risk/DataAvailabilityRiskPage'
import { DataAvailabilitySummaryPage } from './data-availability/summary/DataAvailabilitySummaryPage'
import { DataAvailabilityThroughputPage } from './data-availability/throughput/DataAvailabilityThroughputPage'
import { DonatePage } from './donate/DonatePage'
import { EcosystemProjectPage } from './ecosystems/project/EcosystemProjectPage'
import { FaqPage } from './faq/FaqPage'
import { GlossaryPage } from './glossary/GlossaryPage'
import { EthereumConnectPage } from './governance/ethereum-connect/EthereumConnectPage'
import { GovernancePage } from './governance/GovernancePage'
import { MultisigReportPage } from './multisig-report/MultisigReportPage'
import { GovernancePublicationPage } from './publications/governance/GovernancePublicationPage'
import { MonthlyUpdatePage } from './publications/monthly-updates/MonthlyUpdatePage'
import { PublicationsPage } from './publications/PublicationsPage'
import { ScalingActivityPage } from './scaling/activity/ScalingActivityPage'
import { ScalingArchivedPage } from './scaling/archived/ScalingArchivedPage'
import { ScalingCostsPage } from './scaling/costs/ScalingCostsPage'
import { ScalingDataAvailabilityPage } from './scaling/data-availability/ScalingDataAvailabilityPage'
import { ScalingLivenessPage } from './scaling/liveness/ScalingLivenessPage'
import { ScalingProjectPage } from './scaling/project/ScalingProjectPage'
import { ScalingProjectTvsBreakdownPage } from './scaling/project/tvs-breakdown/ScalingProjectTvsBreakdownPage'
import { ScalingRiskPage } from './scaling/risk/ScalingRiskPage'
import { ScalingRiskStateValidationPage } from './scaling/risk/state-validation/ScalingRiskStateValidationPage'
import { ScalingSummaryPage } from './scaling/summary/ScalingSummaryPage'
import { ScalingTvsBreakdownPage } from './scaling/tvs/breakdown/ScalingTvsBreakdownPage'
import { ScalingTvsPage } from './scaling/tvs/ScalingTvsPage'
import { ScalingUpcomingPage } from './scaling/upcoming/ScalingUpcomingPage'
import { StagesPage } from './stages/StagesPage'
import { TermsOfServicePage } from './terms-of-service/TermsOfServicePage'
import { ZkCatalogV1ProjectPage } from './zk-catalog/v1/project/ZkCatalogV1ProjectPage'
import { ZkCatalogPageV1 } from './zk-catalog/v1/ZkCatalogPageV1'
import { ZkCatalogProjectPage } from './zk-catalog/v2/project/ZkCatalogProjectPage'
import { ZkCatalogPage } from './zk-catalog/v2/ZkCatalogPage'

type Pages = typeof pages

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
  ScalingTvsBreakdownPage,
  ScalingActivityPage,
  ScalingDataAvailabilityPage,
  ScalingLivenessPage,
  ScalingCostsPage,
  ScalingArchivedPage,
  ScalingUpcomingPage,
  ScalingProjectPage,
  ScalingProjectTvsBreakdownPage,
  ScalingRiskStateValidationPage,
  // Bridges
  BridgesSummaryPage,
  BridgesArchivedPage,
  BridgesProjectPage,
  // Data Availability
  DataAvailabilitySummaryPage,
  DataAvailabilityRiskPage,
  DataAvailabilityThroughputPage,
  DataAvailabilityLivenessPage,
  DataAvailabilityProjectPage,
  DataAvailabilityArchivedPage,
  // ZK Catalog
  ZkCatalogPage,
  ZkCatalogPageV1,
  ZkCatalogV1ProjectPage,
  ZkCatalogProjectPage,
  // Ecosystems
  EcosystemProjectPage,
  // Governance
  GovernancePage,
  EthereumConnectPage,
  GovernancePublicationPage,
  // Side pages
  FaqPage,
  GlossaryPage,
  AboutUsPage,
  DonatePage,
  DaRiskFrameworkPage,
  MultisigReportPage,
  TermsOfServicePage,
  StagesPage,
  // Monthly Updates
  MonthlyUpdatePage,
  // Publications
  PublicationsPage,
}

export function ClientPageRouter({ ssrData }: { ssrData: SsrData }) {
  const Page = pages[ssrData.page]
  // @ts-expect-error TypeScript is not smart enough yet
  return <Page {...ssrData.props} />
}
