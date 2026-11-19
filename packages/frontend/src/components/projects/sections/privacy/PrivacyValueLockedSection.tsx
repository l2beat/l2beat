import type { Milestone } from '@l2beat/config'
import { type ReactNode, useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { PrivacyFlowsChartRangeControls } from '~/pages/privacy/project/components/PrivacyFlowsChartRangeControls'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import { TvsValueSectionChart } from '../tvs/TvsValueSectionChart'
import type { ProjectSectionProps } from '../types'
import {
  PrivacyChainFilter,
  type PrivacyChainFilterOption,
} from './PrivacyChainFilter'

export interface PrivacyValueLockedSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
  milestones: Milestone[]
  /** The project's deployments, any of which the chart can be narrowed to. */
  chains: PrivacyChainFilterOption[]
}

/**
 * Value locked in a project deployed on several chains: of all of them, or
 * of the one picked.
 */
export function PrivacyValueLockedSection({
  defaultRange,
  project,
  milestones,
  chains,
  ...projectSectionProps
}: PrivacyValueLockedSectionProps) {
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [chain, setChain] = useState<string>()
  const chart = {
    project,
    milestones,
    range,
    rangeControls: (
      <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
    ),
  }

  return (
    <ProjectSection {...projectSectionProps}>
      <PrivacyChainFilter
        name="privacyValueLockedChain"
        chains={chains}
        value={chain}
        onChange={setChain}
        className="mb-4"
      />
      {chain === undefined ? (
        <AllChainsChart {...chart} />
      ) : (
        <ChainChart {...chart} chain={chain} />
      )}
    </ProjectSection>
  )
}

interface ChartProps {
  project: ChartProject
  milestones: Milestone[]
  range: ChartRange
  rangeControls: ReactNode
}

/** The project's TVS, the same value as the summary and the home page. */
function AllChainsChart({
  project,
  milestones,
  range,
  rangeControls,
}: ChartProps) {
  const trpc = useTRPC()
  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.tvs.chartByProjects,
    { projectIds: [project.id], range },
  )
  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, valuesByProject]) => ({
        timestamp,
        value: valuesByProject[project.id] ?? null,
      })),
    [data, project.id],
  )
  return (
    <TvsValueSectionChart
      data={chartData}
      syncedUntil={data?.syncedUntil}
      isLoading={isLoading}
      isPlaceholderData={isPlaceholderData}
      shownRange={shownInput.range}
      rangeControls={rangeControls}
      project={project}
      milestones={milestones}
    />
  )
}

function ChainChart({
  project,
  milestones,
  range,
  rangeControls,
  chain,
}: ChartProps & { chain: string }) {
  const trpc = useTRPC()
  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.privacy.valueLockedChart,
    { projectId: project.id, range, chain },
  )
  const chartData = useMemo(
    () => data?.chart.map(([timestamp, value]) => ({ timestamp, value })),
    [data],
  )
  return (
    <TvsValueSectionChart
      data={chartData}
      syncedUntil={data?.syncedUntil}
      isLoading={isLoading}
      isPlaceholderData={isPlaceholderData}
      shownRange={shownInput.range}
      rangeControls={rangeControls}
      project={project}
      milestones={milestones}
    />
  )
}
