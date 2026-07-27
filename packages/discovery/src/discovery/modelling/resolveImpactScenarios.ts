import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import merge from 'lodash/merge'
import type { TemplateService } from '../analysis/TemplateService'
import type {
  ContractPermission,
  PermissionsConfig,
  RawPermissionConfiguration,
} from '../config/PermissionConfig'
import type {
  DiscoveryOutput,
  PermissionsOutput,
  ResolvedImpactPath,
  ResolvedImpactPrincipal,
  ResolvedImpactScenario,
  ResolvedImpactSource,
  ResolvedImpactStep,
  ResolvedImpactTrace,
  ResolvedPermissionGroup,
  StructureEntry,
} from '../output/types'
import { toAddressArray } from '../utils/extractors'
import { interpolateString } from '../utils/interpolateString'
import {
  composeEffects,
  type EffectModel,
  type EffectRule,
  type EffectSource,
  type EffectTerminal,
  type EffectTrace,
  type LocalEffectFragment,
  type TerminalEffect,
} from './composeEffects'
import { getPermissionsDefinedOnFields } from './relations'

export interface ImpactProjectInput {
  discovery: DiscoveryOutput
  permissions: PermissionsConfig
}

interface ResolvedContract {
  entry: StructureEntry
  permissions: ContractPermission
}

interface SourceMetadata extends ResolvedImpactSource {}

/**
 * Resolves template-local effects against discovered addresses, then composes
 * them without interpreting their prose.
 */
export function resolveImpactScenarios(
  projects: readonly ImpactProjectInput[],
  permissionsOutput: PermissionsOutput,
  templateService: TemplateService,
): ResolvedImpactScenario[] | undefined {
  const contracts = resolveContracts(projects, templateService)
  const principals = new Map<string, ResolvedImpactPrincipal>()
  const sourceMetadata = new Map<string, SourceMetadata>()
  const ruleMetadata = new Map<string, ResolvedImpactStep>()
  const sources: EffectSource<string>[] = []
  const rules: EffectRule[] = []
  const terminals: EffectTerminal[] = []

  const groups = new Map(
    (permissionsOutput.permissionGroups ?? []).map((group) => [
      permissionGroupKey(group.permission.from, group.id),
      group,
    ]),
  )

  for (const contract of contracts.values()) {
    resolvePermissionEffectSources(
      contract,
      permissionsOutput,
      groups,
      principals,
      sourceMetadata,
      sources,
    )
    resolveEffectRules(contract, ruleMetadata, rules, terminals)
  }

  resolveBlackBoxAssumptions(
    contracts,
    principals,
    sourceMetadata,
    sources,
    rules,
  )

  if (sources.length === 0 || terminals.length === 0) {
    return undefined
  }

  const model: EffectModel<string> = { sources, rules, terminals }
  const composed = composeEffects(model)
  const minimalTerminals = removeDominatedCoalitions(composed.terminals)
  const scenarios = collapseResolvedScenarios(
    minimalTerminals.map((terminal) =>
      toResolvedScenario(terminal, principals, sourceMetadata, ruleMetadata),
    ),
  )

  return scenarios.length === 0
    ? undefined
    : scenarios.sort((a, b) => a.id.localeCompare(b.id))
}

function resolveContracts(
  projects: readonly ImpactProjectInput[],
  templateService: TemplateService,
): Map<string, ResolvedContract> {
  const result = new Map<string, ResolvedContract>()

  for (const { discovery, permissions } of projects) {
    for (const entry of discovery.entries) {
      if (entry.type === 'Reference') {
        continue
      }
      const template = entry.template
        ? templateService.loadContractPermissionTemplate(entry.template)
        : undefined
      const merged = merge(
        {},
        template,
        permissions.overrides?.[entry.address.toString()],
      ) as ContractPermission
      result.set(entry.address.toLowerCase(), { entry, permissions: merged })
    }
  }

  return result
}

