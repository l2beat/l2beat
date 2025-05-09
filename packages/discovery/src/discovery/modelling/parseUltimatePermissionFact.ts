import { assert, EthereumAddress } from '@l2beat/shared-pure'
import type { Permission } from '../config/PermissionConfig'
import type { ModelIdRegistry } from './ModelIdRegistry'
import type { ClingoFact } from './clingoparser'

export function parseUltimatePermissionFact(
  fact: ClingoFact,
  modelIdRegistry: ModelIdRegistry,
) {
  const delay = Number(fact.params[3])
  // const totalDelay = Number(fact.params[6])
  const receiverData = modelIdRegistry.getAddressData(String(fact.params[0]))
  return {
    receiver: modelIdRegistry.idToChainPrefixedAddress(String(fact.params[0])),
    receiverChain: receiverData.chain,
    permission: String(fact.params[1]) as Permission,
    from: EthereumAddress(
      modelIdRegistry.idToChainPrefixedAddress(String(fact.params[2])),
    ),
    delay: delay === 0 ? undefined : delay,
    description: orUndefined(String, fact.params[4]),
    condition: orUndefined(String, fact.params[5]),
    // totalDelay: totalDelay === 0 ? undefined : totalDelay,
    via:
      fact.params[7] === undefined
        ? undefined
        : ((fact.params[7] as ClingoFact[]).map((x) =>
            parseUltimatePermissionVia(x, modelIdRegistry),
          ) ?? undefined),
    isFinal: fact.params[8] === 'isFinal',
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
    address: EthereumAddress(
      modelIdRegistry.idToChainPrefixedAddress(String(via.params[0])),
    ),
    // permission: String(via.params[1]),
    delay: delay === 0 ? undefined : delay,
    condition: orUndefined(String, via.params[3]),
  }
}

export function parseEoaWithMajorityUpgradePermissionsFacts(
  facts: ClingoFact[],
  modelIdRegistry: ModelIdRegistry,
): EthereumAddress[] | undefined {
  const result = facts.map((f) => {
    assert(f.atom === 'eoaWithMajorityUpgradePermissions')
    return EthereumAddress(
      modelIdRegistry.idToChainPrefixedAddress(String(f.params[0])),
    )
  })
  return result.length === 0 ? undefined : result
}

export function orUndefined<V, C>(
  caster: (value: V) => C,
  value: V | undefined,
): C | undefined {
  return value === undefined ? undefined : caster(value)
}
