import { Layer2, ProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { ScalingLegend } from '../../../components/ScalingLegend'
import { ProjectCell } from '../../../components/table/ProjectCell'
import { RiskCell } from '../../../components/table/RiskCell'
import { ColumnConfig, TableView } from '../../../components/table/TableView'

export interface ScalingRiskViewProps {
  items: ScalingRiskViewEntry[]
}

export interface ScalingRiskViewEntry {
  name: string
  slug: string
  provider?: Layer2['technology']['provider']
  warning?: string
  stateValidation: ProjectRiskViewEntry
  dataAvailability: ProjectRiskViewEntry
  upgradeability: ProjectRiskViewEntry
  sequencerFailure: ProjectRiskViewEntry
  validatorFailure: ProjectRiskViewEntry
}

export function ScalingRiskView({ items }: ScalingRiskViewProps) {
  const columns: ColumnConfig<ScalingRiskViewEntry>[] = [
    {
      name: '#',
      alignRight: true,
      minimalWidth: true,
      getValue: (entry, index) => index + 1,
    },
    {
      name: 'Name',
      getValue: (project) => <ProjectCell type="layer2" project={project} />,
    },
    {
      name: 'State validation',
      tooltip: 'How is the validity of the system state checked?',
      getValue: (project) => <RiskCell item={project.stateValidation} />,
    },
    {
      name: 'Data availability',
      tooltip: 'Is the data needed to reconstruct the state available?',
      getValue: (project) => <RiskCell item={project.dataAvailability} />,
    },
    {
      name: 'Upgradeability',
      tooltip: 'Are the Ethereum contracts upgradeable?',
      getValue: (project) => <RiskCell item={project.upgradeability} />,
    },
    {
      name: 'Sequencer failure',
      tooltip: 'What happens if the sequencer is offline or decides to censor?',
      getValue: (project) => <RiskCell item={project.sequencerFailure} />,
    },
    {
      name: 'Validator failure',
      tooltip:
        'What happens if the block producer is offline or decides to censor?',
      getValue: (project) => <RiskCell item={project.validatorFailure} />,
    },
  ]

  return (
    <section className="mt-4 sm:mt-8">
      <TableView items={items} columns={columns} />
      <ScalingLegend />
    </section>
  )
}
