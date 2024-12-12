import {
  type Bridge,
  type DaLayer,
  type Layer2,
  type Layer3,
  type ScalingProjectContract,
} from '@l2beat/config'
import { getManuallyVerifiedContracts } from './get-manually-verified-contracts'

type Project = Layer2 | Layer3 | Bridge | DaLayer

export function getContractsVerificationStatuses(project: Project) {
  const manual = getManuallyVerifiedContracts(project)

  const contracts: ScalingProjectContract[] = []
  if ('contracts' in project) {
    contracts.push(...(project.contracts?.addresses ?? []))
  }
  const result: Record<string, Record<string, boolean>> = {}
  for (const contract of contracts) {
    if ('address' in contract) {
      const chain = contract.chain ?? 'ethereum'
      result[chain] ??= {}
      result[chain][contract.address.toString()] =
        contract.address.toString() in (manual[chain] ?? {}) ||
        contract.isVerified
    }
  }

  return result
}
