import { Project } from '@l2beat/config'

export interface ContractDescription {
  name: string
  address: string
}

export function getContractProps(
  project: Project
): ContractDescription[] | undefined {
  if (!project.details.contracts) {
    return undefined
  }
  return project.details.contracts.map((contract) => ({
    name: contract.name,
    address: contract.address,
  }))
}
