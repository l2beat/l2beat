import { AboutUsPage } from './about/AboutUsPage'
import { BridgesArchivedPage } from './bridges/archived/BridgesArchivedPage'
import { BridgesRiskPage } from './bridges/risk/BridgesRiskPage'
import { BridgesSummaryPage } from './bridges/summary/BridgesSummaryPage'
import { DonatePage } from './donate/DonatePage'
import { FaqPage } from './faq/FaqPage'
import { ScalingActivityPage } from './scaling/activity/ScalingActivityPage'
import { ScalingArchivedPage } from './scaling/archived/ScalingArchivedPage'
import { ScalingCostsPage } from './scaling/costs/ScalingCostsPage'
import { ScalingDataAvailabilityPage } from './scaling/data-availability/ScalingDataAvailabilityPage'
import { ScalingFinalityPage } from './scaling/finality/ScalingFinalityPage'
import { ScalingLivenessPage } from './scaling/liveness/ScalingLivenessPage'
import { ScalingRiskPage } from './scaling/risk/ScalingRiskPage'
import { ScalingSummaryPage } from './scaling/summary/ScalingSummaryPage'
import { ScalingTvsPage } from './scaling/tvs/ScalingTvsPage'
import { ScalingUpcomingPage } from './scaling/upcoming/ScalingUpcomingPage'

export type Pages = typeof pages

export type SsrData = {
  [K in keyof Pages]: {
    page: K
    props: Parameters<Pages[K]>[0]
  }
}[keyof Pages]

const pages = {
  FaqPage,
  AboutUsPage,
  DonatePage,
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
  // Bridges
  BridgesSummaryPage,
  BridgesRiskPage,
  BridgesArchivedPage,
}

export function ClientPageRouter({ ssrData }: { ssrData: SsrData }) {
  const Page = pages[ssrData.page]
  // @ts-expect-error TypeScript is not smart enough yet
  return <Page {...ssrData.props} />
}
