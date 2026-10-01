/**
 * R5: each handler reads something this contract has, in a form V1 runs.
 *
 * The checks predict what V1 does at run time rather than what the ABI
 * allows: V1 resolves method names by prefix, passes call arguments to
 * ethers unchanged, caps arrays at `maxLength`, and matches role hashes
 * as logs render them. Each such trap becomes a finding here instead of an
 * error in the dry run, after RPC calls were spent, or a value that is
 * silently wrong.
 *
 * As a backstop, every field without an error is finally constructed with
 * V1's own `getUserHandler`, which is what `getHandlers` does; anything it
 * throws is exactly what V1 would turn into an `ErrorHandler`, so an
 * accepted draft always constructs.
 */
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { getErrorMessage } from '../../../utils/getErrorMessage'
import { getReferencedPath } from '../../handlers/reference'
import { getUserHandler, UserHandlerDefinition } from '../../handlers/user'
import { checkLiteral, isAddressLiteral } from '../abi/literals'
import { checkEventHandler } from './checkEventHandler'
import type { DraftHandler } from './Draft'
import { fieldPath, joinPath } from './Finding'
import type { FieldReads } from './fieldReads'
import { isFieldPath, type RuleContext } from './ruleContext'
import { appendKey, show } from './schemaProblems'

const DEFAULT_ARRAY_MAX_LENGTH = 100
const DEFAULT_ADMIN_ROLE = 'DEFAULT_ADMIN_ROLE'

export function checkHandlers(ctx: RuleContext): void {
  for (const [name, field] of Object.entries(ctx.draft.fields)) {
    const handler = field.handler
    const reads = ctx.reads.get(name) as FieldReads
    const path = joinPath(fieldPath(name), 'handler')
    switch (handler.type) {
      case 'call':
        checkCall(handler, reads, path, ctx)
        break
      case 'array':
        checkArray(handler, reads, path, ctx)
        break
      case 'event':
        checkEventHandler(handler, reads, path, ctx)
        break
      case 'accessControl':
        checkAccessControl(handler, path, ctx)
        break
      case 'storage':
        checkStorage(handler, path, ctx)
        break
      case 'constructorArgs':
        checkConstructorArgs(path, ctx)
        break
      case 'hardcoded':
        break
    }
  }
}

/** Constructs every field that has no error yet the way `getHandlers` does. */
export function checkV1Construction(ctx: RuleContext): void {
  for (const [name, field] of Object.entries(ctx.draft.fields)) {
    const prefix = fieldPath(name)
    const hasError = ctx.findings.list.some(
      (finding) =>
        finding.severity === 'error' && isFieldPath(finding.path, prefix),
    )
    if (hasError) {
      continue
    }
    const problem = v1ConstructionProblem(name, field.handler, ctx.facts.abi)
    if (problem !== undefined) {
      ctx.findings.error(
        joinPath(prefix, 'handler'),
        `V1 cannot construct this handler: ${problem}`,
      )
    }
  }
}

function v1ConstructionProblem(
  name: string,
  handler: DraftHandler,
  abi: readonly string[],
): string | undefined {
  try {
    const parsed = UserHandlerDefinition.safeParse(handler)
    if (!parsed.success) {
      return `${parsed.path || 'handler'}: ${parsed.message}`
    }
    getUserHandler(name, parsed.data, abi as string[])
    return undefined
  } catch (error) {
    return getErrorMessage(error)
  }
}

function methodPath(handler: DraftHandler, path: string): string {
  return handler.method === undefined ? path : joinPath(path, 'method')
}

function checkCall(
  handler: DraftHandler,
  reads: FieldReads,
  path: string,
  ctx: RuleContext,
): void {
  const resolution = reads.method
  if (resolution?.error !== undefined) {
    ctx.findings.error(methodPath(handler, path), resolution.error)
  }
  const inputs = resolution?.fragment?.inputs
  const args = handler.args as (string | number)[]
  if (inputs !== undefined) {
    args.forEach((arg, i) => {
      const problem = callArgumentProblem(arg, inputs[i] as utils.ParamType)
      if (problem !== undefined) {
        ctx.findings.error(joinPath(path, `args[${i}]`), problem)
      }
    })
  }
  if (typeof handler.address === 'string') {
    const problem = callAddressProblem(handler.address, ctx.facts.chain)
    if (problem !== undefined) {
      ctx.findings.error(joinPath(path, 'address'), problem)
    }
  }
}

