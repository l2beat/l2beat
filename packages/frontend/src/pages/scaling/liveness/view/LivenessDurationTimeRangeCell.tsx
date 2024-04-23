import { LivenessApiProject, LivenessDataPoint } from '@l2beat/shared-pure'
import React from 'react'

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
            tooltipContent={
              <LivenessTooltip
                label="30-day intervals"
                data={data?.last30Days}
              />
            }
            syncedUntil={data?.syncedUntil}
            isSynced={data?.isSynced}
            dataType={dataType}
            warning={data?.warning}
          />
        }
        last90Days={
          <LivenessDurationCell
            durationInSeconds={data?.last90Days?.averageInSeconds}
            project={project}
            tooltipContent={
              <LivenessTooltip
                label="90-day intervals"
                data={data?.last90Days}
              />
            }
            syncedUntil={data?.syncedUntil}
            isSynced={data?.isSynced}
            dataType={dataType}
            warning={data?.warning}
          />
        }
        max={
          <LivenessDurationCell
            durationInSeconds={data?.allTime?.averageInSeconds}
            project={project}
            tooltipContent={
              <LivenessTooltip
                label="All-time intervals"
                data={data?.allTime}
              />
            }
            syncedUntil={data?.syncedUntil}
            isSynced={data?.isSynced}
            dataType={dataType}
            warning={data?.warning}
          />
        }
      />
    </div>
  )
}

function LivenessTooltip(props: {
  data: LivenessDataPoint | undefined
  label: string
}) {
  return (
    <div className="font-medium">
      <span>{props.label}:</span>
      <ul className="mt-1 list-inside list-disc">
        <li className="flex justify-between gap-4">
          Minimum:
          <LivenessDurationCell
            durationInSeconds={props.data?.minimumInSeconds}
          />
        </li>
        <li className="flex justify-between gap-4">
          Average:
          <LivenessDurationCell
            durationInSeconds={props.data?.averageInSeconds}
          />
        </li>
        <li className="flex justify-between gap-4">
          Maximum:
          <LivenessDurationCell
            durationInSeconds={props.data?.maximumInSeconds}
          />
        </li>
      </ul>
    </div>
  )
}
