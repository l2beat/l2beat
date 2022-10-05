import { Layer2, Layer2RiskView } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import {
  OptimismIcon,
  StarkWareIcon,
  ZkSyncIcon,
} from '../../../components/icons'
import { ProjectLink } from '../../../components/ProjectLink'
import { RiskCell } from '../../../components/RiskCell'
import { ColumnConfig, TableView } from '../../../components/TableView'

export interface ScalingRiskViewProps {
  items: ScalingRiskViewEntry[]
  className?: string
}

export interface ScalingRiskViewEntry extends Layer2RiskView {
  name: string
  slug: string
  provider?: Layer2['technology']['provider']
}

export function ScalingRiskView({ items, className }: ScalingRiskViewProps) {
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
    <section className={cx('RiskView', className)}>
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
        <p>
          <ZkSyncIcon />
          <span>&ndash;</span>
          <span>This project is based on zkSync&apos;s code base.</span>
        </p>
      </div>
    </section>
  )
}
