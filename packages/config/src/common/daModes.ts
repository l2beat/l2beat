import type { DataAvailabilityMode } from '../types'

const STATE_DIFFS: DataAvailabilityMode = {
  value: 'State diffs',
}

const STATE_DIFFS_COMPRESSED: DataAvailabilityMode = {
  value: 'State diffs',
  secondLine: 'Compressed',
}

const TRANSACTION_DATA: DataAvailabilityMode = {
  value: 'Transaction data',
}

const TRANSACTION_DATA_COMPRESSED: DataAvailabilityMode = {
  value: 'Transaction data',
  secondLine: 'Compressed',
}

export const DA_MODES = {
  STATE_DIFFS,
  STATE_DIFFS_COMPRESSED,
  TRANSACTION_DATA,
  TRANSACTION_DATA_COMPRESSED,
}
