import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import type { Permission } from '../config/PermissionConfig'
import type { ResolvedPermissionGroup } from '../output/types'
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
    permission: String(via.params[1]) as Permission,
    delay: delay === 0 ? undefined : delay,
    description: orUndefined(String, via.params[3]),
    role: orUndefined(String, via.params[4]),
    condition: orUndefined(String, via.params[5]),
  }
}

export function parseEoaWithUpgradePermissionsFacts(
  facts: ClingoFact[],
  modelIdRegistry: ModelIdRegistry,
): ChainSpecificAddress[] | undefined {
  const result = facts.map((f) => {
    assert(f.atom === 'eoaWithUpgradePermissions')
    return modelIdRegistry.idToChainSpecificAddress(String(f.params[0]))
  })
  return result.length === 0 ? undefined : result
}

export function parsePermissionGroupFacts(
  facts: ClingoFact[],
  modelIdRegistry: ModelIdRegistry,
): ResolvedPermissionGroup[] | undefined {
  const groups = new Map<string, ResolvedPermissionGroup>()

  for (const fact of facts) {
    assert(fact.atom === 'permissionGroup')
    const from = modelIdRegistry.idToChainSpecificAddress(
      String(fact.params[0]),
    )
    const member = modelIdRegistry.idToChainSpecificAddress(
      String(fact.params[1]),
    )
    const id = String(fact.params[2])
    const group: ResolvedPermissionGroup = {
      id,
      name: String(fact.params[3]),
      memberName: String(fact.params[4]),
      threshold: Number(fact.params[5]),
      members: [member],
      admin:
        fact.params[6] === undefined
          ? undefined
          : modelIdRegistry.idToChainSpecificAddress(String(fact.params[6])),
      permission: {
        from,
        permission: String(fact.params[7]) as Permission,
        description: orUndefined(String, fact.params[8]),
        role: orUndefined(String, fact.params[9]),
      },
      isProjectScoped: fact.params[10] === 'true' ? true : undefined,
    }
    const key = `${from.toLowerCase()}:${id}`
    const existing = groups.get(key)
    if (existing === undefined) {
      groups.set(key, group)
      continue
    }

    assert(
      samePermissionGroup(existing, group),
      `Inconsistent permission group ${id} on ${from}`,
    )
    if (!existing.members.includes(member)) {
      existing.members.push(member)
    }
  }

  if (groups.size === 0) {
    return undefined
  }
  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      members: group.members.sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) =>
      `${a.permission.from}:${a.id}`.localeCompare(
        `${b.permission.from}:${b.id}`,
      ),
    )
}

function samePermissionGroup(
  a: ResolvedPermissionGroup,
  b: ResolvedPermissionGroup,
): boolean {
  return (
    a.id === b.id &&
    a.name === b.name &&
    a.memberName === b.memberName &&
    a.threshold === b.threshold &&
    a.admin === b.admin &&
    JSON.stringify(a.permission) === JSON.stringify(b.permission) &&
    a.isProjectScoped === b.isProjectScoped
  )
}

export function orUndefined<V, C>(
  caster: (value: V) => C,
  value: V | undefined,
): C | undefined {
  return value === undefined ? undefined : caster(value)
}
