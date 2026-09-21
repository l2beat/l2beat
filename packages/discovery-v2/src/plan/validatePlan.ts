/**
 * Static validation of a plan against the contract it is for.
 *
 * The model authors under a closed vocabulary, and this is where the closure
 * is enforced before anything touches RPC: shape (the plan schema), selection
 * (every worklist item ruled on exactly once), ABI membership, recipe fit,
 * reference resolution, naming, and literal types. Each rule writes findings
 * whose messages say what would be right, because the findings are the only
 * feedback the model gets in a repair round.
 *
 * Schema findings are returned alone: every later rule reads the plan as a
 * `Plan`, which is only safe once the schema holds.
 */
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { utils } from 'ethers'
import { AbiIndex, fullSignature, type Lookup, sighash } from '../abi/AbiIndex'
import { checkLiteral, isAddressLiteral } from '../abi/literals'
import type { Library, Recipe, RecipeInputKind } from '../library/Library'
import { validateSchema } from '../library/validateSchema'
import type { Baseline } from '../types/Baseline'
import type { ContractValue } from '../types/ContractValue'
import type { Prepared } from '../types/Prepared'
import type { Worklist } from '../types/Worklist'
import { closest, nameOf } from '../utils/closest'
import { checkRecipeArgs } from './checkRecipeArgs'
import { type Finding, Findings, joinPath } from './Finding'
import {
  type CallEachFetch,
  type CallFetch,
  FIXED_STEP_IDS,
  type LogsFetch,
  type Plan,
  type Step,
} from './Plan'
import { planSchema } from './planSchema'
import {
  collectReferences,
  findCycles,
  isReference,
  type ReferenceSite,
} from './references'

export type { Finding } from './Finding'

export interface ValidationContext {
  prepared: Prepared
  baseline: Baseline
  worklist: Worklist
  library: Library
}

export function validatePlan(plan: unknown, ctx: ValidationContext): Finding[] {
  const schemaFindings = checkSchema(plan)
  if (schemaFindings.length > 0) {
    return schemaFindings
  }
  const validator = new PlanValidator(plan as Plan, ctx)
  return validator.run()
}

/** Rule 1: the plan schema, one source of truth shared with the Codex output schema. */
function checkSchema(plan: unknown): Finding[] {
  return validateSchema(planSchema, plan, '$').map((message) => {
    const separator = message.indexOf(': ')
    const rawPath = message.slice(0, separator)
    return {
      severity: 'error',
      path: rawPath === '$' ? 'plan' : rawPath.replace(/^\$\./, ''),
      message: message.slice(separator + 2),
    }
  })
}

class PlanValidator {
  private readonly findings = new Findings()
  private readonly abi: AbiIndex
  private readonly stepIds: Set<string>

  constructor(
    private readonly plan: Plan,
    private readonly ctx: ValidationContext,
  ) {
    this.abi = AbiIndex.from(ctx.prepared.abi)
    this.stepIds = new Set(plan.steps.map((step) => step.id))
  }

  run(): Finding[] {
    this.checkShapeHash()
    this.checkCoverage()
    this.checkIdentifiers()
    this.plan.steps.forEach((step, i) => this.checkStep(step, `steps[${i}]`))
    this.checkCycles()
    return this.findings.list
  }

  private checkShapeHash(): void {
    const { shapeHash } = this.ctx.prepared
    if (
      shapeHash !== undefined &&
      this.plan.shapeHash !== undefined &&
      this.plan.shapeHash !== shapeHash
    ) {
      this.findings.error(
        'shapeHash',
        `plan is for shape ${this.plan.shapeHash} but prepared.json has shape ${shapeHash}; copy the prepared value`,
      )
    }
  }

