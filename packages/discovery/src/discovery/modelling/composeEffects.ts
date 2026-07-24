import { createHash } from 'crypto'
import type { ImpactCategory } from '../config/PermissionConfig'

/** A component-local effect. The pair is its identity in the effect graph. */
export interface EffectKey {
  address: string
  effect: string
}

/**
 * Human-readable information owned by the component producing an effect.
 *
 * These fields deliberately remain prose. The engine only composes resolved
 * effects and never attempts to infer one piece of prose from another.
 */
export interface LocalEffectFragment {
  description?: string
  impact?: string
  categories?: ImpactCategory[]
  limitation?: string
  protection?: string
}

/**
 * A resolved graph input. Multiple principals in one source are conjunctive:
 * they must cooperate to produce the effect. Alternative ways of producing an
 * effect should be represented by separate sources.
 */
export interface EffectSource<Principal extends string = string> {
  id: string
  effect: EffectKey
  principals: readonly Principal[]
  fragment?: LocalEffectFragment
}

/** A local transformation. Every input is required to produce the output. */
export interface EffectRule {
  id: string
  inputs: readonly EffectKey[]
  output: EffectKey
  fragment?: LocalEffectFragment
}

/** An effect that should be exposed to a consumer of the composed model. */
export interface EffectTerminal {
  id: string
  effect: EffectKey
  fragment?: LocalEffectFragment
}

export interface EffectModel<Principal extends string = string> {
  sources: readonly EffectSource<Principal>[]
  rules: readonly EffectRule[]
  terminals: readonly EffectTerminal[]
}

export type EffectTrace<Principal extends string = string> =
  | {
      type: 'source'
      sourceId: string
      effect: EffectKey
      principals: readonly Principal[]
    }
  | {
      type: 'rule'
      ruleId: string
      effect: EffectKey
      inputs: readonly EffectTrace<Principal>[]
    }

export interface ResolvedEffectFragment extends LocalEffectFragment {
  type: 'source' | 'rule' | 'terminal'
  id: string
  effect: EffectKey
}

/** One distinct proof that a set of principals can produce an effect. */
export interface EffectDerivation<Principal extends string = string> {
  /** Stable within one model and distinct for distinct proof trees. */
  id: string
  effect: EffectKey
  principals: readonly Principal[]
  /** Depth-first, source-to-output fragments. The trace retains branch shape. */
  fragments: readonly ResolvedEffectFragment[]
  trace: EffectTrace<Principal>
}

export interface ComposedEffect<Principal extends string = string> {
  key: EffectKey
  derivations: readonly EffectDerivation<Principal>[]
}

export interface TerminalEffect<Principal extends string = string> {
  id: string
  terminalId: string
  effect: EffectKey
  principals: readonly Principal[]
  fragments: readonly ResolvedEffectFragment[]
  trace: EffectTrace<Principal>
}

export interface ComposedEffectModel<Principal extends string = string> {
  effects: readonly ComposedEffect<Principal>[]
  terminals: readonly TerminalEffect<Principal>[]
}

interface InternalDerivation<Principal extends string>
  extends EffectDerivation<Principal> {
  /** Effect keys already present anywhere in this proof tree. */
  ancestry: ReadonlySet<string>
}

/**
 * Composes resolved sources using a monotone fixed point.
 *
 * Rules are conjunctive and therefore combine every distinct derivation of
 * every input. Principal identities are unioned at joins, which preserves the
 * correlation of one principal appearing on multiple input branches. A rule
 * is not applied when its output already occurs in an input proof, preventing
 * cyclic derivations while retaining every distinct acyclic path.
 */
export function composeEffects<Principal extends string = string>(
  model: EffectModel<Principal>,
): ComposedEffectModel<Principal> {
  validateModel(model)

  const derivations = new Map<string, InternalDerivation<Principal>[]>()
  const derivationIds = new Map<string, Set<string>>()

  const addDerivation = (derivation: InternalDerivation<Principal>) => {
    const key = effectKeyId(derivation.effect)
    const ids = derivationIds.get(key) ?? new Set<string>()
    if (ids.has(derivation.id)) {
      return false
    }

    ids.add(derivation.id)
    derivationIds.set(key, ids)
    const existing = derivations.get(key) ?? []
    existing.push(derivation)
    derivations.set(key, existing)
    return true
  }

  for (const source of model.sources) {
    const effect = copyEffectKey(source.effect)
    const key = effectKeyId(effect)
    const principals = uniquePrincipals(source.principals)
    const trace: EffectTrace<Principal> = {
      type: 'source',
      sourceId: source.id,
      effect,
      principals,
    }
    addDerivation({
      id: sourceDerivationId(source.id, effect),
      effect,
      principals,
      fragments: resolveFragment('source', source.id, effect, source.fragment),
      trace,
      ancestry: new Set([key]),
    })
  }

  let changed = true
  while (changed) {
    changed = false

    for (const rule of model.rules) {
      const inputs = rule.inputs.map(
        (input) => derivations.get(effectKeyId(input)) ?? [],
      )
      if (inputs.some((input) => input.length === 0)) {
        continue
      }

      for (const combination of cartesianProduct(inputs)) {
        const output = copyEffectKey(rule.output)
        const outputId = effectKeyId(output)
        if (combination.some((input) => input.ancestry.has(outputId))) {
          continue
        }

        const principals = uniquePrincipals(
          combination.flatMap((input) => input.principals),
        )
        const trace: EffectTrace<Principal> = {
          type: 'rule',
          ruleId: rule.id,
          effect: output,
          inputs: combination.map((input) => input.trace),
        }
        const ancestry = new Set<string>()
        for (const input of combination) {
          for (const ancestor of input.ancestry) {
            ancestry.add(ancestor)
          }
        }
        ancestry.add(outputId)

        changed =
          addDerivation({
            id: ruleDerivationId(
              rule.id,
              output,
              combination.map((input) => input.id),
            ),
            effect: output,
            principals,
            fragments: [
              ...combination.flatMap((input) => input.fragments),
              ...resolveFragment('rule', rule.id, output, rule.fragment),
            ],
            trace,
            ancestry,
          }) || changed
      }
    }
  }

  const effects: ComposedEffect<Principal>[] = Array.from(
    derivations.entries(),
  ).map(([key, values]) => ({
    key: copyEffectKey(values[0]?.effect ?? parseEffectKeyId(key)),
    derivations: values.map(withoutAncestry),
  }))

  const terminals: TerminalEffect<Principal>[] = []
  for (const terminal of model.terminals) {
    const matching = derivations.get(effectKeyId(terminal.effect)) ?? []
    for (const derivation of matching) {
      terminals.push({
        id: terminalDerivationId(terminal.id, derivation.id),
        terminalId: terminal.id,
        effect: copyEffectKey(terminal.effect),
        principals: derivation.principals,
        fragments: [
          ...derivation.fragments,
          ...resolveFragment(
            'terminal',
            terminal.id,
            terminal.effect,
            terminal.fragment,
          ),
        ],
        trace: derivation.trace,
      })
    }
  }

  return { effects, terminals }
}

