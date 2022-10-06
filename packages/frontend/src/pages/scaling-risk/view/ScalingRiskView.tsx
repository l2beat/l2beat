import { Layer2, Layer2RiskView } from '@l2beat/config'
import React from 'react'

import { ProjectLink } from '../../../components/ProjectLink'
import { RiskCell } from '../../../components/RiskCell'
import { ScalingLegend } from '../../../components/ScalingLegend'
import { ColumnConfig, TableView } from '../../../components/TableView'

export interface ScalingRiskViewProps {
  items: ScalingRiskViewEntry[]
}

export interface ScalingRiskViewEntry extends Layer2RiskView {
  name: string
  slug: string
  provider?: Layer2['technology']['provider']
}

export function ScalingRiskView({ items }: ScalingRiskViewProps) {
  const columns: ColumnConfig<ScalingRiskViewEntry>[] = [
    {
      name: 'No.',
      getValue: (entry, index) => `${index + 1}.`,
    },
    {
      name: 'Name',
      getValue: (project) => <ProjectLink type="layer2" project={project} />,
    },
    {
      name: 'State validation',
      getValue: (project) => <RiskCell item={project.stateValidation} />,
    },
    {
      name: 'Data availability',
      getValue: (project) => <RiskCell item={project.dataAvailability} />,
    },
    {
      name: 'Upgradeability',
      getValue: (project) => <RiskCell item={project.upgradeability} />,
    },
    {
      name: 'Sequencer failure',
      getValue: (project) => <RiskCell item={project.sequencerFailure} />,
    },
    {
      name: 'Validator failure',
      getValue: (project) => <RiskCell item={project.validatorFailure} />,
    },
  ]

  return (
    <section className="mt-4">
      <TableView items={items} columns={columns} />
      <ScalingLegend />
    </section>
  )
}
