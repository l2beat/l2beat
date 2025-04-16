'use client'
import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import type { DaThroughputTimeRange } from '~/server/features/data-availability/throughput/utils/range'
import { ProjectDaThroughputAbsoluteChart } from './project-da-throughput-absolute-chart'
import { ProjectDaThroughputByProjectChart } from './project-da-throughput-by-project-chart'

interface Props {
  daLayer: ProjectId
  configuredThroughputs: DaLayerThroughput[]
  milestones: Milestone[]
}

export function ProjectDaThroughputChart({
  daLayer,
  configuredThroughputs,
  milestones,
}: Props) {
  const [type, setType] = useState<'absolute' | 'by-project'>('absolute')
  const [range, setRange] = useState<DaThroughputTimeRange>('1y')
  return (
    <div>
      <RadioGroup
        name="type"
        value={type}
        onValueChange={(value) => setType(value as 'absolute' | 'by-project')}
        className="w-full"
      >
        <RadioGroupItem value="absolute" className="w-full">
          Absolute
        </RadioGroupItem>
        <RadioGroupItem value="by-project" className="w-full">
          By Project
        </RadioGroupItem>
      </RadioGroup>
      {type === 'absolute' ? (
        <ProjectDaThroughputAbsoluteChart
          daLayer={daLayer}
          configuredThroughputs={configuredThroughputs}
          milestones={milestones}
          range={range}
          setRange={setRange}
        />
      ) : (
        <ProjectDaThroughputByProjectChart
          daLayer={daLayer}
          range={range}
          setRange={setRange}
        />
      )}
    </div>
  )
}