  /** Rule 2: each worklist item has exactly one verdict. */
  private checkCoverage(): void {
    const signatures = this.ctx.worklist.items.map((item) => item.signature)
    const known = new Set(signatures)
    const verdicts = new Map<string, string>()

    const verdict = (signature: string, path: string) => {
      if (!known.has(signature)) {
        this.findings.error(path, this.notAWorklistItem(signature, signatures))
        return
      }
      const previous = verdicts.get(signature)
      if (previous !== undefined) {
        this.findings.error(
          path,
          `"${signature}" already has a verdict at ${previous}; each worklist item is covered or skipped exactly once`,
        )
        return
      }
      verdicts.set(signature, path)
    }

    this.plan.steps.forEach((step, i) =>
      step.covers?.forEach((signature, j) =>
        verdict(signature, `steps[${i}].covers[${j}]`),
      ),
    )
    this.plan.skips.forEach((skip, i) => verdict(skip.item, `skips[${i}].item`))

    const missing = signatures.filter((signature) => !verdicts.has(signature))
    if (missing.length > 0) {
      this.findings.error(
        'plan',
        `${missing.length} worklist item(s) have no verdict: ${missing.join(', ')}; add each to a step's covers or to skips with a reason`,
      )
    }
  }

  private notAWorklistItem(signature: string, signatures: string[]): string {
    const lookup = this.abi.lookupFunction(signature)
    if (lookup.fragment !== undefined && lookup.fragment.inputs.length === 0) {
      return `"${signature}" is a 0-arg getter, which the baseline reads; it is not a worklist item and needs no verdict`
    }
    const hint =
      signatures.length === 0
        ? 'the worklist is empty'
        : `closest: ${closest(signatures, signature, 3, nameOf).join(', ')}`
    return `"${signature}" is not a worklist item; ${hint}`
  }

  /** Rule 6: unique ids that name the Solidity identifier the value comes from. */
  private checkIdentifiers(): void {
    const seen = new Map<string, number>()
    const functionNames = new Set(this.abi.functionNames())
    const baselineFields = Object.keys(this.ctx.baseline.fields)

    this.plan.steps.forEach((step, i) => {
      const path = `steps[${i}].id`
      const first = seen.get(step.id)
      if (first !== undefined) {
        this.findings.error(
          path,
          `duplicate step id "${step.id}" (first used at steps[${first}].id); merge the steps or rename one after its own getter`,
        )
        return
      }
      seen.set(step.id, i)

      if (baselineFields.includes(step.id)) {
        this.findings.error(
          path,
          `"${step.id}" is already a baseline field; a step must not shadow it (reference it as $baseline.${step.id} instead)`,
        )
        return
      }
      if (
        FIXED_STEP_IDS.includes(step.id) ||
        functionNames.has(step.id) ||
        this.ownMethodName(step) === step.id
      ) {
        return
      }
      const suggestions = this.suggestIds(step)
      if (this.appearsInSource(step.id)) {
        this.findings.warning(
          path,
          `"${step.id}" is not an ABI function name but appears in the source, so it is accepted as a state variable name${suggestions}`,
        )
        return
      }
      this.findings.error(
        path,
        `"${step.id}" is neither an ABI function name, a fixed name (${FIXED_STEP_IDS.join(', ')}) nor an identifier in the source; name the field after the getter or state variable it comes from${suggestions}`,
      )
    })
  }

  /** A step reading another contract is named after the method it reads, which is not in this ABI. */
  private ownMethodName(step: Step): string | undefined {
    if (step.fetch.kind !== 'call' && step.fetch.kind !== 'callEach') {
      return undefined
    }
    return this.abi.lookupFunction(step.fetch.method).fragment?.name
  }

  private suggestIds(step: Step): string {
    const names = (step.covers ?? [])
      .map((signature) => signature.split('(')[0] as string)
      .filter((name) => name.length > 0)
    const candidates = [...new Set(names)]
    return candidates.length > 0
      ? `; covered items suggest: ${candidates.join(', ')}`
      : ''
  }

  private appearsInSource(identifier: string): boolean {
    const escaped = identifier.replace(/[$]/g, '\\$')
    const word = new RegExp(`(^|[^A-Za-z0-9_$])${escaped}(?![A-Za-z0-9_$])`)
    return this.ctx.prepared.sources.some((source) =>
      word.test(source.flattened),
    )
  }

