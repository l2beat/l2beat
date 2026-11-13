import { useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import {
  CostOfExitChart,
  LIQUID_STAKING_RANGE_OPTIONS,
  type LiquidStakingChartFrameProps,
  type LiquidStakingChartProject,
  ProjectLabel,
  YieldChart,
} from '~/pages/defi/liquid-staking/components/LiquidStakingCharts'
import type { LiquidStakingChartSeries } from '~/pages/defi/liquid-staking/components/LiquidStakingLineChart'
import { generateAccessibleColors } from '~/utils/generateColors'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface LiquidStakingYieldAndExitSectionProps
  extends ProjectSectionProps {
  defaultRange: ChartRange
  project: LiquidStakingChartProject
  /** Names only the exit routes this protocol has. */
  costOfExitDescription: string
}

/** The project's lines of the liquid staking page's charts. */
export function LiquidStakingYieldAndExitSection({
  defaultRange,
  project,
  costOfExitDescription,
  ...projectSectionProps
}: LiquidStakingYieldAndExitSectionProps) {
  const [yieldRange, setYieldRange] = useState<ChartRange>(defaultRange)
  const [exitRange, setExitRange] = useState<ChartRange>(defaultRange)
  const projectSeries = useMemo(
    (): LiquidStakingChartSeries[] => [
      {
        key: project.id,
        label: <ProjectLabel project={project} />,
        color: generateAccessibleColors(1)[0] ?? 'var(--secondary)',
      },
    ],
    [project],
  )

  return (
    <ProjectSection {...projectSectionProps}>
      <YieldChart
        projectSeries={projectSeries}
        range={yieldRange}
        projectId={project.id}
        frame={(frame) => (
          <ChartBlock
            {...frame}
            name="liquid-staking-yield"
            range={yieldRange}
            setRange={setYieldRange}
          />
        )}
      />
      <CostOfExitChart
        projectSeries={projectSeries}
        range={exitRange}
        projectId={project.id}
        description={costOfExitDescription}
        frame={(frame) => (
          <ChartBlock
            {...frame}
            name="liquid-staking-cost-of-exit"
            range={exitRange}
            setRange={setExitRange}
            className="mt-8"
          />
        )}
      />
    </ProjectSection>
  )
}

function ChartBlock({
  title,
  description,
  timeRange,
  isPlaceholderData,
  children,
  name,
  range,
  setRange,
  className,
}: LiquidStakingChartFrameProps & {
  name: string
  range: ChartRange
  setRange: (range: ChartRange) => void
  className?: string
}) {
  return (
    <div className={className}>
      <h3 className="mb-2 font-bold text-heading-20">{title}</h3>
      <p className="mb-4 text-paragraph-15 text-secondary">{description}</p>
      <ChartControlsWrapper className="mb-4">
        <ProjectChartTimeRange
          timeRange={timeRange}
          isPlaceholderData={isPlaceholderData}
        />
        <ChartRangeControls
          name={name}
          value={range}
          setValue={setRange}
          options={LIQUID_STAKING_RANGE_OPTIONS}
        />
      </ChartControlsWrapper>
      {children}
    </div>
  )
}
