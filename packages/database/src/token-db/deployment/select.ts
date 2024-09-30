import { DeploymentRecord } from './entity'

export const selectDeployment = [
  'id',
  'tokenId',
  'txHash',
  'blockNumber',
  'timestamp',
  'from',
  'to',
  'isDeployerEoa',
  'sourceAvailable',
  'updatedAt',
  'createdAt',
] as const satisfies (keyof DeploymentRecord)[]
