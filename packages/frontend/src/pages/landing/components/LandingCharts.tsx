import { HomeEthereumCard } from '~/pages/home/components/HomeEthereumCard'
import { HomeInteropSection } from '~/pages/home/components/HomeInteropSection'
import { HomeL2Card } from '~/pages/home/components/HomeL2Card'
import { HomePrivacyCard } from '~/pages/home/components/HomePrivacyCard'
import type { HomeTopL2Project } from '~/pages/home/getHomeData'
import type { HomeProjectCounts } from '~/pages/home/getHomeProjectCounts'
import { HOME_PATH } from '~/pages/home/paths'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type { InteropFlowsProtocol } from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import type { HomeEthereumCharts } from '~/server/features/home/getHomeEthereumCharts'
import type { HomeL2Charts } from '~/server/features/home/getHomeL2Charts'
import type { HomePrivacyData } from '~/server/features/home/getHomePrivacyData'
import {
  LANDING_CONTAINER_CLASS,
  LANDING_SECTION_LABEL_CLASS,
} from '../landingStyles'
import { LandingSectionHeader } from './LandingSectionHeader'

export interface LandingChartsData {
  projectCounts: HomeProjectCounts
  l2Charts: HomeL2Charts
  topL2Projects: HomeTopL2Project[]
  privacy: HomePrivacyData
  ethereumCharts: HomeEthereumCharts
  interopFlowChains: InteropChainWithIcon[]
  interopDefaultFlowChains: string[]
  flowProtocols: InteropFlowsProtocol[]
}

/**
 * The home page's charts, under everything else and in the landing page's
 * width: Privacy | Layer 2s, then Ethereum | Interop. No CROPS banner, stats
 * or What's new; the sections above already say that. The home cards pad by
 * the page gutter, which is zero here: the container pads instead, and the
 * columns keep 24px either side of the line between them.
 */
export function LandingCharts({ data }: { data: LandingChartsData }) {
  return (
    <section className={`${LANDING_CONTAINER_CLASS} pb-14 md:pb-20`}>
      <LandingSectionHeader
        title="At a glance"
        link={{ title: 'Open the app', href: HOME_PATH }}
        labelClassName={LANDING_SECTION_LABEL_CLASS}
      />
      <div className="@container/home grid grid-cols-1 border-divider border-b [--home-gutter:0px] lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_auto_1fr]">
        {/* The twin cards subgrid the title, chart and ranking rows, so
            their parts stay level. */}
        <div className="grid @min-[880px]/home:grid-cols-2 grid-cols-1 lg:col-span-2 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:grid-cols-subgrid lg:grid-rows-subgrid">
          <HomePrivacyCard
            data={data.privacy}
            projectCount={data.projectCounts.privacy}
            className="@min-[880px]/home:pr-6"
          />
          <HomeL2Card
            charts={data.l2Charts}
            topProjects={data.topL2Projects}
            projectCount={data.projectCounts.l2}
            className="@min-[880px]/home:border-l @min-[880px]/home:pl-6"
          />
        </div>
        <HomeEthereumCard
          charts={data.ethereumCharts}
          className="lg:col-start-1 lg:row-start-4 lg:pr-6"
        />
        <HomeInteropSection
          chains={data.interopFlowChains}
          defaultSelectedChains={data.interopDefaultFlowChains}
          protocols={data.flowProtocols}
          className="lg:col-start-2 lg:row-span-2 lg:row-start-4 lg:border-l lg:pl-6"
        />
      </div>
    </section>
  )
}
