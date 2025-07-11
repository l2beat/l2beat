import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import type { Permission } from '../config/PermissionConfig'
import type { ClingoFact } from './clingoparser'
import type { ModelIdRegistry } from './ModelIdRegistry'

export function parseUltimatePermissionFact(
  fact: ClingoFact,
  modelIdRegistry: ModelIdRegistry,
) {
  const delay = Number(fact.params[3])
  return {
    receiver: modelIdRegistry.idToChainSpecificAddress(String(fact.params[0])),
    permission: String(fact.params[1]) as Permission,
    from: modelIdRegistry.idToChainSpecificAddress(String(fact.params[2])),
    delay: delay === 0 ? undefined : delay,
    description: orUndefined(String, fact.params[4]),
    role: orUndefined(String, fact.params[5]),
    condition: orUndefined(String, fact.params[6]),
    via:
      fact.params[8] === undefined
        ? undefined
        : ((fact.params[8] as ClingoFact[]).map((x) =>
            parseUltimatePermissionVia(x, modelIdRegistry),
          ) ?? undefined),
    isFinal: fact.params[9] === 'isFinal',
  }
}

export type ParsedUltimatePermissionFact = ReturnType<
  typeof parseUltimatePermissionFact
>

export function parseUltimatePermissionVia(
  via: ClingoFact,
  modelIdRegistry: ModelIdRegistry,
) {
  const delay = Number(via.params[2])
  return {
    address: modelIdRegistry.idToChainSpecificAddress(String(via.params[0])),
    // permission: String(via.params[1]),
    delay: delay === 0 ? undefined : delay,
    condition: orUndefined(String, via.params[3]),
  }
}

export function parseEoaWithMajorityUpgradePermissionsFacts(
  facts: ClingoFact[],
  modelIdRegistry: ModelIdRegistry,
): ChainSpecificAddress[] | undefined {
  const result = facts.map((f) => {
    assert(f.atom === 'eoaWithMajorityUpgradePermissions')
    return modelIdRegistry.idToChainSpecificAddress(String(f.params[0]))
  })
  return result.length === 0 ? undefined : result
}

export function orUndefined<V, C>(
  caster: (value: V) => C,
  value: V | undefined,
): C | undefined {
  return value === undefined ? undefined : caster(value)
}
