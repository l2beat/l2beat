import { Layer2Maturity, MaturityStage } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

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
        <span className="ml-2">{stageToDescription(maturity.stage)}</span>
      </div>
      <div>
        <span className="font-bold">{name}</span> is{' '}
        <span className={cx(stageToTextColor(maturity.stage), 'font-bold')}>
          {maturity.stage}
        </span>{' '}
        {technology}
      </div>
      {maturity.modifiers.map((modifier) => (
        <div className="flex gap-2.5">
          <ShieldIcon
            className={cx(
              'h-4 grow-0',
              modifier.sentiment === 'warning'
                ? 'fill-yellow-700 dark:fill-yellow-300'
                : 'fill-red-300',
            )}
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

function stageToTextColor(stage: MaturityStage): string {
  switch (stage) {
    case 'Stage 0':
      return 'text-red-300'
    case 'Stage 1':
      return 'text-yellow-200'
    case 'Stage 2':
      return 'text-green-800'
  }
}
