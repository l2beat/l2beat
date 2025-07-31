import type { DaLayerThroughput, Milestone } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import type { DaThroughputTimeRange } from '~/server/features/data-availability/throughput/utils/range'
import { ThroughputSectionAbsoluteChart } from './ThroughputSectionAbsoluteChart'
import { ThroughputSectionByProjectChart } from './ThroughputSectionByProjectChart'

interface Props {
  daLayer: ProjectId
  configuredThroughputs: DaLayerThroughput[]
  customColors: Record<string, string> | undefined
  milestones: Milestone[]
}

export function ThroughputSectionChart({
  daLayer,
  configuredThroughputs,
  customColors,
  milestones,
}: Props) {
  const [type, setType] = useState<'combined' | 'by-project'>('combined')
  const [range, setRange] = useState<DaThroughputTimeRange>('1y')
  const [selectedProjects, setSelectedProjects] = useState<string[]>()

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
        />
      ) : (
        <ThroughputSectionByProjectChart
          daLayer={daLayer}
          range={range}
          setRange={setRange}
          selectedProjects={selectedProjects}
          setSelectedProjects={setSelectedProjects}
          customColors={customColors}
          milestones={milestones}
        />
      )}
    </div>
  )
}
