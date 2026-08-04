export const INTEROP_TRANSFER_DATA_RANGES = [
  'last24h',
  'lastPromoted',
  'all',
] as const

export type InteropTransferDataRange =
  (typeof INTEROP_TRANSFER_DATA_RANGES)[number]

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
