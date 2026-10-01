/**
 * R5 for `event` fields: every name the handler uses exists where V1 will
 * look for it.
 *
 * An event handler that names a missing argument does not fail loudly: V1
 * throws on the first log it cannot extract from, or a `where` that can
 * never match quietly yields an empty set, which the dry run then reports
 * as "no logs" far from the cause. So each event resolves as
 * `getEventFragment` resolves it, events mixed in one action are compatible
 * the way `EventHandler` demands, `select`/`groupBy`/`dedupBy` name an
 * argument of every event read, and each `where` names an argument of every
 * event of its action with a literal spelled as the log value renders.
 */
import { utils } from 'ethers'
import { fullSignature, sighash } from '../abi/AbiIndex'
import { closest } from '../closest'
import { parseWhere } from './checkBlips'
import type { DraftHandler } from './Draft'
import { joinPath } from './Finding'
import {
  type ActionReads,
  type EventRead,
  type FieldReads,
  readEvents,
} from './fieldReads'
import type { RuleContext } from './ruleContext'
import { whereLiteralProblem } from './whereLiterals'

const ARGUMENT_SELECTORS = ['select', 'groupBy', 'dedupBy'] as const

export function checkEventHandler(
  handler: DraftHandler,
  reads: FieldReads,
  path: string,
  ctx: RuleContext,
): void {
  for (const action of reads.actions) {
    action.events.forEach((event) => checkEventRead(event, path, ctx))
    const fragments = resolvedFragments(action)
    if (fragments.length === action.events.length) {
      checkCompatible(action, fragments, path, ctx)
    }
    checkWhereArgument(action, fragments, path, ctx)
  }
  const events = readEvents(reads)
  for (const key of ARGUMENT_SELECTORS) {
    checkArgumentSelector(handler, key, events, path, ctx)
  }
  checkFlatten(handler, path, ctx)
}

function checkEventRead(
  event: EventRead,
  path: string,
  ctx: RuleContext,
): void {
  const eventPath = joinPath(path, event.path)
  const resolution = event.resolution
  if (resolution.error !== undefined) {
    ctx.findings.error(eventPath, resolution.error)
    return
  }
  const { fragment } = resolution
  if (fragment.inputs.length === 0) {
    ctx.findings.error(
      eventPath,
      `${sighash(fragment)} has no parameters, and V1's event handler rejects an event without any as incompatible; read this state another way or skip the event`,
    )
  }
  if (!resolution.inAbi) {
    ctx.findings.warning(
      eventPath,
      `${sighash(fragment)} is not declared in this ABI; V1 accepts the fragment but still fetches logs from this contract only, so it matches only if this contract emits that event`,
    )
  }
  const others = resolution.overloads.filter(
    (overload) => sighash(overload) !== sighash(fragment),
  )
  if (others.length > 0) {
    const alternatives = others.map((other) => `"${fullSignature(other)}"`)
    ctx.findings.warning(
      eventPath,
      `"${event.reference}" is overloaded and V1 reads only its first declaration, "${fullSignature(fragment)}"; if the contract emits ${alternatives.join(' or ')}, read it in an action of its own with that full fragment`,
    )
  }
}

function resolvedFragments(action: ActionReads): utils.EventFragment[] {
  return action.events.flatMap((event) =>
    event.resolution.fragment ? [event.resolution.fragment] : [],
  )
}

/**
 * `EventHandler` requires every parameter of the event with the fewest
 * parameters to appear, identically, in each other event of the action.
 */
function checkCompatible(
  action: ActionReads,
  fragments: utils.EventFragment[],
  path: string,
  ctx: RuleContext,
): void {
  if (fragments.length < 2) {
    return
  }
  const smallest = fragments.reduce((min, fragment) =>
    fragment.inputs.length < min.inputs.length ? fragment : min,
  )
  for (const other of fragments) {
    const missing = smallest.inputs.filter(
      (param) => !other.inputs.some((candidate) => sameParam(param, candidate)),
    )
    if (missing.length > 0) {
      const eventPath = joinPath(path, `${action.path}.event`)
      ctx.findings.error(
        eventPath,
        `events in one action must share their parameters (V1 compares names, types and indexed); ${other.name} has no ${missing.map(describeParam).join(', ')} as ${smallest.name} declares; read them in separate actions`,
      )
      return
    }
  }
}

