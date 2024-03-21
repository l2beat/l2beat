import React from 'react'

import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import { getOrderValueBySentiment } from '../../../../components/table/props/sorting/getOrderValueBySentiment'
import { SentimentText } from '../../../../components/table/SentimentText'
import {
  TypeCell,
  TypeColumnTooltip,
} from '../../../../components/table/TypeCell'
import { ColumnConfig } from '../../../../components/table/types'
import { ScalingDataAvailabilityViewEntry } from '../types'

export function getScalingDataAvailabilityColumnsConfig() {
  const columns: ColumnConfig<ScalingDataAvailabilityViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      name: 'Type',
      tooltip: <TypeColumnTooltip />,
      getValue: (project) => (
        <TypeCell provider={project.provider}>{project.category}</TypeCell>
      ),
      sorting: {
        getOrderValue: (project) => project.category,
        rule: 'alphabetical',
      },
    },
    {
      name: 'DA Layer',
      tooltip:
        'The data availability layer where the data (transaction data or state diffs) is published.',
      getValue: (project) => (
        <SentimentText
          sentiment={project.dataAvailability.layer.sentiment}
          description={project.dataAvailability.layer.description}
        >
          {project.dataAvailability.layer.value}
        </SentimentText>
      ),
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.dataAvailability.layer),
        rule: 'alphabetical',
      },
    },
    {
      name: 'DA Bridge',
      tooltip:
        'The DA bridge used for informing Ethereum contracts if data has been made available.',
      getValue: (project) => (
        <SentimentText
          sentiment={project.dataAvailability.bridge.sentiment}
          description={project.dataAvailability.bridge.description}
        >
          {project.dataAvailability.bridge.value}
        </SentimentText>
      ),
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.dataAvailability.bridge),
        rule: 'alphabetical',
      },
    },
    {
      name: 'Type of data',
      getValue: (project) => project.dataAvailability.mode,
      sorting: {
        getOrderValue: (project) => project.dataAvailability.mode,
        rule: 'alphabetical',
      },
    },
  ]
  return columns
}