  private checkStep(step: Step, path: string): void {
    const fetched = this.checkFetch(step, path)
    this.checkRecipe(step, path, fetched)
    for (const site of collectReferences(step)) {
      this.checkReference(step, site, joinPath(path, site.path))
    }
  }

  /** Rules 3 and 7 for the fetch: ABI membership and literal types. */
  private checkFetch(step: Step, path: string): FetchFacts {
    const fetch = step.fetch
    const fetchPath = joinPath(path, 'fetch')
    switch (fetch.kind) {
      case 'call':
        return { fragment: this.checkCall(fetch, fetchPath) }
      case 'callEach':
        return { fragment: this.checkCallEach(fetch, fetchPath) }
      case 'logs':
        return { events: this.checkLogs(fetch, fetchPath) }
      case 'storage':
        this.checkSlot(fetch.slot, joinPath(fetchPath, 'slot'))
        return {}
      case 'constructorArgs':
        this.checkConstructorArgs(step, path)
        return {}
      case 'hardcoded':
        return {}
    }
  }

  private checkCall(
    fetch: CallFetch,
    fetchPath: string,
  ): utils.FunctionFragment | undefined {
    const fragment = this.resolveMethod(fetch, fetchPath)
    if (fragment === undefined) {
      return undefined
    }
    const args = fetch.args ?? []
    if (args.length !== fragment.inputs.length) {
      this.findings.error(
        joinPath(fetchPath, 'args'),
        `${sighash(fragment)} takes ${fragment.inputs.length} argument(s), got ${args.length}`,
      )
      return fragment
    }
    args.forEach((arg, i) => {
      if (isReference(arg)) {
        return
      }
      const problem = checkLiteral(arg, fragment.inputs[i] as utils.ParamType)
      if (problem !== undefined) {
        this.findings.error(`${joinPath(fetchPath, 'args')}[${i}]`, problem)
      }
    })
    return fragment
  }

  private checkCallEach(
    fetch: CallEachFetch,
    fetchPath: string,
  ): utils.FunctionFragment | undefined {
    const fragment = this.resolveMethod(fetch, fetchPath)
    if (fragment === undefined) {
      return undefined
    }
    if (fragment.inputs.length === 0) {
      this.findings.error(
        joinPath(fetchPath, 'method'),
        `${sighash(fragment)} takes no arguments; use a call fetch (or the baseline value) instead of callEach`,
      )
      return fragment
    }
    const keysPath = joinPath(fetchPath, 'keys')
    const keys = fetch.keys
    if ('literal' in keys) {
      keys.literal.forEach((key, i) => {
        const problem = checkKey(key, fragment)
        if (problem !== undefined) {
          this.findings.error(`${joinPath(keysPath, 'literal')}[${i}]`, problem)
        }
      })
    }
    if ('range' in keys || 'untilRevert' in keys) {
      this.checkIndexedMethod(fragment, joinPath(fetchPath, 'method'))
    }
    if ('range' in keys && !isReference(keys.range.length)) {
      const length = keys.range.length
      if (!(Number.isInteger(length) && (length as number) >= 0)) {
        this.findings.error(
          joinPath(keysPath, 'range.length'),
          `expected a non-negative integer or a reference such as $baseline.<lengthGetter>, got ${JSON.stringify(length)}`,
        )
      }
    }
    return fragment
  }

  private checkIndexedMethod(
    fragment: utils.FunctionFragment,
    methodPath: string,
  ): void {
    const [input] = fragment.inputs
    const isIndex =
      fragment.inputs.length === 1 && /^u?int\d*$/.test(input?.type ?? '')
    if (!isIndex) {
      this.findings.error(
        methodPath,
        `range and untilRevert keys need a method with one integer argument; ${sighash(fragment)} takes (${fragment.inputs.map((p) => p.format()).join(',')})`,
      )
    }
  }

