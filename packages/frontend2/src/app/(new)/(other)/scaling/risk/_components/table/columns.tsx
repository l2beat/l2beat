import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { RiskCell } from '~/app/_components/table/cells/risk-cell'
import { sortSentiments } from '~/app/_components/table/sorting/functions/sentiment-sorting'
import { type ScalingRiskEntry } from '~/server/features/scaling/risks/get-scaling-risk-entries'

const columnHelper = createColumnHelper<ScalingRiskEntry>()

export const scalingRiskColumns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{ctx.row.index + 1}</IndexCell>,
    meta: {
      headClassName: 'w-0',
    },
    size: 44.55,
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <Image
        className="min-h-[18px] min-w-[18px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={18}
        height={18}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    size: 26,
    meta: {
      headClassName: 'w-0',
      cellClassName: 'lg:!pr-0',
    },
  }),
  columnHelper.accessor('name', {
    cell: (ctx) => (
      <ProjectNameCell
        project={ctx.row.original}
        type={ctx.row.original.type}
      />
    ),
  }),
  columnHelper.accessor('risks.stateValidation', {
    header: 'State\nValidation',
    meta: {
      tooltip: 'How is the validity of the system state checked?',
    },
    cell: (ctx) => <RiskCell risk={ctx.getValue()} />,
    sortingFn: (a, b) =>
      sortSentiments(
        a.original.risks.stateValidation,
        b.original.risks.stateValidation,
      ),
  }),
  columnHelper.accessor('risks.dataAvailability', {
    header: 'Data\nAvailability',
    meta: {
      tooltip: 'Is the data needed to reconstruct the state available?',
    },
    cell: (ctx) => <RiskCell risk={ctx.getValue()} />,
    sortingFn: (a, b) =>
      sortSentiments(
        a.original.risks.dataAvailability,
        b.original.risks.dataAvailability,
      ),
  }),
  columnHelper.accessor('risks.exitWindow', {
    header: 'Exit\nWindow',
    meta: {
      tooltip:
        'How much time do users have to exit the system in case of an unwanted upgrade?',
    },
    cell: (ctx) => <RiskCell risk={ctx.getValue()} />,
    sortingFn: (a, b) =>
      sortSentiments(a.original.risks.exitWindow, b.original.risks.exitWindow),
  }),
  columnHelper.accessor('risks.sequencerFailure', {
    header: 'Sequencer\nFailure',
    meta: {
      tooltip:
        "Sequencer is an entity responsible for constructing blocks and deciding on the ordering of user's transactions. What happens if it is offline or censors individual user?",
    },
    cell: (ctx) => <RiskCell risk={ctx.getValue()} />,
    sortingFn: (a, b) =>
      sortSentiments(
        a.original.risks.sequencerFailure,
        b.original.risks.sequencerFailure,
      ),
  }),
  columnHelper.accessor('risks.proposerFailure', {
    header: 'Proposer\nFailure',
    meta: {
      tooltip:
        'Proposer is an entity responsible for submitting state commitments to Ethereum (optionally, along with the zkProof). What happens if it is offline?',
    },
    cell: (ctx) => <RiskCell risk={ctx.getValue()} />,
    sortingFn: (a, b) =>
      sortSentiments(
        a.original.risks.proposerFailure,
        b.original.risks.proposerFailure,
      ),
  }),
]
