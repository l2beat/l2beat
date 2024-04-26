import { UnixTime } from '@l2beat/shared-pure'

export interface DetailedTransactionBase {
  timestamp: UnixTime
  calldataGasUsed: number
  computeGasUsed: number
  overheadGasUsed: number
  totalGas: number
  gasCost: number
  calldataGasCost: number
  computeGasCost: number
  totalGasCost: number
  totalOverheadGasCost: number
  gasCostUsd: number
  calldataGasCostUsd: number
  computeGasCostUsd: number
  totalGasCostUsd: number
  totalOverheadGasCostUsd: number
}

interface DetailedType2Transaction extends DetailedTransactionBase {
  type: 2
}
interface DetailedType3Transaction extends DetailedTransactionBase {
  type: 3
  blobGasCost: number
  blobGasUsed: number
  blobGasCostUsd: number
}
export type DetailedTransaction =
  | DetailedType2Transaction
  | DetailedType3Transaction
