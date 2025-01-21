import type { L2Cost } from '../../kysely/generated/types'

export const selectL2Cost = [
  'blobGasPrice',
  'blobGasUsed',
  'calldataGasUsed',
  'calldataLength',
  'gasPrice',
  'gasUsed',
  'timestamp',
  'configurationId',
  'txHash',
] as const satisfies (keyof L2Cost)[]
