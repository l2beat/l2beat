import type { Bridge } from '../projects/bridges'
import type { DaLayer } from '../projects/da-beat'
import type { Layer2 } from '../projects/layer2s'
import type { Layer3 } from '../projects/layer3s'
import type { ScalingProjectContract } from '../types'

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