  private resolveMethod(
    fetch: CallFetch | CallEachFetch,
    fetchPath: string,
  ): utils.FunctionFragment | undefined {
    const methodPath = joinPath(fetchPath, 'method')
    const lookup: Lookup<utils.FunctionFragment> = this.abi.lookupFunction(
      fetch.method,
    )
    if (lookup.error !== undefined) {
      this.findings.error(methodPath, lookup.error)
      return undefined
    }
    if (!lookup.inAbi && fetch.at === undefined) {
      this.findings.error(
        methodPath,
        `${sighash(lookup.fragment)} is not in this contract's ABI; a full fragment is only accepted together with \`at\` naming the contract that has it`,
      )
      return undefined
    }
    if ((lookup.fragment.outputs?.length ?? 0) === 0) {
      this.findings.error(
        methodPath,
        `${fullSignature(lookup.fragment)} returns nothing, so there is no value to read`,
      )
      return undefined
    }
    return lookup.fragment
  }

  private checkLogs(
    fetch: LogsFetch,
    fetchPath: string,
  ): utils.EventFragment[] {
    const events: utils.EventFragment[] = []
    fetch.events.forEach((name, i) => {
      const lookup = this.abi.lookupEvent(name)
      const eventPath = `${joinPath(fetchPath, 'events')}[${i}]`
      if (lookup.error !== undefined) {
        this.findings.error(eventPath, lookup.error)
        return
      }
      if (!lookup.inAbi) {
        this.findings.error(
          eventPath,
          `event ${sighash(lookup.fragment)} is not in this contract's ABI; logs are only fetched for this contract's own events (${this.abi.eventNames().join(', ')})`,
        )
        return
      }
      events.push(lookup.fragment)
    })
    return events
  }

  private checkSlot(slot: number | string, slotPath: string): void {
    if (typeof slot === 'number') {
      if (!(Number.isInteger(slot) && slot >= 0)) {
        this.findings.error(
          slotPath,
          `expected a non-negative integer slot, got ${slot}`,
        )
      }
      return
    }
    if (!/^(0x[0-9a-fA-F]+|\d+)$/.test(slot)) {
      this.findings.error(
        slotPath,
        `expected a slot as a non-negative integer, a decimal string or a 0x hex string, got ${JSON.stringify(slot)}`,
      )
    }
  }

  private checkConstructorArgs(step: Step, path: string): void {
    if (step.id !== 'constructorArgs') {
      this.findings.error(
        joinPath(path, 'id'),
        `a constructorArgs fetch must use the fixed id "constructorArgs" (V1 names this field so), got "${step.id}"`,
      )
    }
    const address = this.ctx.prepared.address.toString()
    const ownAbi = this.ctx.prepared.abis[address]
    const index = ownAbi === undefined ? this.abi : AbiIndex.from(ownAbi)
    if (index.constructorFragment === undefined) {
      this.findings.error(
        joinPath(path, 'fetch'),
        `the ABI of ${address} declares no constructor, so there are no constructor arguments to decode`,
      )
    }
    const hasSource = this.ctx.prepared.sources.some(
      (source) => source.address.toString() === address,
    )
    if (!hasSource) {
      this.findings.error(
        joinPath(path, 'fetch'),
        `prepared.json has no source for ${address}, so its constructor arguments are unavailable`,
      )
    }
  }

