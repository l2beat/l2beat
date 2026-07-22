import type { ProjectContract } from '@l2beat/config'

export function getProjectContractId(contract: ProjectContract): string {
  return 'id' in contract && contract.id ? contract.id : contract.name
}