function resolvePermissionEffectSources(
  contract: ResolvedContract,
  permissionsOutput: PermissionsOutput,
  groups: ReadonlyMap<string, ResolvedPermissionGroup>,
  principals: Map<string, ResolvedImpactPrincipal>,
  sourceMetadata: Map<string, SourceMetadata>,
  sources: EffectSource<string>[],
) {
  const issued = getPermissionsDefinedOnFields(
    contract.permissions,
    contract.entry,
  ).filter((permission) => (permission.effects?.length ?? 0) > 0)

  for (const permission of issued) {
    if (permission.id === undefined) {
      throw new Error(
        `Effect-bearing permission on ${contract.entry.name ?? contract.entry.address} must define an id`,
      )
    }
    const role = permission.role ?? '.' + permission.field
    const description = interpolateString(
      permission.description,
      contract.entry,
    )

    if (permission.group !== undefined) {
      const group = groups.get(
        permissionGroupKey(contract.entry.address, permission.id),
      )
      if (group === undefined) {
        throw new Error(
          `Resolved permission group ${permission.id} not found on ${contract.entry.address}`,
        )
      }
      const principal = principalFromGroup(group)
      const principalKey = principal.key
      principals.set(principalKey, principal)
      addPermissionEffects(
        permission,
        contract.entry,
        principalKey,
        principal,
        description,
        sourceMetadata,
        sources,
      )
      continue
    }

    const matching = permissionsOutput.permissions.filter(
      (resolved) =>
        resolved.isFinal &&
        sameAddress(resolved.from, contract.entry.address) &&
        resolved.permission === permission.type &&
        resolved.role === role &&
        resolved.description === description,
    )
    for (const resolved of matching) {
      const principalKey = addressPrincipalKey(resolved.receiver)
      const principal: ResolvedImpactPrincipal = {
        type: 'address',
        address: resolved.receiver,
      }
      principals.set(principalKey, principal)
      const viaCapability = resolved.via?.at(-1)?.description
      addPermissionEffects(
        permission,
        contract.entry,
        principalKey,
        principal,
        viaCapability ?? description,
        sourceMetadata,
        sources,
        resolved.via?.map((step) => step.address).join('>'),
      )
    }
  }
}

function addPermissionEffects(
  permission: RawPermissionConfiguration,
  entry: StructureEntry,
  principalKey: string,
  _principal: ResolvedImpactPrincipal,
  capability: string | undefined,
  sourceMetadata: Map<string, SourceMetadata>,
  sources: EffectSource<string>[],
  pathDiscriminator = '',
) {
  for (const effect of permission.effects ?? []) {
    const capabilityId = JSON.stringify([
      'permission-effect',
      entry.address,
      permission.id,
      principalKey,
      pathDiscriminator,
    ])
    const id = JSON.stringify([capabilityId, effect.id])
    const fragment = interpolateFragment(
      {
        description: effect.description,
        limitation: effect.limitation,
      },
      entry,
    )
    if (sourceMetadata.has(id)) {
      continue
    }
    sources.push({
      id,
      effect: { address: entry.address, effect: effect.id },
      principals: [principalKey],
      fragment,
    })
    sourceMetadata.set(id, {
      id,
      capabilityId,
      principal: principalKey,
      contract: entry.address,
      effect: effect.id,
      capability,
      ...fragment,
    })
  }
}

