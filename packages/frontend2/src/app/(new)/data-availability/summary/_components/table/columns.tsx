import { type DaBridgeRisks, type DaLayerRisks } from '@l2beat/config'
import { createColumnHelper } from '@tanstack/react-table'
import { EM_DASH } from '~/app/_components/nav/consts'
import { RosetteCell } from '~/app/_components/rosette/rosette-cell'
import { formatNumber } from '~/utils/format-number'
import { mapRisksToRosetteValues as mapDaRisksToRosetteValues } from '../../../_utils/get-da-risks'
import { DaBridgeCell } from './da-bridge-cell'

interface OnChainBridge {
  type: 'OnChain'
  name: string
  network: string
}

interface DACBridge {
  type: 'DAC'
  name: string
  requiredMembers: number
  totalMembers: number
}

type DaBridge = OnChainBridge | DACBridge

export type DataAvailabilityProvider = {
  slug: string
  daLayer: string
  daBridge: DaBridge | null
  risks: DaBridgeRisks & DaLayerRisks
  layerType: string
  tvs: number
  economicSecurity: number
  usedBy: string[]
}

const columnHelper = createColumnHelper<DataAvailabilityProvider>()

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
      <RosetteCell values={mapDaRisksToRosetteValues(ctx.getValue())} />
    ),
    enableSorting: false,
    meta: {
      hash: '#risk-analysis',
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
    cell: (ctx) => `$${formatNumber(ctx.getValue(), 2)}`,
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
