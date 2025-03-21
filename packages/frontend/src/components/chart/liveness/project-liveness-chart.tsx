'use client'

import type { Milestone } from '@l2beat/config'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { ProjectChartTimeRange } from '~/components/core/chart/chart-time-range'
import { getChartRange } from '~/components/core/chart/utils/get-chart-range-from-columns'
import { Checkbox } from '~/components/core/checkbox'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import type { LivenessSubtype } from '~/server/features/scaling/liveness/types'
import type { LivenessProjectTimeRange } from '~/server/features/scaling/liveness/utils/range'
import { api } from '~/trpc/react'
import { LivenessChart } from './liveness-chart'
import { LivenessChartTimeRangeControls } from './liveness-chart-time-range-controls'

interface Props {
  milestones: Milestone[]
  projectId: string
}

export function ProjectLivenessChart({ milestones, projectId }: Props) {
  const [range, setRange] = useState<LivenessProjectTimeRange>('7d')
  const [subtype, setSubtype] =
    useState<TrackedTxsConfigSubtype>('batchSubmissions')
  const [showZScore, setShowZScore] = useState(true)

  const { data, isLoading } = api.liveness.projectChart.useQuery({
    projectId,
    subtype,
  })

  const chartData = useMemo(() => {
    if (!data) {
      return undefined
    }

    return data.map(([timestamp, interval, mean, zScoreBoundary, anomaly]) => ({
      timestamp,
      interval,
      mean,
      zScoreBoundary,
      anomaly,
    }))
  }, [data])

  const chartRange = useMemo(() => getChartRange(chartData), [chartData])

  return (
    <div>
      <div className="mb-3 mt-4 flex flex-col justify-between gap-1">
        <ProjectChartTimeRange range={chartRange} />
        <div className="flex justify-between gap-1">
          <div className="flex flex-col gap-1 md:flex-row">
            <SubtypeControls
              subtype={subtype}
              setSubtype={setSubtype}
              isLoading={isLoading}
            />
            <ZScoreCheckbox
              showZScore={showZScore}
              setShowZScore={setShowZScore}
            />
          </div>
          <LivenessChartTimeRangeControls
            projectSection
            timeRange={range}
            setTimeRange={setRange}
          />
        </div>
      </div>
      <LivenessChart
        data={chartData}
        subtype={subtype}
        isLoading={isLoading}
        milestones={milestones}
        range={range}
        className="mb-2 mt-4"
        showZScore={showZScore}
      />
    </div>
  )
}

function SubtypeControls({
  subtype,
  setSubtype,
  isLoading,
}: {
  subtype: LivenessSubtype
  setSubtype: (value: LivenessSubtype) => void
  isLoading: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      {isLoading ? (
        <Skeleton className="h-8 w-[168px]" />
      ) : (
        <RadioGroup
          name="livenessChartSubtype"
          value={subtype}
          onValueChange={setSubtype}
        >
          <RadioGroupItem value="batchSubmissions" className="uppercase">
            tx data
          </RadioGroupItem>
          <RadioGroupItem value="proofSubmissions" className="uppercase">
            proofs
          </RadioGroupItem>
          <RadioGroupItem value="stateUpdates" className="uppercase">
            state updates
          </RadioGroupItem>
        </RadioGroup>
      )}
    </div>
  )
}

function ZScoreCheckbox({
  showZScore,
  setShowZScore,
}: {
  showZScore: boolean
  setShowZScore: (value: boolean) => void
}) {
  return (
    <Checkbox
      name="zScoreBoundary"
      checked={showZScore}
      onCheckedChange={(state) => setShowZScore(!!state)}
      labelTitle={undefined}
    >
      Show z-score boundary
    </Checkbox>
  )
}