function resolveEffectRules(
  contract: ResolvedContract,
  ruleMetadata: Map<string, ResolvedImpactStep>,
  rules: EffectRule[],
  terminals: EffectTerminal[],
) {
  for (const rule of contract.permissions.effectRules ?? []) {
    if (rule.impact !== undefined && !rule.terminal) {
      throw new Error(
        `Effect rule "${rule.id}" on ${contract.entry.name ?? contract.entry.address} defines an impact but is not terminal`,
      )
    }
    if (rule.categories !== undefined && rule.impact === undefined) {
      throw new Error(
        `Effect rule "${rule.id}" on ${contract.entry.name ?? contract.entry.address} defines impact categories but no impact`,
      )
    }
    if (rule.categories?.length === 0) {
      throw new Error(
        `Effect rule "${rule.id}" on ${contract.entry.name ?? contract.entry.address} defines an empty impact category list`,
      )
    }
    if (
      rule.categories !== undefined &&
      new Set(rule.categories).size !== rule.categories.length
    ) {
      throw new Error(
        `Effect rule "${rule.id}" on ${contract.entry.name ?? contract.entry.address} defines duplicate impact categories`,
      )
    }
    if (rule.protection !== undefined && !rule.terminal) {
      throw new Error(
        `Effect rule "${rule.id}" on ${contract.entry.name ?? contract.entry.address} defines a protection but is not terminal`,
      )
    }
    if (rule.impact !== undefined && rule.protection !== undefined) {
      throw new Error(
        `Terminal effect rule "${rule.id}" on ${contract.entry.name ?? contract.entry.address} cannot define both an impact and a protection`,
      )
    }
    if (
      rule.terminal &&
      rule.impact === undefined &&
      rule.protection === undefined
    ) {
      throw new Error(
        `Terminal effect rule "${rule.id}" on ${contract.entry.name ?? contract.entry.address} must define an impact or protection`,
      )
    }

    const inputs = rule.inputs.map((input) => {
      if (input.field === undefined) {
        return [
          { address: contract.entry.address.toString(), effect: input.effect },
        ]
      }
      const addresses = toAddressArray(contract.entry.values?.[input.field])
      if (addresses.length === 0) {
        throw new Error(
          `Effect rule "${rule.id}" on ${contract.entry.name ?? contract.entry.address} has no address in field "${input.field}"`,
        )
      }
      return addresses.map((address) => ({
        address: address.toString(),
        effect: input.effect,
      }))
    })

    for (const [index, combination] of cartesianProduct(inputs).entries()) {
      const id = JSON.stringify([
        'effect-rule',
        contract.entry.address,
        rule.id,
        index,
      ])
      const output = {
        address: contract.entry.address.toString(),
        effect: rule.output,
      }
      const fragment = interpolateFragment(
        {
          description: rule.description,
          impact: rule.impact,
          categories: rule.categories,
          limitation: rule.limitation,
          protection: rule.protection,
        },
        contract.entry,
      )
      rules.push({ id, inputs: combination, output, fragment })
      ruleMetadata.set(id, {
        ruleId: id,
        ruleDefinition: {
          template: contract.entry.template,
          id: rule.id,
        },
        contract: contract.entry.address,
        inputs: combination.map((input) => ({
          address: ChainSpecificAddress(input.address),
          effect: input.effect,
        })),
        output: rule.output,
        ...fragment,
      })
      if (rule.terminal) {
        terminals.push({
          id: JSON.stringify([
            'effect-terminal',
            contract.entry.address,
            rule.id,
            index,
          ]),
          effect: output,
        })
      }
    }
  }
}

function resolveBlackBoxAssumptions(
  contracts: ReadonlyMap<string, ResolvedContract>,
  principals: Map<string, ResolvedImpactPrincipal>,
  sourceMetadata: Map<string, SourceMetadata>,
  sources: EffectSource<string>[],
  rules: readonly EffectRule[],
) {
  const possibleEffects = new Set<string>()
  for (const source of sources) {
    possibleEffects.add(effectKey(source.effect.address, source.effect.effect))
  }
  for (const rule of rules) {
    possibleEffects.add(effectKey(rule.output.address, rule.output.effect))
  }

  for (const contract of contracts.values()) {
    for (const assumption of contract.permissions.effectAssumptions ?? []) {
      const addresses = toAddressArray(
        contract.entry.values?.[assumption.field],
      )
      if (addresses.length === 0) {
        throw new Error(
          `Effect assumption on ${contract.entry.name ?? contract.entry.address} has no address in field "${assumption.field}"`,
        )
      }

      for (const address of addresses) {
        const upstream = contracts.get(address.toLowerCase())
        for (const effect of assumption.effects) {
          const key = effectKey(address, effect.id)
          if (possibleEffects.has(key)) {
            continue
          }
          if (upstream !== undefined && hasEffectModel(upstream.permissions)) {
            throw new Error(
              `Modeled dependency ${upstream.entry.name ?? address} does not produce required effect "${effect.id}"`,
            )
          }

          const principalKey = addressPrincipalKey(address)
          const principal: ResolvedImpactPrincipal = {
            type: 'address',
            address,
          }
          principals.set(principalKey, principal)
          const id = JSON.stringify([
            'black-box-effect',
            contract.entry.address,
            assumption.field,
            address,
            effect.id,
          ])
          const capabilityId = JSON.stringify([
            'black-box-capability',
            contract.entry.address,
            assumption.field,
            address,
          ])
          const fragment = interpolateFragment(
            {
              description: effect.description,
              limitation: effect.limitation,
            },
            contract.entry,
          )
          sources.push({
            id,
            effect: { address: address.toString(), effect: effect.id },
            principals: [principalKey],
            fragment,
          })
          sourceMetadata.set(id, {
            id,
            capabilityId,
            principal: principalKey,
            contract: address,
            effect: effect.id,
            dependencyName: interpolateString(assumption.name, contract.entry),
            capability: interpolateString(
              assumption.description,
              contract.entry,
            ),
            ...fragment,
          })
          possibleEffects.add(key)
        }
      }
    }
  }
}

