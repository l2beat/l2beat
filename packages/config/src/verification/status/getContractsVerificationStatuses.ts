import { ScalingProjectContract } from '../../common'
import { Bridge, DaLayer, Layer2, Layer3 } from '../../projects'
import { getManuallyVerifiedContracts } from './getManuallyVerifiedContracts'

export function getContractsVerificationStatuses(
  project: Layer2 | Layer3 | Bridge | DaLayer,
) {
  const manual = getManuallyVerifiedContracts()

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
