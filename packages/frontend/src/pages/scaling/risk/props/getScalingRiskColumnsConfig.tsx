import React from 'react'

import { getProjectWithIndexColumns } from '../../../../components/table/props/getProjectWithIndexColumns'
import { getOrderValueBySentiment } from '../../../../components/table/props/sorting/getOrderValueBySentiment'
import { RiskCell } from '../../../../components/table/RiskCell'
import { ColumnConfig } from '../../../../components/table/types'
import { ScalingRiskViewEntry } from '../types'

export function getScalingRiskColumnsConfig() {
  const columns: ColumnConfig<ScalingRiskViewEntry>[] = [
    ...getProjectWithIndexColumns({ indexAsDefaultSort: true }),
    {
      name: 'State\nvalidation',
      tooltip: 'How is the validity of the system state checked?',
      getValue: (project) => <RiskCell item={project.stateValidation} />,
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.stateValidation),
        rule: 'numeric',
      },
    },
    {
      name: 'Data\navailability',
      tooltip: 'Is the data needed to reconstruct the state available?',
      getValue: (project) => <RiskCell item={project.dataAvailability} />,
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.dataAvailability),
        rule: 'numeric',
      },
    },
    {
      name: 'Exit\nwindow',
      tooltip:
        'How much time do users have to exit the system in case of an unwanted upgrade?',
      getValue: (project) => <RiskCell item={project.exitWindow} />,
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.exitWindow),
        rule: 'numeric',
      },
    },
    {
      name: 'Sequencer\nfailure',
      tooltip:
        "Sequencer is an entity responsible for constructing blocks and deciding on the ordering of user's transactions. What happens if it is offline or censors individual user?",
      getValue: (project) => <RiskCell item={project.sequencerFailure} />,
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.sequencerFailure),
        rule: 'numeric',
      },
    },
    {
      name: 'Proposer\nfailure',
      tooltip:
        'Proposer is an entity responsible for submitting state commitments to Ethereum (optionally, along with the zkProof). What happens if it is offline?',
      getValue: (project) => <RiskCell item={project.proposerFailure} />,
      headClassName: '!pr-4',
      sorting: {
        getOrderValue: (project) =>
          getOrderValueBySentiment(project.proposerFailure),
        rule: 'numeric',
      },
    },
  ]
  return columns
}
