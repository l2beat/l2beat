import { LivenessApiProject, LivenessDataPoint } from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { RoundedWarningIcon } from '../../../../components/icons'
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
          <div className="flex items-center gap-1.5">
            <LivenessDurationCell
              durationInSeconds={data?.last30Days?.averageInSeconds}
              project={project}
              tooltip={renderToStaticMarkup(
                <Tooltip label="30-day intervals" data={data?.last30Days} />,
              )}
              dataType={dataType}
            />
            {data?.warning && (
              <div className="Tooltip" title={data.warning}>
                <RoundedWarningIcon className="h-5 w-5 fill-yellow-700 dark:fill-yellow-300" />
              </div>
            )}
          </div>
        }
        last90Days={
          <div className="flex items-center gap-1.5">
            <LivenessDurationCell
              durationInSeconds={data?.last90Days?.averageInSeconds}
              project={project}
              tooltip={renderToStaticMarkup(
                <Tooltip label="90-day intervals" data={data?.last90Days} />,
              )}
              dataType={dataType}
            />
            {data?.warning && (
              <div className="Tooltip" title={data.warning}>
                <RoundedWarningIcon className="h-5 w-5 fill-yellow-700 dark:fill-yellow-300" />
              </div>
            )}
          </div>
        }
        max={
          <div className="flex items-center gap-1.5">
            <LivenessDurationCell
              durationInSeconds={data?.allTime?.averageInSeconds}
              project={project}
              tooltip={renderToStaticMarkup(
                <Tooltip label="All-time intervals" data={data?.allTime} />,
              )}
              dataType={dataType}
            />
            {data?.warning && (
              <div className="Tooltip" title={data.warning}>
                <RoundedWarningIcon className="h-5 w-5 fill-yellow-700 dark:fill-yellow-300" />
              </div>
            )}
          </div>
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
