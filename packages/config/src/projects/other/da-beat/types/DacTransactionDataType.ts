const TransactionDataCompressed = {
  type: 'TransactionDataCompressed',
  value: 'Transaction data (compressed)',
  description: 'TODO',
} as const

const TransactionData = {
  type: 'TransactionData',
  value: 'Transaction data',
  description: 'TODO',
} as const

const StateDiffsCompressed = {
  type: 'StateDiffsCompressed',
  value: 'State diffs (compressed)',
  description: 'TODO',
} as const

const StateDiffs = {
  type: 'StateDiffs',
  value: 'State diffs',
  description: 'TODO',
} as const

export const DacTransactionDataType = {
  TransactionDataCompressed,
  TransactionData,
  StateDiffsCompressed,
  StateDiffs,
}

export type DacTransactionDataType =
  (typeof DacTransactionDataType)[keyof typeof DacTransactionDataType]
