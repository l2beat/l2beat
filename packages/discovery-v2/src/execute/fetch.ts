/**
 * The six fetch kinds, each turned into V1-formatted raw data.
 *
 * A fetch is the only part of a step that touches RPC, so every kind goes
 * through the same V1 provider methods V1's handlers use: `callMethod`
 * (batched into multicall when calls are issued in the same tick, which is
 * why keys run concurrently), `getLogs` per topic, `getStorage`. Results are
 * formatted here, before any recipe sees them, so a recipe compares and
 * emits values in the exact form the entry will carry.
 *
 * Errors are thrown; the executor turns them into the step's `error`. The
 * one exception is an enumeration that hits its cap, which keeps the values
 * fetched so far and reports V1's "Too many values" wording alongside them.
 */
import {
  bytes32ToContractValue,
  type ContractValue,
  EXEC_REVERT_MSG,
  type IProvider,
  orderLogs,
  prefixAddresses,
  serializeConstructorArgs,
} from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { type providers, utils } from 'ethers'
import type { AbiIndex } from '../abi/AbiIndex'
import { formatLogArgs } from '../format/formatValue'
import type {
  CallEachFetch,
  CallFetch,
  ConstructorArgsFetch,
  Fetch,
  HardcodedFetch,
  LogsFetch,
  StorageFetch,
  StorageType,
} from '../plan/Plan'
import type { Prepared } from '../types/Prepared'
import { callFragment } from './callFragment'
import { type Scope, toCallArgument, toInteger } from './Scope'

export const TOO_MANY_VALUES =
  'Too many values. Update configuration to explore fully'

/** Large enough for any array V1 configs enumerate, small enough to bound a runaway plan. */
export const DEFAULT_HARD_MAX = 1_000

export interface FetchLimits {
  untilRevertHardMax: number
  rangeHardMax: number
}

export interface FetchEnvironment {
  provider: IProvider
  prepared: Prepared
  abi: AbiIndex
  scope: Scope
  limits: FetchLimits
}

export interface FetchResult {
  raw: unknown
  /** Set when `raw` is incomplete, e.g. an enumeration reached its cap. */
  error?: string
}

export interface KeyValue {
  key: ContractValue
  value: ContractValue
}

export interface DecodedLog {
  event: string
  blockNumber: number
  logIndex: number
  args: Record<string, ContractValue>
}

export function runFetch(
  fetch: Fetch,
  env: FetchEnvironment,
): Promise<FetchResult> {
  switch (fetch.kind) {
    case 'call':
      return fetchCall(fetch, env)
    case 'callEach':
      return fetchCallEach(fetch, env)
    case 'logs':
      return fetchLogs(fetch, env)
    case 'storage':
      return fetchStorage(fetch, env)
    case 'constructorArgs':
      return Promise.resolve(fetchConstructorArgs(fetch, env))
    case 'hardcoded':
      return Promise.resolve(fetchHardcoded(fetch, env))
  }
}

async function fetchCall(
  fetch: CallFetch,
  env: FetchEnvironment,
): Promise<FetchResult> {
  const fragment = resolveMethod(fetch.method, env.abi)
  const target = env.scope.resolveTarget(fetch.at)
  const args = (fetch.args ?? []).map((arg) =>
    toCallArgument(env.scope.resolve(arg)),
  )
  const outcome = await callFragment(env.provider, target, fragment, args)
  if (outcome.error !== undefined) {
    throw new Error(outcome.error)
  }
  return { raw: outcome.value }
}

async function fetchCallEach(
  fetch: CallEachFetch,
  env: FetchEnvironment,
): Promise<FetchResult> {
  const fragment = resolveMethod(fetch.method, env.abi)
  const target = env.scope.resolveTarget(fetch.at)
  const { keys } = fetch
  if ('untilRevert' in keys) {
    const max = Math.min(keys.untilRevert.max, env.limits.untilRevertHardMax)
    return enumerateUntilRevert(env, target, fragment, max)
  }
  if ('range' in keys) {
    const length = toInteger(
      env.scope.resolve(keys.range.length),
      'range.length',
    )
    const start = keys.range.start ?? 0
    const capped = Math.min(length, env.limits.rangeHardMax)
    const indices = Array.from({ length: capped }, (_, i) => start + i)
    const raw = await callForKeys(env, target, fragment, indices)
    return capped < length ? { raw, error: TOO_MANY_VALUES } : { raw }
  }
  const list =
    'literal' in keys
      ? keys.literal
      : keysFrom(env.scope.resolve(keys.from), keys.from)
  return { raw: await callForKeys(env, target, fragment, list) }
}

async function callForKeys(
  env: FetchEnvironment,
  target: ChainSpecificAddress,
  fragment: utils.FunctionFragment,
  keys: readonly unknown[],
): Promise<KeyValue[]> {
  const outcomes = await Promise.all(
    keys.map((key) =>
      callFragment(env.provider, target, fragment, toArguments(key, fragment)),
    ),
  )
  const failures = outcomes.flatMap((outcome, i) =>
    outcome.error === undefined
      ? []
      : [`key ${JSON.stringify(keys[i])}: ${outcome.error}`],
  )
  if (failures.length > 0) {
    throw new Error(summarise(failures))
  }
  return keys.map((key, i) => ({
    key: formatKey(env.prepared.chain, key),
    value: (outcomes[i] as { value: ContractValue }).value,
  }))
}