/**
 * V1 hands literal arguments to ethers as they are written, and the
 * schema only allows strings and numbers, so arrays, tuples, booleans and
 * chain-prefixed addresses each need their own spelling. References are
 * checked by R6.
 */
export function callArgumentProblem(
  arg: string | number,
  input: utils.ParamType,
): string | undefined {
  if (typeof arg === 'string' && arg.includes('{{')) {
    return undefined
  }
  if (input.baseType === 'array' || input.baseType === 'tuple') {
    return `V1's call args are strings or numbers, so a ${input.format()} argument can only come from a "{{ field }}" reference to a value of that shape`
  }
  if (input.type === 'bool') {
    return arg === 0 || arg === 1
      ? undefined
      : `V1's call args are strings or numbers and ethers encodes a bool by truthiness (so "false" would be sent as true); write 1 for true or 0 for false, got ${show(arg)}`
  }
  const problem = checkLiteral(arg, input)
  if (problem !== undefined) {
    return problem
  }
  if (input.type === 'address' && ChainSpecificAddress.check(String(arg))) {
    const plain = ChainSpecificAddress.address(
      ChainSpecificAddress(String(arg)),
    )
    return `V1 passes call args to ethers unchanged, and ethers rejects a chain-prefixed address; write "${plain}"`
  }
  return undefined
}

/**
 * CallHandler takes a literal `address` either raw or as a checksummed
 * address of this chain; anything else throws when the field runs.
 */
function callAddressProblem(
  address: string,
  chain: string,
): string | undefined {
  if (getReferencedPath(address) !== undefined || address.includes('{{')) {
    return undefined
  }
  if (!isAddressLiteral(address)) {
    return `\`address\` must be a reference to a field holding the other contract's address, such as "{{ registry }}", or a literal address; got ${show(address)}`
  }
  if (
    ChainSpecificAddress.check(address) &&
    ChainSpecificAddress.longChain(address) !== chain
  ) {
    return `${address} is on another chain; V1 calls it through the ${chain} provider, so write an address of this chain`
  }
  return undefined
}

function checkArray(
  handler: DraftHandler,
  reads: FieldReads,
  path: string,
  ctx: RuleContext,
): void {
  const resolution = reads.method
  if (resolution?.error !== undefined) {
    ctx.findings.error(methodPath(handler, path), resolution.error)
  }
  const index = resolution?.fragment?.inputs[0]
  const { indices, length } = handler
  if (indices !== undefined && length !== undefined) {
    ctx.findings.error(
      path,
      'V1 refuses `indices` together with `length` ("Cannot define both indices and length"); keep `indices` for fixed keys or `length` for a prefix 0…length-1',
    )
  }
  if (Array.isArray(indices)) {
    indices.forEach((key, i) => {
      const problem = indexProblem(key, index)
      if (problem !== undefined) {
        ctx.findings.error(joinPath(path, `indices[${i}]`), problem)
      }
    })
  }
  if (typeof indices === 'string' && !indices.includes('{{')) {
    ctx.findings.error(
      joinPath(path, 'indices'),
      `a string \`indices\` must be a reference to a field holding the keys, such as "{{ supportedParams }}"; otherwise list the keys as numbers`,
    )
  }
  const lengthProblem =
    typeof length === 'number' ? arrayLengthProblem(length, handler) : undefined
  if (lengthProblem !== undefined) {
    ctx.findings.error(joinPath(path, 'length'), lengthProblem)
  }
}

/** ArrayHandler stops at `maxLength` and reports "Too many values" when `length` is larger. */
export function arrayLengthProblem(
  length: number,
  handler: DraftHandler,
): string | undefined {
  const maxLength =
    (handler.maxLength as number | undefined) ?? DEFAULT_ARRAY_MAX_LENGTH
  if (length <= maxLength) {
    return undefined
  }
  return `V1 reads at most \`maxLength\` (${maxLength}) elements and reports "Too many values" when \`length\` is larger; set "maxLength" to at least ${length}`
}

