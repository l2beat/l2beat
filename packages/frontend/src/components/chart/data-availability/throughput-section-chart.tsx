'use client'
import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import type { DaThroughputTimeRange } from '~/server/features/data-availability/throughput/utils/range'
import { ThroughputSectionAbsoluteChart } from './throughput-section-absolute-chart'
import { ThroughputSectionByProjectChart } from './throughput-section-by-project-chart'

interface Props {
  daLayer: ProjectId
  configuredThroughputs: DaLayerThroughput[]
  milestones: Milestone[]
}

export function ThroughputSectionChart({
  daLayer,
  configuredThroughputs,
  milestones,
}: Props) {
  const [type, setType] = useState<'combined' | 'by-project'>('combined')
  const [range, setRange] = useState<DaThroughputTimeRange>('1y')
  const [selectedProjects, setSelectedProjects] = useState<string[]>()
  const [showMax, setShowMax] = useState(true)

  return (
    <div>
      <RadioGroup
        name="type"
        value={type}
        onValueChange={(value) => setType(value as 'combined' | 'by-project')}
        className="w-full"
      >
        <RadioGroupItem value="combined" className="w-full">
          Combined
        </RadioGroupItem>
        <RadioGroupItem value="by-project" className="w-full">
          By Project
        </RadioGroupItem>
      </RadioGroup>
      {type === 'combined' ? (
        <ThroughputSectionAbsoluteChart
          daLayer={daLayer}
          configuredThroughputs={configuredThroughputs}
          milestones={milestones}
          range={range}
          setRange={setRange}
          showMax={showMax}
          setShowMax={setShowMax}
        />
      ) : (
        <ThroughputSectionByProjectChart
          daLayer={daLayer}
          range={range}
          setRange={setRange}
          selectedProjects={selectedProjects}
          setSelectedProjects={setSelectedProjects}
        />
      )}
    </div>
  )
}
