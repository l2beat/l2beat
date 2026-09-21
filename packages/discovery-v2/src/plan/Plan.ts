/**
 * The plan: the model's complete ruling on one contract shape.
 *
 * A plan pins the four axes two models could disagree on. Shape is a recipe
 * name (`use`), name is the Solidity identifier (`id`), place is implicit
 * (the contract being planned), and selection is the `covers`/`skips` split
 * over the worklist. Everything else here is how to fetch, and fetching is a
 * closed set of six kinds so the executor never runs anything it does not
 * understand.
 *
 * The TypeScript type and `planSchema.ts` describe the same thing; the schema
 * is the source of truth at run time (validated with `validateSchema`) and
 * this type is what the code reads after validation passed.
 */
import type { RecipeId } from '../library/Library'

/** `$baseline.<field>`, `$step.<id>` or `$self`. */
export type Reference = string

export interface CallFetch {
  kind: 'call'
  method: string
  args?: unknown[]
  at?: Reference | string
}

export type CallEachKeys =
  | { literal: unknown[] }
  | { from: Reference }
  | { range: { length: number | Reference; start?: number } }
  | { untilRevert: { max: number } }

export interface CallEachFetch {
  kind: 'callEach'
  method: string
  keys: CallEachKeys
  at?: Reference | string
}

export interface LogsFetch {
  kind: 'logs'
  events: string[]
}

export const STORAGE_TYPES = ['address', 'uint', 'bytes32'] as const
export type StorageType = (typeof STORAGE_TYPES)[number]

export interface StorageFetch {
  kind: 'storage'
  slot: number | string
  as: StorageType
  at?: Reference | string
}

export interface ConstructorArgsFetch {
  kind: 'constructorArgs'
}

export interface HardcodedFetch {
  kind: 'hardcoded'
  value: unknown
}

export type Fetch =
  | CallFetch
  | CallEachFetch
  | LogsFetch
  | StorageFetch
  | ConstructorArgsFetch
  | HardcodedFetch

export type FetchKind = Fetch['kind']

export const SKIP_REASONS = [
  'user-activity',
  'computation',
  'unbounded',
  'covered',
  'not-state',
] as const
export type SkipReason = (typeof SKIP_REASONS)[number]

export interface Step {
  id: string
  covers?: string[]
  fetch: Fetch
  use?: RecipeId
  args?: Record<string, unknown>
  reason: string
}

export interface Skip {
  item: string
  reason: SkipReason
}

export interface Plan {
  version: 1
  contract: string
  shapeHash?: string
  steps: Step[]
  skips: Skip[]
}

/** Field names the library fixes regardless of the ABI (README: "the fixed name of the recipe"). */
export const FIXED_STEP_IDS: readonly string[] = [
  'accessControl',
  'constructorArgs',
]
