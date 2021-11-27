import { Project, ProjectRiskView } from '@l2beat/config'
import React from 'react'

import { OptimismIcon, StarkWareIcon } from '../../../../common/icons'
import { ProjectLink } from '../ProjectLink'
import { Column, TableView } from '../TableView'
import { RiskCell } from './RiskCell'

export interface RiskViewProps {
  items: RiskViewEntry[]
}

export interface RiskViewEntry extends ProjectRiskView {
  name: string
  slug: string
  provider?: Project['details']['provider']
}

export function RiskView({ items }: RiskViewProps) {
  const columns: Column<RiskViewEntry>[] = [
    {
      name: 'Name',
      getValue: (project) => <ProjectLink project={project} />,
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
    <div className="RiskView">
      <TableView items={items} columns={columns} />
      <div className="RiskView-Symbols">
        <p>
          <StarkWareIcon /> &ndash; This project is built using StarkEx.
        </p>
        <p>
          <OptimismIcon /> &ndash; This project is based on Optimism&apos;s code
          base.
        </p>
      </div>
    </div>
  )
}