async function enumerateUntilRevert(
  env: FetchEnvironment,
  target: ChainSpecificAddress,
  fragment: utils.FunctionFragment,
  max: number,
): Promise<FetchResult> {
  const raw: KeyValue[] = []
  for (let index = 0; index < max; index++) {
    const outcome = await callFragment(env.provider, target, fragment, [index])
    if (outcome.error === EXEC_REVERT_MSG) {
      return { raw }
    }
    if (outcome.error !== undefined) {
      throw new Error(`key ${index}: ${outcome.error}`)
    }
    raw.push({ key: index, value: outcome.value })
  }
  return { raw, error: TOO_MANY_VALUES }
}

async function fetchLogs(
  fetch: LogsFetch,
  env: FetchEnvironment,
): Promise<FetchResult> {
  const fragments = fetch.events.map((event) => resolveEvent(event, env.abi))
  const coder = new utils.Interface(fragments)
  const perEvent = await Promise.all(
    fragments.map((fragment) =>
      env.provider.getLogs(env.prepared.address, [
        coder.getEventTopic(fragment),
      ]),
    ),
  )
  const logs = perEvent.flat().sort(orderLogs)
  const raw: DecodedLog[] = logs.map((log) =>
    decodeLog(log, coder, env.prepared.chain),
  )
  return { raw }
}

function decodeLog(
  log: providers.Log,
  coder: utils.Interface,
  chain: string,
): DecodedLog {
  const parsed = coder.parseLog(log)
  return {
    event: parsed.name,
    blockNumber: log.blockNumber,
    logIndex: log.logIndex,
    args: formatLogArgs(chain, parsed.args, parsed.eventFragment),
  }
}

const STORAGE_RETURN_TYPES: Record<
  StorageType,
  'address' | 'number' | 'bytes'
> = {
  address: 'address',
  uint: 'number',
  bytes32: 'bytes',
}

async function fetchStorage(
  fetch: StorageFetch,
  env: FetchEnvironment,
): Promise<FetchResult> {
  const target = env.scope.resolveTarget(fetch.at)
  const slot = typeof fetch.slot === 'number' ? fetch.slot : BigInt(fetch.slot)
  const bytes = await env.provider.getStorage(target, slot)
  const value = bytes32ToContractValue(bytes, STORAGE_RETURN_TYPES[fetch.as])
  return { raw: prefixAddresses(env.prepared.chain, value) }
}

/**
 * Decodes the explorer-provided constructor arguments with the constructor of
 * this address's own ABI (for a proxy, the proxy's), which is what V1's
 * handler reads when the deployment transaction is unavailable. Numbers stay
 * decimal strings, as V1's `serializeResult` renders them.
 */
function fetchConstructorArgs(
  _fetch: ConstructorArgsFetch,
  env: FetchEnvironment,
): FetchResult {
  const { prepared } = env
  const address = prepared.address.toString()
  const source = prepared.sources.find(
    (entry) => entry.address.toString() === address,
  )
  if (source === undefined) {
    throw new Error(`prepared.json has no source for ${address}`)
  }
  const constructorFragment = constructorOf(address, env)
  const decoded = utils.defaultAbiCoder.decode(
    constructorFragment.inputs,
    `0x${source.constructorArguments}`,
  )
  return {
    raw: prefixAddresses(prepared.chain, serializeConstructorArgs(decoded)),
  }
}

function constructorOf(
  address: string,
  env: FetchEnvironment,
): utils.ConstructorFragment {
  const own = env.prepared.abis[address]
  const fragment =
    own === undefined ? env.abi.constructorFragment : ownConstructor(own)
  if (fragment === undefined) {
    throw new Error('Constructor does not exist in abi')
  }
  return fragment
}

function ownConstructor(abi: string[]): utils.ConstructorFragment | undefined {
  return abi
    .map((entry) => utils.Fragment.from(entry))
    .find(
      (fragment): fragment is utils.ConstructorFragment =>
        fragment.type === 'constructor',
    )
}

function fetchHardcoded(
  fetch: HardcodedFetch,
  env: FetchEnvironment,
): FetchResult {
  return {
    raw: prefixAddresses(env.prepared.chain, fetch.value as ContractValue),
  }
}

function resolveMethod(method: string, abi: AbiIndex): utils.FunctionFragment {
  const lookup = abi.lookupFunction(method)
  if (lookup.error !== undefined) {
    throw new Error(lookup.error)
  }
  return lookup.fragment
}

function resolveEvent(event: string, abi: AbiIndex): utils.EventFragment {
  const lookup = abi.lookupEvent(event)
  if (lookup.error !== undefined) {
    throw new Error(lookup.error)
  }
  return lookup.fragment
}

function keysFrom(value: unknown, reference: string): unknown[] {
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value)
  }
  throw new Error(
    `keys.from: ${reference} is ${JSON.stringify(value)}; expected an array of keys or an object`,
  )
}

/** A multi-input method takes each key as its argument tuple; a single input takes the key itself. */
function toArguments(
  key: unknown,
  fragment: utils.FunctionFragment,
): unknown[] {
  if (fragment.inputs.length === 1) {
    return [toCallArgument(key)]
  }
  if (!Array.isArray(key) || key.length !== fragment.inputs.length) {
    throw new Error(
      `key ${JSON.stringify(key)} must be an array of ${fragment.inputs.length} values for ${fragment.format(utils.FormatTypes.sighash)}`,
    )
  }
  return key.map(toCallArgument)
}

function formatKey(chain: string, key: unknown): ContractValue {
  return prefixAddresses(chain, key as ContractValue)
}

function summarise(failures: string[]): string {
  const shown = failures.slice(0, 3)
  const rest = failures.length - shown.length
  return rest > 0 ? `${shown.join('; ')}; and ${rest} more` : shown.join('; ')
}
