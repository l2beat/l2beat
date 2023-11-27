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
}

export function LivenessDurationTimeRangeCell({ data, project }: Props) {
  return (
    <LivenessTimeRangeCell
      last30Days={
        <div
          className="Tooltip"
          title={renderToStaticMarkup(
            <Tooltip label="30-day intervals" data={data?.last30Days} />,
          )}
        >
          <LivenessDurationCell
            durationInSeconds={data?.last30Days?.averageInSeconds}
            project={project}
          />
        </div>
      }
      last90Days={
        <div
          className="Tooltip"
          title={renderToStaticMarkup(
            <Tooltip label="90-day intervals" data={data?.last90Days} />,
          )}
        >
          <LivenessDurationCell
            durationInSeconds={data?.last90Days?.averageInSeconds}
            project={project}
          />
        </div>
      }
      max={
        <div
          className="Tooltip"
          title={renderToStaticMarkup(
            <Tooltip label="Max-day intervals" data={data?.max} />,
          )}
        >
          <LivenessDurationCell
            durationInSeconds={data?.max?.averageInSeconds}
            project={project}
          />
        </div>
      }
    />
  )
}

function Tooltip(props: {
  data: LivenessDataPoint | undefined
  label: string
}) {
  return (
    <div>
      <span>{props.label}:</span>
      <ul className="mt-1 list-inside list-disc">
        <li>
          Average:{' '}
          <LivenessDurationCell
            durationInSeconds={props.data?.averageInSeconds}
          />
        </li>
        <li>
          Maximum:{' '}
          <LivenessDurationCell
            durationInSeconds={props.data?.maximumInSeconds}
          />
        </li>
      </ul>
    </div>
  )
}
