/**
 * The checks a draft passes before it is dry-run and written.
 *
 * Findings are the only feedback the model gets in a repair round, so every
 * rule states what is wrong and what would be right, at the path of the
 * offending value. In order: the reply is one JSON object; V1's own schema
 * for `template.jsonc` accepts it, every object walked as strict and each
 * handler against the definition its `type` names; it adds only what the
 * template does not have (`mergeTemplate`); every field it adds has a
 * reason, and none replaces a value discovery already produces
 * (`checkNames`); last, every handler it adds is constructed with V1's own
 * factory, and a full fragment written for a function of this contract has
 * the ABI's return types. Each of these is parsing, V1 itself, or a
 * comparison with what the template and the baseline already hold. Whether
 * a method or event exists, and what a handler does at the block, is the dry
 * run's to report.
 */
import { getErrorMessage, parseJsonc } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { ContractConfigSchema } from '../../../schemas/schemas'
import { StructureContract } from '../../config/StructureConfig'
import type { Handler } from '../../handlers/Handler'
import { getUserHandler, UserHandlerDefinition } from '../../handlers/user'
import {
  ARRAY_INDEX_TYPES,
  ArrayHandler,
} from '../../handlers/user/ArrayHandler'
import { CallHandler } from '../../handlers/user/CallHandler'
import { AbiIndex, sighash } from '../abi/AbiIndex'
import type { ContractFacts } from '../facts'
import { parseModelJson } from '../model/parseModelJson'
import { mergeTemplate } from '../write/mergeTemplate'
import { checkNames } from './checkNames'
import type { Draft } from './Draft'
import { type Finding, Findings, fieldPath, joinPath } from './Finding'
import { isPlainObject, schemaProblems, show } from './schemaProblems'

export interface ValidationContext {
  facts: ContractFacts
  /** The text of the template the draft adds to; a new template's holds only its `$schema`. */
  templateText: string
  isNew: boolean
}

export interface CheckedDraft {
  draft: Draft
  /** The template the file will hold, as discovery reads it. */
  template: StructureContract
  /** The fields the draft adds that compute a value, which the dry run runs. */
  added: string[]
}

export interface ValidationResult {
  /** Set only when nothing blocks, so the caller may dry-run it. */
  checked?: CheckedDraft
  findings: Finding[]
}

export function validateDraftText(
  text: string,
  ctx: ValidationContext,
): ValidationResult {
  const parsed = parseModelJson(text)
  if (parsed.error !== undefined) {
    return {
      findings: [
        {
          path: 'draft',
          message: `reply with exactly one JSON object { "fields": { … } } and nothing else; the reply does not parse as JSON (${parsed.error})`,
        },
      ],
    }
  }
  return validateDraft(parsed.value, ctx)
}

export function validateDraft(
  value: unknown,
  ctx: ValidationContext,
): ValidationResult {
  const findings = new Findings()
  if (!isPlainObject(value)) {
    findings.error(
      'draft',
      `the draft must be one JSON object { "fields": { … } }, got ${show(value)}`,
    )
    return { findings: findings.list }
  }
  const draft = takeReasons(value, findings)
  const added = addedEntries(draft, ctx.templateText)
  requireReasons(added, draft.reasons, findings)
  for (const problem of schemaProblems(
    ContractConfigSchema,
    draft.additions,
    '',
  )) {
    findings.error(problem.path, problem.message)
  }
  if (findings.list.length > 0) {
    return { findings: findings.list }
  }
  // Only a draft discovery's schema accepts can be merged: the merge
  // refuses a result discovery would not load.
  const merged = mergeTemplate({
    text: ctx.templateText,
    isNew: ctx.isNew,
    additions: draft.additions,
  })
  if ('problems' in merged) {
    return { findings: merged.problems }
  }
  checkNames(added, ctx.facts, findings)
  checkConstruction(added, ctx.facts.abi, findings)
  if (findings.list.length > 0) {
    return { findings: findings.list }
  }
  return {
    checked: {
      draft,
      template: StructureContract.parse(parseJsonc(merged.text)),
      added: added
        .filter(([, entry]) => computesValue(entry))
        .map(([name]) => name),
    },
    findings: [],
  }
}

/** `fields.<name>.reason` out of every entry: a string for the comment, nothing in the template. */
function takeReasons(
  value: Record<string, unknown>,
  findings: Findings,
): Draft {
  const reasons: Record<string, string> = {}
  if (!isPlainObject(value.fields)) {
    return { additions: value, reasons }
  }
  const fields: Record<string, unknown> = {}
  for (const [name, entry] of Object.entries(value.fields)) {
    if (!isPlainObject(entry) || !('reason' in entry)) {
      fields[name] = entry
      continue
    }
    const { reason, ...rest } = entry
    if (typeof reason === 'string' && reason.trim() !== '') {
      reasons[name] = reason
    } else {
      findings.error(joinPath(fieldPath(name), 'reason'), REASON)
    }
    fields[name] = rest
  }
  return { additions: { ...value, fields }, reasons }
}

const REASON =
  'one sentence naming the function that writes this state and its modifier, e.g. "isSequencer is written only by addSequencer/removeSequencer (onlyOwner), which emit UpdateSequencer"'

/** The field entries the template does not have yet; `mergeTemplate` already placed the rest. */
function addedEntries(
  draft: Draft,
  templateText: string,
): [string, Record<string, unknown>][] {
  const existing = parseJsonc<{ fields?: Record<string, unknown> }>(
    templateText,
  ).fields
  const fields = draft.additions.fields
  if (!isPlainObject(fields)) {
    return []
  }
  return Object.entries(fields).flatMap(([name, entry]) =>
    isPlainObject(entry) && existing?.[name] === undefined
      ? [[name, entry] as [string, Record<string, unknown>]]
      : [],
  )
}

