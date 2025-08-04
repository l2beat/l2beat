import type { TableReadyValue } from '../types'

const STATE_DIFFS: TableReadyValue = {
  value: 'State diffs',
}

const STATE_DIFFS_COMPRESSED: TableReadyValue = {
  value: 'State diffs',
  secondLine: 'Compressed',
}

const TRANSACTION_DATA: TableReadyValue = {
  value: 'Transaction data',
}

const TRANSACTION_DATA_COMPRESSED: TableReadyValue = {
  value: 'Transaction data',
  secondLine: 'Compressed',
}

const BALANCE_PROOF: TableReadyValue = {
  value: 'Balance proofs',
}

export const DA_MODES = {
  STATE_DIFFS,
  STATE_DIFFS_COMPRESSED,
  TRANSACTION_DATA,
  TRANSACTION_DATA_COMPRESSED,
  BALANCE_PROOF,
}
