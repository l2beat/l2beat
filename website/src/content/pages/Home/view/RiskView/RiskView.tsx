import { ProjectRiskView } from '@l2beat/config'
import React from 'react'

import { StarkWareIcon } from '../../../../common/icons'
import { ProjectLink } from '../ProjectLink'
import { Column, TableView } from '../TableView'
import { RiskCell } from './RiskCell'

export interface RiskViewProps {
  items: RiskViewEntry[]
}

export interface RiskViewEntry extends ProjectRiskView {
  name: string
  slug: string
  isStarkEx: boolean
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
      name: 'Operator censoring',
      getValue: (project) => <RiskCell item={project.operatorCensoring} />,
    },
    {
      name: 'Operator down',
      getValue: (project) => <RiskCell item={project.operatorDown} />,
    },
  ]

  return (
    <div className="RiskView">
      <TableView items={items} columns={columns} />
      <div className="RiskView-Symbols">
        <p>
          <StarkWareIcon /> &ndash; This project is built using StarkEx.
        </p>
      </div>
    </div>
  )
}