/** Collision-safe serialization for an address/effect pair. */
export function effectKeyId(key: EffectKey): string {
  return JSON.stringify([key.address, key.effect])
}

function parseEffectKeyId(id: string): EffectKey {
  const [address, effect] = JSON.parse(id) as [string, string]
  return { address, effect }
}

function copyEffectKey(key: EffectKey): EffectKey {
  return { address: key.address, effect: key.effect }
}

function uniquePrincipals<Principal extends string>(
  principals: readonly Principal[],
): Principal[] {
  return Array.from(new Set(principals)).sort((a, b) => a.localeCompare(b))
}

function resolveFragment(
  type: ResolvedEffectFragment['type'],
  id: string,
  effect: EffectKey,
  fragment: LocalEffectFragment | undefined,
): ResolvedEffectFragment[] {
  if (fragment === undefined) {
    return []
  }
  return [{ type, id, effect: copyEffectKey(effect), ...fragment }]
}

function withoutAncestry<Principal extends string>(
  derivation: InternalDerivation<Principal>,
): EffectDerivation<Principal> {
  const { ancestry: _, ...result } = derivation
  return result
}

function cartesianProduct<T>(sets: readonly (readonly T[])[]): T[][] {
  let result: T[][] = [[]]
  for (const set of sets) {
    result = result.flatMap((prefix) => set.map((value) => [...prefix, value]))
  }
  return result
}

function sourceDerivationId(id: string, effect: EffectKey): string {
  return stableId('source', [id, effect.address, effect.effect])
}

function ruleDerivationId(
  id: string,
  effect: EffectKey,
  inputs: readonly string[],
): string {
  return stableId('rule', [id, effect.address, effect.effect, inputs])
}

function terminalDerivationId(id: string, derivation: string): string {
  return stableId('terminal', [id, derivation])
}

function stableId(prefix: string, value: unknown): string {
  const hash = createHash('sha256').update(JSON.stringify(value)).digest('hex')
  return `${prefix}:${hash}`
}

function validateModel<Principal extends string>(
  model: EffectModel<Principal>,
) {
  assertUniqueIds('source', model.sources)
  assertUniqueIds('rule', model.rules)
  assertUniqueIds('terminal', model.terminals)

  for (const source of model.sources) {
    assertEffectKey(`Source "${source.id}"`, source.effect)
    assertNonEmptyId('Principal', source.principals)
  }
  for (const rule of model.rules) {
    if (rule.inputs.length === 0) {
      throw new Error(`Rule "${rule.id}" must have at least one input`)
    }
    assertEffectKey(`Rule "${rule.id}" output`, rule.output)
    const inputs = new Set<string>()
    for (const input of rule.inputs) {
      assertEffectKey(`Rule "${rule.id}" input`, input)
      const key = effectKeyId(input)
      if (inputs.has(key)) {
        throw new Error(`Rule "${rule.id}" has duplicate input ${key}`)
      }
      inputs.add(key)
    }
  }
  for (const terminal of model.terminals) {
    assertEffectKey(`Terminal "${terminal.id}"`, terminal.effect)
  }
}

function assertUniqueIds(type: string, entries: readonly { id: string }[]) {
  const ids = new Set<string>()
  for (const entry of entries) {
    if (entry.id.length === 0) {
      throw new Error(`${capitalize(type)} id must not be empty`)
    }
    if (ids.has(entry.id)) {
      throw new Error(`Duplicate ${type} id "${entry.id}"`)
    }
    ids.add(entry.id)
  }
}

function assertEffectKey(context: string, key: EffectKey) {
  if (key.address.length === 0 || key.effect.length === 0) {
    throw new Error(`${context} must have a non-empty address and effect`)
  }
}

function assertNonEmptyId(type: string, values: readonly string[]) {
  if (values.some((value) => value.length === 0)) {
    throw new Error(`${type} id must not be empty`)
  }
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
