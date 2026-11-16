import { formatActivityCount, formatCurrency } from '@l2beat/shared-pure'
import { PizzaRosetteCell } from '~/components/rosette/pizza/PizzaRosetteCell'
import { L2Icon } from '~/icons/pages/L2'
import type { HomeL2Charts } from '~/server/features/home/getHomeL2Charts'
import type { HomeTopL2Project } from '../getHomeData'
import { HOME_CELL_LINK_CLASS } from '../homeStyles'
import { HomeSparkline } from './charts/HomeSparkline'
import { HomeDomainCard, HomeKpiRow } from './HomeDomainCard'
import { HomeKpiTile } from './HomeKpiTile'
import {
  HomeRankedTable,
  HomeRankedValue,
  HomeRankedValueWithChange,
} from './HomeRankedTable'
import { HomeStageBadge } from './HomeStageBadge'

interface Props {
  charts: HomeL2Charts
  topProjects: HomeTopL2Project[]
  /** Every Layer 2 we track, for the link under the ranking. */
  projectCount: number
  className?: string
}

export function HomeL2Card({
  charts,
  topProjects,
  projectCount,
  className,
}: Props) {
  const { tvs, activity } = charts
  return (
    <HomeDomainCard
      title="Layer 2s"
      icon={<L2Icon aria-hidden />}
      link={{
        href: '/layer2s/summary',
        label: `All ${projectCount} projects`,
      }}
      className={className}
    >
      <HomeKpiRow>
        <HomeKpiTile
          label="Value secured"
          value={
            tvs.value !== undefined
              ? formatCurrency(tvs.value, 'usd')
              : undefined
          }
          change={tvs.change}
          chart={
            <HomeSparkline
              label="Value secured"
              series={tvs.chart}
              formatValue={(value) => formatCurrency(value, 'usd')}
            />
          }
        />
        <HomeKpiTile
          label="Activity/UOPS"
          value={
            activity.value !== undefined
              ? formatActivityCount(activity.value)
              : undefined
          }
          change={activity.change}
          chart={
            <HomeSparkline
              label="Activity/UOPS"
              series={activity.chart}
              formatValue={(value) => `${formatActivityCount(value)} UOPS`}
            />
          }
        />
      </HomeKpiRow>
      <HomeRankedTable
        title="Top rollups"
        rows={topProjects}
        columns={[
          {
            id: 'risks',
            header: 'Risks',
            align: 'center',
            middle: true,
            minTableWidth: 640,
            cell: (project) => (
              // At the ranking's 24px, so the rows keep their height.
              <PizzaRosetteCell
                projectName={project.name}
                values={project.risks}
                href={project.risksHref}
                isUnderReview={project.risksUnderReview}
                iconClassName="md:size-6"
                linkClassName={HOME_CELL_LINK_CLASS}
              />
            ),
          },
          {
            id: 'stage',
            header: 'Stage',
            middle: true,
            cell: (project) => (
              <HomeStageBadge
                stage={project.stage}
                projectHref={project.href}
              />
            ),
          },
          {
            id: 'tvs',
            header: 'TVS',
            align: 'right',
            withChange: true,
            cell: (project) => (
              <HomeRankedValueWithChange
                value={project.tvs}
                change={project.tvsChange}
              />
            ),
          },
          {
            id: 'uops',
            header: 'UOPS',
            align: 'right',
            minTableWidth: 480,
            cell: (project) => (
              <HomeRankedValue
                value={project.uops}
                format={formatActivityCount}
              />
            ),
          },
        ]}
      />
    </HomeDomainCard>
  )
}
