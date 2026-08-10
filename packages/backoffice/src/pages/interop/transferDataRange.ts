import type { BackendRouterInputs } from '@l2beat/backend/trpc'
import { useSearchParams } from 'react-router-dom'

export type InteropTransferDataRange = NonNullable<
  NonNullable<BackendRouterInputs['interop']['transfers']['stats']>['range']
>

export const INTEROP_TRANSFER_DATA_RANGES = [
  'last24h',
  'lastPromoted',
  'all',
] as const satisfies readonly InteropTransferDataRange[]

export const DEFAULT_INTEROP_TRANSFER_DATA_RANGE = 'last24h'

export function parseInteropTransferDataRange(
  value: string | null,
): InteropTransferDataRange {
  return INTEROP_TRANSFER_DATA_RANGES.includes(
    value as InteropTransferDataRange,
  )
    ? (value as InteropTransferDataRange)
    : DEFAULT_INTEROP_TRANSFER_DATA_RANGE
}

export function useTransferDataRange() {
  const [searchParams, setSearchParams] = useSearchParams()
  const range = parseInteropTransferDataRange(searchParams.get('range'))

  const setRange = (nextRange: InteropTransferDataRange) => {
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('range', nextRange)
    setSearchParams(nextSearchParams)
  }

  return [range, setRange] as const
}