function toResolvedScenario(
  terminal: TerminalEffect<string>,
  principals: ReadonlyMap<string, ResolvedImpactPrincipal>,
  sourceMetadata: ReadonlyMap<string, SourceMetadata>,
  ruleMetadata: ReadonlyMap<string, ResolvedImpactStep>,
): ResolvedImpactScenario {
  const sourceIds: string[] = []
  const ruleIds: string[] = []
  collectTraceIds(terminal.trace, sourceIds, ruleIds)

  const resolvedPrincipals = terminal.principals.map((key) => {
    const principal = principals.get(key)
    if (principal === undefined) {
      throw new Error(`Impact principal "${key}" is not resolved`)
    }
    return principal
  })
  const resolvedSources = unique(sourceIds).map((id) => {
    const source = sourceMetadata.get(id)
    if (source === undefined) {
      throw new Error(`Impact source "${id}" is not resolved`)
    }
    return source
  })
  const resolvedSteps = unique(ruleIds).map((id) => {
    const step = ruleMetadata.get(id)
    if (step === undefined) {
      throw new Error(`Impact rule "${id}" is not resolved`)
    }
    return step
  })

  const resolvedTerminal = {
    address: ChainSpecificAddress(terminal.effect.address),
    effect: terminal.effect.effect,
  }

  return {
    id: terminal.id,
    principals: resolvedPrincipals,
    sources: resolvedSources,
    steps: resolvedSteps,
    terminals: [resolvedTerminal],
    paths: [
      {
        terminal: resolvedTerminal,
        trace: toResolvedImpactTrace(terminal.trace),
      },
    ],
  }
}

function toResolvedImpactTrace(
  trace: EffectTrace<string>,
): ResolvedImpactTrace {
  if (trace.type === 'source') {
    return { type: 'source', sourceId: trace.sourceId }
  }
  return {
    type: 'rule',
    ruleId: trace.ruleId,
    inputs: trace.inputs.map(toResolvedImpactTrace),
  }
}

function collapseResolvedScenarios(
  scenarios: ResolvedImpactScenario[],
): ResolvedImpactScenario[] {
  const grouped = new Map<string, ResolvedImpactScenario[]>()
  for (const scenario of scenarios) {
    const key = JSON.stringify([
      scenario.principals.map(impactPrincipalKey).sort(),
      unique(scenario.sources.map((source) => source.capabilityId)).sort(),
    ])
    const existing = grouped.get(key) ?? []
    existing.push(scenario)
    grouped.set(key, existing)
  }

  return Array.from(grouped.entries()).map(([key, group]) => ({
    id: `scenario:${createHash('sha256').update(key).digest('hex')}`,
    principals: uniqueBy(
      group.flatMap((scenario) => scenario.principals),
      impactPrincipalKey,
    ),
    sources: uniqueBy(
      group.flatMap((scenario) => scenario.sources),
      (source) => source.id,
    ),
    steps: uniqueBy(
      group.flatMap((scenario) => scenario.steps),
      (step) => step.ruleId,
    ),
    terminals: uniqueBy(
      group.flatMap((scenario) => scenario.terminals),
      (terminal) => `${terminal.address.toLowerCase()}:${terminal.effect}`,
    ),
    paths: uniqueBy(
      group.flatMap((scenario) => scenario.paths),
      impactPathKey,
    ),
  }))
}

