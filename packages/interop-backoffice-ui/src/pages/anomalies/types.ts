import type { RouterOutputs } from '@l2beat/backend/interop-trpc'

export type SuspiciousTransfersResponse =
  RouterOutputs['anomalies']['suspiciousTransfers']
export type SuspiciousTransferRow = SuspiciousTransfersResponse['items'][number]
