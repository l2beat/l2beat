import {
  LivenessApiProject,
  LivenessDataPoint,
  LivenessDetails,
} from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { LivenessDurationCell } from '../../../../components/table/DurationCell'
import { ScalingLivenessViewEntry } from '../types'
import { LivenessTimeRangeCell } from './LivenessTimeRangeCell'

interface Props {
  data: LivenessDetails | undefined
  project: ScalingLivenessViewEntry
  dataType: Exclude<keyof LivenessApiProject, 'anomalies'>
}

export function LivenessDurationTimeRangeCell({
  data,
  project,
  dataType,
}: Props) {
  const showOptimisticRollupWarning =
    project.category === 'Optimistic Rollup' && dataType === 'stateUpdates'
  return (
    <div>
      <LivenessTimeRangeCell
        last30Days={
          <LivenessDurationCell
            durationInSeconds={data?.last30Days?.averageInSeconds}
            project={project}
            tooltip={renderToStaticMarkup(
              <Tooltip label="30-day intervals" data={data?.last30Days} />,
            )}
            showOptimisticRollupWarning={showOptimisticRollupWarning}
            dataType={dataType}
          />
        }
        last90Days={
          <LivenessDurationCell
            durationInSeconds={data?.last90Days?.averageInSeconds}
            project={project}
            tooltip={renderToStaticMarkup(
              <Tooltip label="90-day intervals" data={data?.last90Days} />,
            )}
            showOptimisticRollupWarning={showOptimisticRollupWarning}
            dataType={dataType}
          />
        }
        max={
          <LivenessDurationCell
            durationInSeconds={data?.allTime?.averageInSeconds}
            project={project}
            tooltip={renderToStaticMarkup(
              <Tooltip label="Max-day intervals" data={data?.allTime} />,
            )}
            showOptimisticRollupWarning={showOptimisticRollupWarning}
            dataType={dataType}
          />
        }
      />
    </div>
  )
}

function Tooltip(props: {
  data: LivenessDataPoint | undefined
  label: string
}) {
  return (
    <div className="font-medium">
      <span>{props.label}:</span>
      <ul className="mt-1 list-inside list-disc">
        <li className="flex gap-1">
          Minimum:
          <LivenessDurationCell
            durationInSeconds={props.data?.minimumInSeconds}
          />
        </li>
        <li className="flex gap-1">
          Average:
          <LivenessDurationCell
            durationInSeconds={props.data?.averageInSeconds}
          />
        </li>
        <li className="flex gap-1">
          Maximum:
          <LivenessDurationCell
            durationInSeconds={props.data?.maximumInSeconds}
          />
        </li>
      </ul>
    </div>
  )
}