function checkWhereArgument(
  action: ActionReads,
  fragments: utils.EventFragment[],
  path: string,
  ctx: RuleContext,
): void {
  const comparison = parseWhere(action.where)
  if (comparison === undefined) {
    return
  }
  const wherePath = joinPath(path, `${action.path}.where`)
  for (const fragment of fragments) {
    const param = fragment.inputs.find((p) => p.name === comparison.argument)
    if (param === undefined) {
      ctx.findings.error(
        wherePath,
        `event ${fragment.name} has no argument "${comparison.argument}"; ${describeArguments(fragment, comparison.argument)}`,
      )
      continue
    }
    const problem = whereLiteralProblem(
      comparison.literal,
      param,
      ctx.facts.chain,
    )
    if (problem !== undefined) {
      ctx.findings.error(
        wherePath,
        `${fragment.name}.${param.name} is ${param.format()}: ${problem}`,
      )
    }
  }
}

function checkArgumentSelector(
  handler: DraftHandler,
  key: (typeof ARGUMENT_SELECTORS)[number],
  events: utils.EventFragment[],
  path: string,
  ctx: RuleContext,
): void {
  const value = handler[key] as string | string[] | undefined
  if (value === undefined) {
    return
  }
  const selectors = Array.isArray(value)
    ? value.map((selector, i) => ({ selector, at: `${key}[${i}]` }))
    : [{ selector: value, at: key }]
  for (const { selector, at } of selectors) {
    for (const event of events) {
      const problem = argumentPathProblem(event, selector)
      if (problem !== undefined) {
        ctx.findings.error(joinPath(path, at), problem)
      }
    }
  }
}

/**
 * `select` and friends accept dot paths into nested values; decoded tuples
 * are positional arrays (`toContractValue` drops component names), so only
 * numeric segments reach into them.
 */
export function argumentPathProblem(
  event: utils.EventFragment,
  selector: string,
): string | undefined {
  const [head = '', ...rest] = selector.split('.')
  let param = event.inputs.find((input) => input.name === head)
  if (param === undefined) {
    return `event ${event.name} has no argument "${head}"; ${describeArguments(event, head)}`
  }
  let reached = head
  for (const segment of rest) {
    const next = childParam(param, segment)
    if (typeof next === 'string') {
      return `${event.name}.${reached} is ${param.format(utils.FormatTypes.full)}: ${next}`
    }
    param = next
    reached = `${reached}.${segment}`
  }
  return undefined
}

function childParam(
  param: utils.ParamType,
  segment: string,
): utils.ParamType | string {
  const index = /^\d+$/.test(segment) ? Number(segment) : undefined
  if (param.baseType === 'tuple') {
    const byName = param.components.findIndex((c) => c.name === segment)
    if (index === undefined) {
      return byName >= 0
        ? `decoded tuples are positional arrays, so address "${segment}" by its index ${byName}`
        : `address a component by its index, 0 to ${param.components.length - 1}`
    }
    return (
      param.components[index] ??
      `it has ${param.components.length} components, so index ${index} does not exist`
    )
  }
  if (param.baseType === 'array') {
    if (index === undefined) {
      return 'address an element by its index'
    }
    if (param.arrayLength !== -1 && index >= param.arrayLength) {
      return `it has ${param.arrayLength} elements, so index ${index} does not exist`
    }
    return param.arrayChildren
  }
  return `a ${param.type} has no part "${segment}"`
}

/** V1 asserts that `flatten` expands exactly one selected argument. */
function checkFlatten(
  handler: DraftHandler,
  path: string,
  ctx: RuleContext,
): void {
  if (handler.flatten !== true) {
    return
  }
  const select = handler.select
  const count =
    select === undefined ? 0 : Array.isArray(select) ? select.length : 1
  if (count !== 1) {
    ctx.findings.error(
      joinPath(path, 'flatten'),
      '`flatten` expands the array of the one selected argument into one row per element, so `select` must name exactly one argument',
    )
  }
}

function describeArguments(event: utils.EventFragment, wanted: string): string {
  const names = event.inputs
    .map((input) => input.name)
    .filter((name) => name !== '')
  if (names.length === 0) {
    return 'its parameters are unnamed, and V1 can only address named ones'
  }
  const [hint] = closest(names, wanted, 1)
  const guess = names.length > 1 ? ` (closest: ${hint})` : ''
  return `its arguments are ${names.join(', ')}${guess}`
}

function describeParam(param: utils.ParamType): string {
  return `${param.format()}${param.indexed ? ' indexed' : ''} ${param.name}`
}

function sameParam(a: utils.ParamType, b: utils.ParamType): boolean {
  return (
    a.name === b.name &&
    a.format() === b.format() &&
    Boolean(a.indexed) === Boolean(b.indexed)
  )
}