function impactPathKey(path: ResolvedImpactPath): string {
  return JSON.stringify(path)
}

function collectTraceIds(
  trace: EffectTrace<string>,
  sources: string[],
  rules: string[],
) {
  if (trace.type === 'source') {
    sources.push(trace.sourceId)
    return
  }
  for (const input of trace.inputs) {
    collectTraceIds(input, sources, rules)
  }
  rules.push(trace.ruleId)
}

function removeDominatedCoalitions(
  terminals: readonly TerminalEffect<string>[],
): TerminalEffect<string>[] {
  return terminals.filter((candidate) => {
    const candidateSet = new Set(candidate.principals)
    return !terminals.some((other) => {
      if (
        other === candidate ||
        other.terminalId !== candidate.terminalId ||
        other.effect.address !== candidate.effect.address ||
        other.effect.effect !== candidate.effect.effect ||
        other.principals.length >= candidate.principals.length
      ) {
        return false
      }
      return other.principals.every((principal) => candidateSet.has(principal))
    })
  })
}

function hasEffectModel(permission: ContractPermission): boolean {
  if (
    (permission.effectRules?.length ?? 0) > 0 ||
    (permission.effectAssumptions?.length ?? 0) > 0
  ) {
    return true
  }
  return Object.values(permission.fields ?? {}).some((field) =>
    field.permissions?.some((entry) => (entry.effects?.length ?? 0) > 0),
  )
}

function principalFromGroup(
  group: ResolvedPermissionGroup,
): Extract<ResolvedImpactPrincipal, { type: 'group' }> {
  return {
    type: 'group',
    key: permissionGroupKey(group.permission.from, group.id),
    from: group.permission.from,
    id: group.id,
    name: group.name,
  }
}

function interpolateFragment(
  fragment: LocalEffectFragment,
  entry: StructureEntry,
): LocalEffectFragment | undefined {
  const result = {
    description: interpolateString(fragment.description, entry),
    impact: interpolateString(fragment.impact, entry),
    categories: fragment.categories,
    limitation: interpolateString(fragment.limitation, entry),
    protection: interpolateString(fragment.protection, entry),
  }
  return Object.values(result).some((value) => value !== undefined)
    ? result
    : undefined
}

function permissionGroupKey(from: ChainSpecificAddress, id: string): string {
  return `group:${from.toLowerCase()}:${id}`
}

function addressPrincipalKey(address: ChainSpecificAddress): string {
  return `address:${address.toLowerCase()}`
}

function sameAddress(
  a: ChainSpecificAddress,
  b: ChainSpecificAddress,
): boolean {
  return a.toLowerCase() === b.toLowerCase()
}

function effectKey(address: string, effect: string): string {
  return JSON.stringify([address.toLowerCase(), effect])
}

function cartesianProduct<T>(sets: readonly (readonly T[])[]): T[][] {
  let result: T[][] = [[]]
  for (const set of sets) {
    result = result.flatMap((prefix) => set.map((value) => [...prefix, value]))
  }
  return result
}

function unique<T>(values: readonly T[]): T[] {
  return Array.from(new Set(values))
}

function uniqueBy<T>(values: readonly T[], key: (value: T) => string): T[] {
  const seen = new Set<string>()
  return values.filter((value) => {
    const id = key(value)
    if (seen.has(id)) {
      return false
    }
    seen.add(id)
    return true
  })
}

function impactPrincipalKey(principal: ResolvedImpactPrincipal): string {
  return principal.type === 'group'
    ? principal.key
    : addressPrincipalKey(principal.address)
}
