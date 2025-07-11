import { createColumnHelper } from '@tanstack/react-table'
import { ProjectNameCell } from '~/components/table/cells/ProjectNameCell'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { TableLink } from '~/components/table/TableLink'
import { getDaCommonProjectColumns } from '~/components/table/utils/common-project-columns/DaCommonProjectColumns'
import type { DaRiskEntry } from '~/server/features/data-availability/risks/getDaRiskEntries'
import { virtual, withSpanByBridges } from '../../../utils/ColUtils'

const columnHelper = createColumnHelper<DaRiskEntry>()

export const [indexColumn, logoColumn] = getDaCommonProjectColumns(
  columnHelper,
  (row) => `${row.href}#da-layer`,
)

const daLayerColumn = columnHelper.accessor('name', {
  header: 'DA Layer',
  cell: (ctx) => (
    <TableLink href={`${ctx.row.original.href}#da-layer`}>
      <ProjectNameCell project={ctx.row.original} />
    </TableLink>
  ),
  meta: {
    tooltip:
      'The data availability layer where the data (transaction data or state diffs) is posted.',
  },
})

const baseColumns = [
  withSpanByBridges(indexColumn),
  withSpanByBridges(logoColumn),
  withSpanByBridges(daLayerColumn),
]

const economicSecurityColumn = columnHelper.display({
  id: 'economic-security',
  header: 'Economic\nsecurity',
  cell: (ctx) => (
    <TableValueCell
      emptyMode="n/a"
      value={ctx.row.original.risks.economicSecurity}
    />
  ),
  meta: {
    tooltip:
      'Shows if there are any onchain (staked assets) or offchain (reputation) guarantees that would prevent a committee from deceiving the DA bridge.',
  },
})

const fraudDetectionColumn = columnHelper.display({
  id: 'fraud-detection',
  header: 'Fraud\ndetection',
  cell: (ctx) => (
    <TableValueCell
      emptyMode="n/a"
      value={ctx.row.original.risks.fraudDetection}
    />
  ),
  meta: {
    tooltip:
      'Shows if there are any mechanism for users to protect themselves against a malicious majority of committee members, such as validators, and recover from data withholding attack.',
  },
})

const daLayerRisksColumns = [
  columnHelper.group({
    header: 'Da Layer Risks',
    columns: [
      withSpanByBridges(economicSecurityColumn),
      withSpanByBridges(fraudDetectionColumn),
    ],
  }),
]

const spacerColumn = virtual(
  columnHelper.display({
    id: 'spacer',
    header: '',
    meta: {
      headClassName: 'px-4',
    },
  }),
)

const bridgeColumn = virtual(
  columnHelper.display({
    id: 'bridge',
    header: 'Bridge',
    meta: {
      headClassName: 'px-4',
      tooltip:
        'The DA bridge through which Ethereum is informed that data has been made available.',
    },
  }),
)

const committeeSecurityColumn = virtual(
  columnHelper.display({
    id: 'committee-security',
    header: 'Committee\nsecurity',
    meta: {
      tooltip:
        'Shows if the DA bridge can securely confirm that the data availability attestations are backed by the DA layer’s economic security, meaning that the signatures from the DA layer are accurately verified and tracked onchain.',
    },
  }),
)

const upgradeabilityColumn = virtual(
  columnHelper.display({
    id: 'upgradeability',
    header: 'Upgradeability',
    meta: {
      tooltip:
        'Shows if the DA bridge can be upgraded, and if yes - if there’s a mechanism in place for withdrawals, and the time allowed for users to exit in case of an upgrade. ',
    },
  }),
)

const relayerFailureColumn = virtual(
  columnHelper.display({
    id: 'relayer-failure',
    header: 'Relayer\nfailure',
    meta: {
      tooltip:
        'Shows if there is an additional trust assumption on the majority of committee members. It distinguishes between DA solutions that are integrated into the Ethereum protocol (enshrined) and those that are external, thus requiring an additional trust assumption.',
    },
  }),
)

const bridgeRisksColumns = [
  columnHelper.group({
    header: 'Bridge Risks',
    columns: [
      committeeSecurityColumn,
      upgradeabilityColumn,
      relayerFailureColumn,
    ],
  }),
]

export const publicColumns = [
  ...baseColumns,
  ...daLayerRisksColumns,
  bridgeColumn,
  ...bridgeRisksColumns,
]

export const customColumns = [
  ...baseColumns,
  ...daLayerRisksColumns,
  spacerColumn,
  ...bridgeRisksColumns,
]
