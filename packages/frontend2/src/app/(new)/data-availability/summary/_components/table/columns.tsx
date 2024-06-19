import { type DaBridgeRisks } from '@l2beat/config/build/src/projects/other/da-beat/types/DaBridge'
import { type DaLayerRisks } from '@l2beat/config/build/src/projects/other/da-beat/types/DaLayer'
import { createColumnHelper } from '@tanstack/react-table'
import { EM_DASH } from '~/app/_components/nav/consts'
import { RosetteCell } from '~/app/_components/rosette/rosette-cell'
import { type RosetteValue } from '~/app/_components/rosette/types'
import { type DaSummaryEntry } from '~/server/features/data-availability/get-da-summary-entries'
import { formatNumber } from '~/utils/format-number'
import { DaBridgeCell } from './da-bridge-cell'

const columnHelper = createColumnHelper<DaSummaryEntry>()

export function mapRisksToRosetteValues(
  risks: DaBridgeRisks & DaLayerRisks,
): RosetteValue[] {
  const values: RosetteValue[] = [
    {
      name: 'Economic security',
      value: risks.economicSecurity.value,
      sentiment: risks.economicSecurity.sentiment,
    },
    {
      name: 'Fraud detection',
      value: risks.fraudDetection.value,
      sentiment: risks.fraudDetection.sentiment,
    },
    {
      name: 'Attestations',
      value: risks.attestations.value,
      sentiment: risks.attestations.sentiment,
    },
    {
      name: 'Exit window',
      value: risks.exitWindow.value,
      sentiment: risks.exitWindow.sentiment,
    },
    {
      name: 'Accessibility',
      value: risks.accessibility.value,
      sentiment: risks.accessibility.sentiment,
    },
  ]

  return values
}

export const columns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => ctx.row.index + 1,
  }),
  columnHelper.accessor('daLayer', {
    header: 'DA Layer',
  }),
  columnHelper.accessor('daBridge', {
    header: 'DA Bridge',
    cell: (ctx) => <DaBridgeCell daBridge={ctx.getValue()} />,
  }),
  columnHelper.accessor('risks', {
    header: 'Risks',
    cell: (ctx) => (
      <RosetteCell values={mapRisksToRosetteValues(ctx.getValue())} />
    ),
    enableSorting: false,
    meta: {
      hash: 'risk-analysis',
    },
  }),
  columnHelper.accessor('layerType', {
    header: 'Layer type',
  }),
  columnHelper.accessor('tvs', {
    header: 'Total value secured',
    cell: (ctx) => `$${formatNumber(ctx.getValue(), 2)}`,
  }),
  columnHelper.accessor('economicSecurity', {
    header: 'Economic security',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (!value) return EM_DASH
      if (value.status === 'StakeNotSynced') return 'Stake not synced'
      if (value.status === 'CurrentPriceNotSynced')
        return 'Current price not synced'
      return `$${formatNumber(value.economicSecurity, 0)}`
    },
  }),
  columnHelper.accessor('usedBy', {
    header: 'Used by',
    cell: (ctx) => {
      const value = ctx.getValue()
      return value.length > 0 ? value.join(', ') : EM_DASH
    },
    enableSorting: false,
  }),
]
