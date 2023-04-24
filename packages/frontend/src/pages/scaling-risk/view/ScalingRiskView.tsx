import { Layer2, ProjectRiskViewEntry } from '@l2beat/config'
import React from 'react'

import { ScalingLegend } from '../../../components/ScalingLegend'
import { ScalingTableFilters } from '../../../components/table/filters/ScalingTableFilters'
import { IndexCell } from '../../../components/table/IndexCell'
import { ProjectCell } from '../../../components/table/ProjectCell'
import { getScalingRowProps } from '../../../components/table/props/getScalingRowProps'
import { RiskCell } from '../../../components/table/RiskCell'
import {
  ColumnConfig,
  RowConfig,
  TableView,
} from '../../../components/table/TableView'

export interface ScalingRiskViewProps {
  items: ScalingRiskViewEntry[]
  upcomingEnabled?: boolean
}

export interface ScalingRiskViewEntry {
  name: string
  slug: string
  provider?: Layer2['technology']['provider']
  warning?: string
  isArchived?: boolean
  isVerified?: boolean
  isUpcoming?: boolean
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
      alignCenter: true,
      minimalWidth: true,
      headClassName: 'md:pl-4',
      getValue: (_, index) => <IndexCell index={index} className="md:pl-4" />,
    },
    {
      name: 'Name',
      headClassName: 'pl-8',
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
      tooltip:
        "Sequencer is an entity responsible for constructing L2 blocks and deciding on the ordering of user's L2 transactions. What happens if it is offline or censors individual user?",
      getValue: (project) => <RiskCell item={project.sequencerFailure} />,
    },
    {
      name: 'Validator failure',
      tooltip:
        'Validator is an entity responsible for submitting L2 state to Ethereum (optionally, along with the zkProof). What happens if it is offline?',
      getValue: (project) => <RiskCell item={project.validatorFailure} />,
    },
  ]

  const rows: RowConfig<ScalingRiskViewEntry> = {
    getProps: getScalingRowProps,
  }

  return (
    <section className="mt-4 sm:mt-8">
      <ScalingTableFilters className="mb-4" />
      <TableView items={items} columns={columns} rows={rows} />
      <ScalingLegend />
    </section>
  )
}
