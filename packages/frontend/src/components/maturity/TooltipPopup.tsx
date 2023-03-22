import { Layer2Maturity, MaturityStage } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { sentimentToFillColor } from '../../utils/risks/color'
import { ShieldIcon } from '../icons'
import { MaturityBadge } from './Badge'

export interface MaturityProps {
  maturity?: Layer2Maturity
  name?: string
  technology?: string
}

export function MaturityTooltipPopup({
  maturity,
  name,
  technology,
}: Required<MaturityProps>) {
  return (
    <div className="w-88 flex flex-col gap-4">
      <div>
        <MaturityBadge maturity={maturity} />
        {stageToDescription(maturity.stage)}
      </div>
      <div>
        {name} is {maturity.stage} {technology}
      </div>
      {maturity.modifiers.map((modifier) => (
        <div className="flex">
          <ShieldIcon
            className={cx('grow-0', sentimentToFillColor(modifier.sentiment))}
          />
          <p>{modifier.value}</p>
        </div>
      ))}
    </div>
  )
}

function stageToDescription(stage: MaturityStage): string {
  switch (stage) {
    case 'Stage 0':
      return 'Full training wheels'
    case 'Stage 1':
      return 'Some training wheels'
    case 'Stage 2':
      return 'No training wheels'
  }
}