  /** Rule 4: the recipe exists, its arguments validate, and it fits the fetch. */
  private checkRecipe(step: Step, path: string, fetched: FetchFacts): void {
    if (step.use === undefined) {
      if (step.fetch.kind === 'logs' || step.fetch.kind === 'callEach') {
        this.findings.error(
          joinPath(path, 'use'),
          `a ${step.fetch.kind} fetch needs a recipe to shape its result into a field value; pick one of ${this.recipesFor(step.fetch.kind)}`,
        )
      }
      if (step.args !== undefined) {
        this.findings.warning(
          joinPath(path, 'args'),
          'args are ignored because the step has no `use`',
        )
      }
      return
    }

    let recipe: Recipe
    try {
      recipe = this.ctx.library.get(step.use)
    } catch (error) {
      this.findings.error(
        joinPath(path, 'use'),
        error instanceof Error ? error.message : String(error),
      )
      return
    }

    for (const finding of this.ctx.library.validateArgs(recipe, step.args)) {
      const separator = finding.indexOf(': ')
      const argPath = finding
        .slice(0, separator)
        .replace(/^\$/, joinPath(path, 'args'))
      this.findings.error(argPath, finding.slice(separator + 2))
    }

    if (!fitsFetch(recipe.inputKind, step, fetched)) {
      this.findings.error(
        joinPath(path, 'use'),
        `${recipe.id} takes ${describeInput(recipe.inputKind)}, but this step fetches ${describeFetch(step, fetched)}; use a matching fetch, or one of ${this.recipesFor(step.fetch.kind)}`,
      )
    }

    if (step.fetch.kind === 'logs' && fetched.events !== undefined) {
      checkRecipeArgs(
        step.args ?? {},
        fetched.events,
        joinPath(path, 'args'),
        this.findings,
      )
    }
  }

  private recipesFor(kind: Step['fetch']['kind']): string {
    const wanted: RecipeInputKind =
      kind === 'logs' ? 'logs' : kind === 'callEach' ? 'callEach' : 'scalar'
    const ids = this.ctx.library
      .list()
      .filter((recipe) => recipe.inputKind === wanted)
      .map((recipe) => recipe.id)
    return ids.length > 0 ? ids.join(', ') : '(no recipe accepts this fetch)'
  }

  /** Rule 5: references resolve and have the type their position needs. */
  private checkReference(step: Step, site: ReferenceSite, path: string): void {
    const { reference } = site
    if (reference.kind === 'self') {
      return
    }
    if (reference.kind === 'step') {
      if (reference.id === step.id) {
        this.findings.error(
          path,
          `a step cannot reference itself ($step.${step.id})`,
        )
        return
      }
      if (!this.stepIds.has(reference.id)) {
        const ids = [...this.stepIds]
        this.findings.error(
          path,
          `no step has id "${reference.id}"; steps are ${ids.join(', ')}`,
        )
        return
      }
      if (site.path === 'fetch.at') {
        this.checkStepProducesAddress(reference.id, path)
      }
      return
    }

    const field = this.ctx.baseline.fields[reference.field]
    if (field === undefined) {
      const names = Object.keys(this.ctx.baseline.fields)
      this.findings.error(
        path,
        `baseline has no field "${reference.field}"; closest: ${closest(names, reference.field).join(', ')}`,
      )
      return
    }
    if (field.value === undefined) {
      this.findings.warning(
        path,
        `baseline field "${reference.field}" has no value (${field.error ?? 'no error recorded'}); the step will fail at run time`,
      )
      return
    }
    this.checkReferencedValue(step, site, field.value, path)
  }

  private checkReferencedValue(
    step: Step,
    site: ReferenceSite,
    value: ContractValue,
    path: string,
  ): void {
    const shown = JSON.stringify(value)
    if (site.path === 'fetch.at' && !isAddressValue(value)) {
      this.findings.error(
        path,
        `${site.raw} is ${shown}, not an address; \`at\` needs an address-valued baseline field or a literal address`,
      )
    }
    if (site.path === 'fetch.keys.from' && typeof value !== 'object') {
      this.findings.error(
        path,
        `${site.raw} is ${shown}; \`from\` needs an array of keys or an object whose keys are used`,
      )
    }
    if (site.path === 'fetch.keys.range.length' && !isIntegerValue(value)) {
      this.findings.error(
        path,
        `${site.raw} is ${shown}, not an integer; \`length\` needs a numeric baseline field`,
      )
    }
    const argIndex = /^fetch\.args\[(\d+)\]$/.exec(site.path)
    if (argIndex !== null && step.fetch.kind === 'call') {
      const lookup = this.abi.lookupFunction(step.fetch.method)
      const input = lookup.fragment?.inputs[Number(argIndex[1])]
      const problem =
        input === undefined ? undefined : checkLiteral(value, input)
      if (problem !== undefined) {
        this.findings.error(path, `${site.raw} is ${shown}: ${problem}`)
      }
    }
  }

