import { type DaBridgeRisks, type DaLayerRisks } from '@l2beat/config'
import { createColumnHelper } from '@tanstack/react-table'
import { SentimentText } from '~/app/_components/sentiment-text'
import { type DaSummaryEntryBridge } from '../../../_utils/get-da-bridge'
import { DaBridgeCell } from '../../../summary/_components/table/da-bridge-cell'

export type DaRiskEntry = {
  slug: string
  daLayer: string
  daBridge: DaSummaryEntryBridge | null
  risks: DaBridgeRisks & DaLayerRisks
}

const columnHelper = createColumnHelper<DaRiskEntry>()

export const columns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => ctx.row.index + 1,
  }),
  columnHelper.accessor('daLayer', {
    header: 'DA Layer',
  }),
  columnHelper.accessor('daBridge', {
    header: 'Da Bridge',
    cell: (ctx) => <DaBridgeCell daBridge={ctx.getValue()} />,
  }),
  columnHelper.accessor('risks.economicSecurity', {
    header: 'Economic security',
    cell: (ctx) => {
      const value = ctx.getValue()
      return (
        <SentimentText sentiment={value.sentiment}>{value.value}</SentimentText>
      )
    },
  }),
  columnHelper.accessor('risks.fraudDetection', {
    header: 'Fraud detection',
    cell: (ctx) => {
      const value = ctx.getValue()
      return (
        <SentimentText sentiment={value.sentiment}>{value.value}</SentimentText>
      )
    },
  }),
  columnHelper.accessor('risks.attestations', {
    header: 'Attestation security',
    cell: (ctx) => {
      const value = ctx.getValue()
      return (
        <SentimentText sentiment={value.sentiment}>{value.value}</SentimentText>
      )
    },
  }),
  columnHelper.accessor('risks.exitWindow', {
    header: 'Exit window',
    cell: (ctx) => {
      const value = ctx.getValue()
      return (
        <SentimentText sentiment={value.sentiment}>{value.value}</SentimentText>
      )
    },
  }),
  columnHelper.accessor('risks.accessibility', {
    header: 'Accessibility',
    cell: (ctx) => {
      const value = ctx.getValue()
      return (
        <SentimentText sentiment={value.sentiment}>{value.value}</SentimentText>
      )
    },
  }),
]
