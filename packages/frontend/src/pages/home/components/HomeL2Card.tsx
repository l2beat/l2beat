import {
  formatActivityCount,
  formatCurrency,
  UnixTime,
} from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { StageBadge } from '~/components/badge/StageBadge'
import type { HomeL2Charts } from '~/server/features/home/getHomeL2Charts'
import type { HomeTopL2Project } from '../getHomeData'
import { HOME_CHART_HEIGHT_CLASS } from '../homeStyles'
import type { HomeSparklineDataPoint } from './charts/HomeSparkline'
import { HomeSparkline } from './charts/HomeSparkline'
import { HomeDomainCard, HomeDomainSection, HomeKpiRow } from './HomeDomainCard'
import { HomeKpiTile } from './HomeKpiTile'
import {
  HomeRankedChange,
  HomeRankedTable,
  HomeRankedValue,
} from './HomeRankedTable'

interface Props {
  charts: HomeL2Charts
  topProjects: HomeTopL2Project[]
  className?: string
}

export function HomeL2Card({ charts, topProjects, className }: Props) {
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
              tooltipDayRange
            />
          }
        />
      </HomeKpiRow>
      <HomeDomainSection title="Top rollups">
        <HomeRankedTable
          rows={topProjects}
          columns={[
            {
              id: 'stage',
              middle: true,
              cell: (project) => (
                <StageBadge
                  stage={project.stage}
                  isAppchain={project.isAppchain}
                  inline
                />
              ),
            },
            {
              id: 'tvs',
              align: 'right',
              cell: (project) => (
                <HomeRankedValue label="TVS" value={project.tvs} />
              ),
            },
            {
              id: 'change',
              align: 'right',
              cell: (project) => (
                <HomeRankedChange change={project.tvsChange} />
              ),
            },
          ]}
        />
      </HomeDomainSection>
    </HomeDomainCard>
  )
}