  private checkStepProducesAddress(id: string, path: string): void {
    const producer = this.plan.steps.find((step) => step.id === id)
    if (producer === undefined || producesAddress(producer, this.abi)) {
      return
    }
    this.findings.error(
      path,
      `$step.${id} does not produce an address (${describeFetch(producer, {})}${producer.use ? ` shaped by ${producer.use}` : ''}); \`at\` needs a call returning one address, a storage slot read as address, or a hardcoded address`,
    )
  }

  /** Self-references are reported by rule 5 already, so only longer cycles are reported here. */
  private checkCycles(): void {
    for (const cycle of findCycles(this.plan.steps)) {
      if (cycle.length === 2) {
        continue
      }
      const index = this.plan.steps.findIndex((step) => step.id === cycle[0])
      this.findings.error(
        `steps[${index}].fetch`,
        `steps ${cycle.join(' -> ')} reference each other in a cycle; break it by reading one of them from the baseline or a literal`,
      )
    }
  }
}

interface FetchFacts {
  fragment?: utils.FunctionFragment
  events?: utils.EventFragment[]
}

function checkKey(
  key: unknown,
  fragment: utils.FunctionFragment,
): string | undefined {
  if (fragment.inputs.length === 1) {
    return checkLiteral(key, fragment.inputs[0] as utils.ParamType)
  }
  if (!Array.isArray(key) || key.length !== fragment.inputs.length) {
    return `${sighash(fragment)} takes ${fragment.inputs.length} arguments, so each key must be an array of ${fragment.inputs.length} literals, got ${JSON.stringify(key)}`
  }
  for (const [i, input] of fragment.inputs.entries()) {
    const problem = checkLiteral(key[i], input)
    if (problem !== undefined) {
      return `[${i}]: ${problem}`
    }
  }
  return undefined
}

function fitsFetch(
  kind: RecipeInputKind,
  step: Step,
  fetched: FetchFacts,
): boolean {
  switch (kind) {
    case 'logs':
      return step.fetch.kind === 'logs'
    case 'callEach':
      return step.fetch.kind === 'callEach'
    case 'scalar':
      if (step.fetch.kind === 'call') {
        return (
          fetched.fragment === undefined ||
          fetched.fragment.outputs?.length === 1
        )
      }
      return step.fetch.kind === 'storage' || step.fetch.kind === 'hardcoded'
  }
}

function describeInput(kind: RecipeInputKind): string {
  switch (kind) {
    case 'logs':
      return 'decoded logs from a logs fetch'
    case 'callEach':
      return '[{ key, value }] pairs from a callEach fetch'
    case 'scalar':
      return 'one scalar value from a call, storage or hardcoded fetch'
  }
}

function describeFetch(step: Step, fetched: FetchFacts): string {
  const fetch = step.fetch
  if (fetch.kind === 'call' && fetched.fragment !== undefined) {
    const outputs = fetched.fragment.outputs ?? []
    return `a call returning (${outputs.map((o) => o.format()).join(', ')})`
  }
  return `a ${fetch.kind} fetch`
}

function producesAddress(step: Step, abi: AbiIndex): boolean {
  if (step.use !== undefined) {
    return false
  }
  const fetch = step.fetch
  if (fetch.kind === 'call') {
    const outputs = abi.lookupFunction(fetch.method).fragment?.outputs ?? []
    return outputs.length === 1 && outputs[0]?.type === 'address'
  }
  if (fetch.kind === 'storage') {
    return fetch.as === 'address'
  }
  if (fetch.kind === 'hardcoded') {
    return isAddressLiteral(fetch.value)
  }
  return false
}

function isAddressValue(value: ContractValue): boolean {
  return (
    typeof value === 'string' &&
    (ChainSpecificAddress.check(value) || isAddressLiteral(value))
  )
}

function isIntegerValue(value: ContractValue): boolean {
  return (
    (typeof value === 'number' && Number.isInteger(value) && value >= 0) ||
    (typeof value === 'string' && /^\d+$/.test(value))
  )
}
