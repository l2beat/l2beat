import { ScalingProjectContract } from '../../common'
import { Bridge, DaLayer, Layer2, Layer3 } from '../../projects'

export function getContractsVerificationStatuses(
  project: Layer2 | Layer3 | Bridge | DaLayer,
) {
  const contracts: ScalingProjectContract[] = []
  if ('contracts' in project) {
    contracts.push(...(project.contracts?.addresses ?? []))
  }

  const result: Record<string, Record<string, boolean>> = {}
  for (const c of contracts) {
    const chain = c.chain ?? 'ethereum'
    result[chain] ??= {}
    result[chain][c.address.toString()] = c.isVerified
  }

  return result
}
