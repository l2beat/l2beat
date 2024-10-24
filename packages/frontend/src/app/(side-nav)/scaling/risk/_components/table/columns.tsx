import { createColumnHelper } from '@tanstack/react-table'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { RiskCell } from '~/components/table/cells/risk-cell'
import { sortByExitWindow } from '~/components/table/sorting/functions/sort-by-exit-window'
import {
  sortBySentiment,
  sortBySentimentAndAlphabetically,
} from '~/components/table/sorting/functions/sort-by-sentiment'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns'
import { type ScalingRiskEntry } from '~/server/features/scaling/risks/get-scaling-risk-entries'

const columnHelper = createColumnHelper<ScalingRiskEntry>()

export const scalingRiskColumns = [
  ...getCommonProjectColumns(columnHelper),
  columnHelper.accessor('name', {
    cell: (ctx) => <ProjectNameCell project={ctx.row.original} />,
  }),
  columnHelper.accessor(
    (e) => {
      const value = e.risks.stateValidation.value
      if (value === 'Under Review' || value === '') return undefined
      return value
    },
    {
      header: 'State\nValidation',
      meta: {
        tooltip: 'How is the validity of the system state checked?',
      },
      cell: (ctx) => <RiskCell risk={ctx.row.original.risks.stateValidation} />,
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortBySentimentAndAlphabetically(
          a.original.risks.stateValidation,
          b.original.risks.stateValidation,
        ),
    },
  ),
  columnHelper.accessor(
    (e) => {
      const value = e.risks.dataAvailability.value
      if (value === 'Under Review' || value === '') return undefined
      return value
    },
    {
      header: 'Data\nAvailability',
      meta: {
        tooltip: 'Is the data needed to reconstruct the state available?',
      },
      cell: (ctx) => (
        <RiskCell risk={ctx.row.original.risks.dataAvailability} />
      ),
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortBySentimentAndAlphabetically(
          a.original.risks.dataAvailability,
          b.original.risks.dataAvailability,
        ),
    },
  ),
  columnHelper.accessor(
    (e) => {
      const value = e.risks.exitWindow.value
      if (value === 'Under Review' || value === '') return undefined
      return value
    },
    {
      header: 'Exit\nWindow',
      meta: {
        tooltip:
          'How much time do users have to exit the system in case of an unwanted upgrade?',
      },
      cell: (ctx) => <RiskCell risk={ctx.row.original.risks.exitWindow} />,
      sortUndefined: 'last',
      sortingFn: (a, b) => {
        const sentimentResult = sortBySentiment(
          a.original.risks.exitWindow,
          b.original.risks.exitWindow,
        )
        if (sentimentResult !== 0) {
          return sentimentResult
        }

        const exitWindowResult = sortByExitWindow(
          a.original.risks.exitWindow.definingMetric ?? 0,
          b.original.risks.exitWindow.definingMetric ?? 0,
        )
        if (exitWindowResult !== 0) {
          return exitWindowResult
        }

        return a.original.name.localeCompare(b.original.name)
      },
    },
  ),
  columnHelper.accessor(
    (e) => {
      const value = e.risks.sequencerFailure.value
      if (value === 'Under Review' || value === '') return undefined
      return value
    },
    {
      header: 'Sequencer\nFailure',
      meta: {
        tooltip:
          "Sequencer is an entity responsible for constructing blocks and deciding on the ordering of user's transactions. What happens if it is offline or censors individual user?",
      },
      cell: (ctx) => (
        <RiskCell risk={ctx.row.original.risks.sequencerFailure} />
      ),
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortBySentimentAndAlphabetically(
          a.original.risks.sequencerFailure,
          b.original.risks.sequencerFailure,
        ),
    },
  ),
  columnHelper.accessor(
    (e) => {
      const value = e.risks.proposerFailure.value
      if (value === 'Under Review' || value === '') return undefined
      return value
    },
    {
      header: 'Proposer\nFailure',
      meta: {
        tooltip:
          'Proposer is an entity responsible for submitting state commitments to Ethereum (optionally, along with the zkProof). What happens if it is offline?',
      },
      cell: (ctx) => <RiskCell risk={ctx.row.original.risks.proposerFailure} />,
      sortUndefined: 'last',
      sortingFn: (a, b) =>
        sortBySentimentAndAlphabetically(
          a.original.risks.proposerFailure,
          b.original.risks.proposerFailure,
        ),
    },
  ),
]