function indexProblem(
  key: unknown,
  input: utils.ParamType | undefined,
): string | undefined {
  if (typeof key !== 'number' || !Number.isInteger(key) || key < 0) {
    return `expected a non-negative integer index, got ${show(key)}`
  }
  return input === undefined ? undefined : checkLiteral(key, input)
}

function checkAccessControl(
  handler: DraftHandler,
  path: string,
  ctx: RuleContext,
): void {
  if (!looksLikeAccessControl(ctx)) {
    ctx.findings.error(
      path,
      'this contract is not OpenZeppelin AccessControl: its ABI has neither hasRole(bytes32,address) nor the RoleGranted event, so V1 would find no roles; drop the field',
    )
    return
  }
  const roleNames = (handler.roleNames ?? {}) as Record<string, string>
  for (const hash of Object.keys(roleNames)) {
    if (hash !== hash.toLowerCase()) {
      ctx.findings.error(
        appendKey(joinPath(path, 'roleNames'), hash),
        `V1 looks role hashes up as logs render them, in lowercase; write "${hash.toLowerCase()}"`,
      )
    }
  }
  const picked = handler.pickRoleMembers
  if (typeof picked === 'string') {
    const known = knownRoleNames(roleNames, ctx)
    if (!known.includes(picked) && !/^0x[0-9a-f]{64}$/.test(picked)) {
      ctx.findings.error(
        joinPath(path, 'pickRoleMembers'),
        `V1 names roles ${DEFAULT_ADMIN_ROLE}, after the *_ROLE getters of the ABI and after roleNames, and fails with "No role (${picked}) found" for any other name; known here: ${known.join(', ')}`,
      )
    }
  }
}

function looksLikeAccessControl(ctx: RuleContext): boolean {
  return (
    ctx.abi.lookupFunction('hasRole(bytes32,address)').fragment !== undefined ||
    ctx.abi.eventNames().includes('RoleGranted')
  )
}

/** The names `AccessControlHandler` gives roles: the admin role, `*_ROLE()` getters, `roleNames`. */
function knownRoleNames(
  roleNames: Record<string, string>,
  ctx: RuleContext,
): string[] {
  const getters = ctx.abi.functions
    .filter(
      (fragment) =>
        fragment.inputs.length === 0 && fragment.name.endsWith('_ROLE'),
    )
    .map((fragment) => fragment.name)
  return [
    ...new Set([DEFAULT_ADMIN_ROLE, ...getters, ...Object.values(roleNames)]),
  ]
}

function checkStorage(
  handler: DraftHandler,
  path: string,
  ctx: RuleContext,
): void {
  const slots = Array.isArray(handler.slot)
    ? handler.slot.map((slot, i) => ({ slot, at: `slot[${i}]` }))
    : [{ slot: handler.slot, at: 'slot' }]
  for (const { slot, at } of [
    ...slots,
    { slot: handler.offset, at: 'offset' },
  ]) {
    if (typeof slot === 'number' && !Number.isSafeInteger(slot)) {
      ctx.findings.error(
        joinPath(path, at),
        `${slot} is beyond 2^53, where JSON numbers lose digits; write it as a 0x hex string`,
      )
    }
  }
}

function checkConstructorArgs(path: string, ctx: RuleContext): void {
  const declared = ctx.abi.constructorFragment
  if (declared === undefined) {
    ctx.findings.error(
      path,
      'the ABI declares no constructor, so there are no constructor arguments to decode; drop the field',
    )
    return
  }
  if (
    ctx.facts.proxyType !== undefined &&
    ctx.facts.proxyType !== 'immutable'
  ) {
    ctx.findings.warning(
      path,
      `V1 decodes "${declared.format(utils.FormatTypes.full)}", the first constructor of the merged ABI, from this address's deployment; behind a ${ctx.facts.proxyType} that is usually the proxy's own constructor, not the implementation's`,
    )
  }
}
