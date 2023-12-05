import { LivenessApiProject, LivenessDataPoint } from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { LivenessDurationCell } from '../../../../components/table/LivenessDurationCell'
import { LivenessDetailsWithWarning, ScalingLivenessViewEntry } from '../types'
import { LivenessTimeRangeCell } from './LivenessTimeRangeCell'

interface Props {
  data: LivenessDetailsWithWarning | undefined
  project: ScalingLivenessViewEntry
  dataType: Exclude<keyof LivenessApiProject, 'anomalies'>
}

export function LivenessDurationTimeRangeCell({
  data,
  project,
  dataType,
}: Props) {
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
            warning={data?.warning}
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
            warning={data?.warning}
            dataType={dataType}
          />
        }
        max={
          <LivenessDurationCell
            durationInSeconds={data?.allTime?.averageInSeconds}
            project={project}
            tooltip={renderToStaticMarkup(
              <Tooltip label="All-time intervals" data={data?.allTime} />,
            )}
            warning={data?.warning}
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