function requireReasons(
  added: [string, Record<string, unknown>][],
  reasons: Record<string, string>,
  findings: Findings,
): void {
  const reported = new Set(findings.list.map((finding) => finding.path))
  for (const [name] of added) {
    const path = joinPath(fieldPath(name), 'reason')
    if (reasons[name] === undefined && !reported.has(path)) {
      findings.error(path, `missing; ${REASON}`)
    }
  }
}

function computesValue(entry: Record<string, unknown>): boolean {
  return (
    entry.handler !== undefined ||
    entry.copy !== undefined ||
    entry.edit !== undefined
  )
}

/**
 * V1's own handler factory, which is what `getHandlers` runs when the
 * template is applied; a handler it refuses would become an `ErrorHandler`
 * and an error in discovered.json.
 */
function checkConstruction(
  added: [string, Record<string, unknown>][],
  abi: string[],
  findings: Findings,
): void {
  for (const [name, entry] of added) {
    if (entry.handler === undefined) {
      continue
    }
    const path = joinPath(fieldPath(name), 'handler')
    let constructed: Handler
    try {
      constructed = getUserHandler(
        name,
        UserHandlerDefinition.parse(entry.handler),
        abi,
      )
    } catch (error) {
      findings.error(
        path,
        `V1 cannot construct this handler: ${getErrorMessage(error)}${constructionHint(name, entry.handler, abi)}`,
      )
      continue
    }
    checkReturnTypes(path, entry.handler, constructed, abi, findings)
  }
}

/**
 * A full fragment written for a function of this contract must have the
 * return types the ABI declares. V1 parses a `method` with a space in it
 * and never looks it up, so `function foo(uint256) view returns (bytes32)`
 * over an ABI `foo(uint256)` that returns an address constructs, calls the
 * right selector and decodes the same 32 bytes without an error at the
 * block: a wrong template the dry run cannot catch. A function the ABI does
 * not declare at all fails the dry run, so it is left to it.
 */
function checkReturnTypes(
  path: string,
  handler: unknown,
  constructed: Handler,
  abi: string[],
  findings: Findings,
): void {
  const written = writtenFragment(handler, constructed)
  if (written === undefined) {
    return
  }
  const signature = sighash(written)
  const declared = AbiIndex.of(abi).functionBySignature(signature)
  if (declared === undefined) {
    return
  }
  const writtenOutputs = outputTypes(written)
  const declaredOutputs = outputTypes(declared)
  if (writtenOutputs !== declaredOutputs) {
    findings.error(
      joinPath(path, 'method'),
      `the ABI declares ${signature} as \`${declared.format(utils.FormatTypes.full)}\`, returning (${declaredOutputs}), and this fragment returns (${writtenOutputs}): write \`method\` as the ABI's fragment`,
    )
  }
}

/**
 * The fragment V1 parsed from a full `method` for a function of this
 * contract; undefined for a bare name (V1 took it from the ABI), for a
 * `call` on another contract, and for handlers without a method.
 */
function writtenFragment(
  handler: unknown,
  constructed: Handler,
): utils.FunctionFragment | undefined {
  const { type, method, address } = handler as Record<string, unknown>
  // `includes(' ')` is V1's own test for a full fragment (`getFunctionFragment`).
  const full = typeof method === 'string' && method.includes(' ')
  const here = type === 'array' || (type === 'call' && address === undefined)
  if (!full || !here) {
    return undefined
  }
  return constructed instanceof CallHandler ||
    constructed instanceof ArrayHandler
    ? constructed.fragment
    : undefined
}

function outputTypes(fragment: utils.FunctionFragment): string {
  return (fragment.outputs ?? [])
    .map((output) => output.format(utils.FormatTypes.sighash))
    .join(', ')
}

/**
 * The construction failure models repeat: an `array` over a getter keyed by
 * a `uint8`, which V1's array handler does not take. V1's own message
 * ("Cannot find a matching method for isPaused", or "Invalid method abi"
 * for a full fragment) does not say why, and the next try was the same
 * handler spelled differently, round after round. The key types are V1's
 * own list, so the hint cannot drift from what V1 accepts.
 */
function constructionHint(
  name: string,
  handler: unknown,
  abi: string[],
): string {
  const { type, method } = handler as Record<string, unknown>
  if (type !== 'array') {
    return ''
  }
  const written = typeof method === 'string' ? method : name
  const fragmentName = written.includes(' ')
    ? safeFragmentName(written)
    : written
  const getter = AbiIndex.of(abi).functions.find(
    (fragment) =>
      fragment.name === fragmentName && fragment.inputs.length === 1,
  )
  const key = getter?.inputs[0]?.type
  if (
    getter === undefined ||
    key === undefined ||
    ARRAY_INDEX_TYPES.includes(key)
  ) {
    return ''
  }
  const enumNote = key === 'uint8' ? ', an enum in the source' : ''
  return `; array reads only a getter keyed by ${ARRAY_INDEX_TYPES.join(', ')}, and ${sighash(getter)} is keyed by ${key}${enumNote}: write one call field per key value with that value in args, or leave it out`
}

function safeFragmentName(fragment: string): string | undefined {
  try {
    return utils.Fragment.from(fragment)?.name
  } catch {
    return undefined
  }
}
