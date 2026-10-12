import {
  formatActivityCount,
  formatCurrency,
  UnixTime,
} from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { HomeL2Charts } from '~/server/features/home/getHomeL2Charts'
import type { HomeTopL2Project } from '../getHomeData'
import { HOME_CHART_HEIGHT_CLASS } from '../homeStyles'
import type { HomeSparklineDataPoint } from './charts/HomeSparkline'
import { HomeSparkline } from './charts/HomeSparkline'
import { HomeDomainCard, HomeKpiRow } from './HomeDomainCard'
import { HomeKpiTile } from './HomeKpiTile'
import {
  HomeRankedTable,
  HomeRankedValue,
  HomeRankedValueWithChange,
  VALUE_WITH_CHANGE_HEADER_CLASS,
} from './HomeRankedTable'
import { HomeRiskRosette } from './HomeRiskRosette'
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
  const tvsChartData = useMemo<HomeSparklineDataPoint[]>(
    () =>
      charts.tvs.chart.map(([timestamp, rollups, validiumsAndOptimiums]) => {
        const hasAny = rollups !== null || validiumsAndOptimiums !== null
        return {
          timestamp,
          value: hasAny ? (rollups ?? 0) + (validiumsAndOptimiums ?? 0) : null,
          tvsBreakdown: { rollups, validiumsAndOptimiums },
        }
      }),
    [charts.tvs.chart],
  )

  const activityChartData = useMemo<HomeSparklineDataPoint[]>(
    () =>
      charts.activity.chart.map(([timestamp, rollupsUops, vAndOUops]) => {
        const hasAny = rollupsUops !== null || vAndOUops !== null
        return {
          timestamp,
          value: hasAny
            ? ((rollupsUops ?? 0) + (vAndOUops ?? 0)) / UnixTime.DAY
            : null,
        }
      }),
    [charts.activity.chart],
  )

  const latestTvs = tvsChartData.findLast((d) => d.value !== null)?.value
  const latestUops = activityChartData.findLast((d) => d.value !== null)?.value

  return (
    <HomeDomainCard
      title="Layer 2s"
      href="/layer2s/summary"
      viewAll={{
        href: '/layer2s/summary',
        label: `View all ${projectCount} Layer 2s`,
      }}
      className={className}
    >
      <HomeKpiRow>
        <HomeKpiTile
          label="Value secured"
          value={
            latestTvs != null ? formatCurrency(latestTvs, 'usd') : undefined
          }
          change={charts.tvs.change}
          chart={
            <HomeSparkline
              className={HOME_CHART_HEIGHT_CLASS}
              data={tvsChartData}
              tooltipLabel="Value secured"
              formatValue={(value) => formatCurrency(value, 'usd')}
            />
          }
        />
        <HomeKpiTile
          label="Activity/UOPS"
          value={
            latestUops != null ? formatActivityCount(latestUops) : undefined
          }
          change={charts.activity.change}
          chart={
            <HomeSparkline
              className={HOME_CHART_HEIGHT_CLASS}
              data={activityChartData}
              tooltipLabel="UOPS"
              formatValue={(value) => `${formatActivityCount(value)} UOPS`}
              weeklyAverage
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
              <HomeRiskRosette
                values={project.risks}
                href={project.risksHref}
                isUnderReview={project.risksUnderReview}
              />
            ),
          },
          {
            id: 'stage',
            header: 'Stage',
            middle: true,
            cell: (project) => <HomeStageBadge stage={project.stage} />,
          },
          {
            id: 'tvs',
            header: 'TVS',
            headerClassName: VALUE_WITH_CHANGE_HEADER_CLASS,
            align: 'right',
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
