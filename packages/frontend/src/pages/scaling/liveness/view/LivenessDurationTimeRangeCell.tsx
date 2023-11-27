import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { LivenessDurationCell } from '../../../../components/table/DurationCell'
import {
  LivenessData,
  LivenessDataPoint,
  ScalingLivenessViewEntry,
} from '../types'
import { LivenessTimeRangeCell } from './LivenessTimeRangeCell'

interface Props {
  data: LivenessData | undefined
  project: ScalingLivenessViewEntry
  dataType: 'txDataSubmissions' | 'stateUpdates'
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
          />
        }
        max={
          <LivenessDurationCell
            durationInSeconds={data?.max?.averageInSeconds}
            project={project}
            tooltip={renderToStaticMarkup(
              <Tooltip label="Max-day intervals" data={data?.max} />,
            )}
            showOptimisticRollupWarning={showOptimisticRollupWarning}
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
