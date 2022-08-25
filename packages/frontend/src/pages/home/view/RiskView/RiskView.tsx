import { Project, ProjectRiskView } from '@l2beat/config'
import classNames from 'classnames'
import React from 'react'

import { OptimismIcon, StarkWareIcon } from '../../../../components/icons'
import { ProjectLink } from '../ProjectLink'
import { Column, TableView } from '../TableView'
import { RiskCell } from './RiskCell'

export interface RiskViewProps {
  items: RiskViewEntry[]
  className?: string
}

export interface RiskViewEntry extends ProjectRiskView {
  name: string
  slug: string
  provider?: Project['details']['provider']
}

export function RiskView({ items, className }: RiskViewProps) {
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
    <div className={classNames('RiskView', className)}>
      <TableView items={items} columns={columns} />
      <div className="RiskView-Symbols">
        <p>
          <StarkWareIcon />
          <span>&ndash;</span>
          <span>This project is built using StarkEx.</span>
        </p>
        <p>
          <OptimismIcon />
          <span>&ndash;</span>
          <span>This project is based on Optimism&apos;s code base.</span>
        </p>
      </div>
    </div>
  )
}
