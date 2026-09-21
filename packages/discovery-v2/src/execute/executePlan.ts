/**
 * Runs a validated plan against one contract and returns its fields.
 *
 * Steps form a dependency graph through `$step` references. Each step runs as
 * soon as its dependencies have values, so independent steps issue their
 * calls in the same tick and V1's provider batches them into one multicall.
 * A step's failure is recorded on that step and on every step that depends
 * on it, never thrown: a partial entry with explicit errors is what V1
 * produces too, and it is what the benchmark and the repair loop read.
 *
 * Recipe arguments and recipe output pass through `prefixAddresses` because
 * the model writes raw addresses while fetched data carries chain prefixes;
 * without this a `when.equals` on an address would never match and a
 * `map@1` keyed by address would look different from a V1 field.
 */
import {
  type ContractValue,
  getErrorMessage,
  type IProvider,
  prefixAddresses,
} from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import { AbiIndex } from '../abi/AbiIndex'
import type { Library } from '../library/Library'
import type { Plan, Step } from '../plan/Plan'
import { findCycles, stepDependencies } from '../plan/references'
import type { Baseline } from '../types/Baseline'
import type { Prepared } from '../types/Prepared'
import { DEFAULT_HARD_MAX, type FetchLimits, runFetch } from './fetch'
import { Scope } from './Scope'

export interface ExecutionContext {
  prepared: Prepared
  baseline: Baseline
  plan: Plan
  library: Library
}

export interface ExecuteOptions {
  /** Cap on `untilRevert` probing regardless of the plan's `max`. */
  untilRevertHardMax?: number
  /** Cap on `range` lengths; beyond it the step keeps a prefix and errors like V1. */
  rangeHardMax?: number
}

export interface ExecutedField {
  value?: ContractValue
  error?: string
}

export interface Executed {
  fields: Record<string, ExecutedField>
  /** Fetch results before the recipe, for debugging and the benchmark. */
  raw: Record<string, unknown>
  status: 'ok' | 'partial'
}

interface StepResult extends ExecutedField {
  raw?: unknown
}

export async function executePlan(
  provider: IProvider,
  ctx: ExecutionContext,
  options: ExecuteOptions = {},
): Promise<Executed> {
  assertProviderMatches(provider, ctx.prepared)
  const runner = new PlanRunner(provider, ctx, {
    untilRevertHardMax: options.untilRevertHardMax ?? DEFAULT_HARD_MAX,
    rangeHardMax: options.rangeHardMax ?? DEFAULT_HARD_MAX,
  })
  return await runner.run()
}

function assertProviderMatches(provider: IProvider, prepared: Prepared): void {
  assert(
    provider.chain === prepared.chain,
    `provider is on ${provider.chain} but prepared.json is for ${prepared.chain}`,
  )
  assert(
    provider.blockNumber === prepared.blockNumber,
    `provider is at block ${provider.blockNumber} but prepared.json is for block ${prepared.blockNumber}`,
  )
}

class PlanRunner {
  private readonly abi: AbiIndex
  private readonly byId = new Map<string, Step>()
  private readonly cyclic = new Map<string, string>()
  private readonly pending = new Map<Step, Promise<StepResult>>()
  private readonly values = new Map<string, ContractValue | undefined>()

  constructor(
    private readonly provider: IProvider,
    private readonly ctx: ExecutionContext,
    private readonly limits: FetchLimits,
  ) {
    this.abi = AbiIndex.from(ctx.prepared.abi)
    for (const step of ctx.plan.steps) {
      if (!this.byId.has(step.id)) {
        this.byId.set(step.id, step)
      }
    }
    for (const cycle of findCycles(ctx.plan.steps)) {
      for (const id of cycle) {
        this.cyclic.set(id, cycle.join(' -> '))
      }
    }
  }

  async run(): Promise<Executed> {
    const results = await Promise.all(
      this.ctx.plan.steps.map((step) => this.result(step)),
    )
    const executed: Executed = { fields: {}, raw: {}, status: 'ok' }
    this.ctx.plan.steps.forEach((step, i) => {
      const { raw, value, error } = results[i] as StepResult
      executed.fields[step.id] = {
        ...(value === undefined ? {} : { value }),
        ...(error === undefined ? {} : { error }),
      }
      if (raw !== undefined) {
        executed.raw[step.id] = raw
      }
      if (error !== undefined) {
        executed.status = 'partial'
      }
    })
    return executed
  }

  private result(step: Step): Promise<StepResult> {
    let promise = this.pending.get(step)
    if (promise === undefined) {
      // Registered before the body starts so re-entrant lookups from
      // dependencies find the promise instead of recursing.
      promise = Promise.resolve().then(() => this.runStep(step))
      this.pending.set(step, promise)
    }
    return promise
  }

  private async runStep(step: Step): Promise<StepResult> {
    if (this.byId.get(step.id) !== step) {
      return { error: `duplicate step id "${step.id}"` }
    }
    const cycle = this.cyclic.get(step.id)
    if (cycle !== undefined) {
      return { error: `part of a dependency cycle: ${cycle}` }
    }
    const failed = await this.awaitDependencies(step)
    if (failed !== undefined) {
      return { error: `dependency ${failed} failed` }
    }
    const result = await this.fetchAndShape(step)
    this.values.set(step.id, result.value)
    return result
  }

  /** The id of the first dependency without a value, or undefined when all succeeded. */
  private async awaitDependencies(step: Step): Promise<string | undefined> {
    for (const id of stepDependencies(step)) {
      const dependency = this.byId.get(id)
      if (dependency === undefined) {
        return id
      }
      const result = await this.result(dependency)
      if (result.error !== undefined) {
        return id
      }
    }
    return undefined
  }

  private async fetchAndShape(step: Step): Promise<StepResult> {
    const chain = this.ctx.prepared.chain
    let raw: unknown
    let fetchError: string | undefined
    try {
      const fetched = await runFetch(step.fetch, {
        provider: this.provider,
        prepared: this.ctx.prepared,
        abi: this.abi,
        scope: new Scope(this.ctx.prepared, this.ctx.baseline, this.values),
        limits: this.limits,
      })
      raw = fetched.raw
      fetchError = fetched.error
    } catch (error) {
      return { error: getErrorMessage(error) }
    }

    if (step.use === undefined) {
      return { raw, value: toFieldValue(chain, raw), error: fetchError }
    }
    try {
      const recipe = this.ctx.library.get(step.use)
      const args = prefixAddresses(chain, (step.args ?? {}) as ContractValue)
      const shaped = await this.ctx.library.apply(recipe, raw, args)
      return { raw, value: toFieldValue(chain, shaped), error: fetchError }
    } catch (error) {
      return { raw, error: getErrorMessage(error) }
    }
  }
}

/**
 * A recipe's JSON becomes a field value; `null` (e.g. `latest@1` with no
 * matching log) becomes "no value", which is how V1 renders an event handler
 * that matched nothing.
 */
function toFieldValue(
  chain: string,
  value: unknown,
): ContractValue | undefined {
  const withoutNulls = dropNulls(value)
  return withoutNulls === undefined
    ? undefined
    : prefixAddresses(chain, withoutNulls as ContractValue)
}

function dropNulls(value: unknown): unknown {
  if (value === null || value === undefined) {
    return undefined
  }
  if (Array.isArray(value)) {
    return value.map(dropNulls)
  }
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, entry]) => [key, dropNulls(entry)])
        .filter(([, entry]) => entry !== undefined),
    )
  }
  return value
}
