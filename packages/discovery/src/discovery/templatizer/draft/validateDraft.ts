/**
 * The static checks a draft passes before it is dry-run and written.
 *
 * Findings are the only feedback the model gets in a repair round, so every
 * rule states what is wrong and what would be right, at the path of the
 * offending value. Rules, in order: the reply is one JSON object; the
 * shape (`checkSchema`), with V1's own schema for each handler type and
 * V1's own blip check for `edit` and `where`; coverage or a skip per worklist
 * token (`checkVerdicts`); names that replace nothing (`checkNames`);
 * covers that match what the handler names (`checkCovers`); last, every
 * field is constructed with V1's own handler factory. Each of these is
 * certain: parsing, counting over a closed list, comparing names the model
 * wrote, or V1 itself. What V1 does at the block is the dry run's to report.
 *
 * Schema findings are returned alone: every later rule reads the value as
 * a `Draft`, which is only safe once the schema holds.
 */
import { getErrorMessage } from '../../../utils/getErrorMessage'
import { getUserHandler, UserHandlerDefinition } from '../../handlers/user'
import { ARRAY_INDEX_TYPES } from '../../handlers/user/ArrayHandler'
import { sighash } from '../abi/AbiIndex'
import { parseModelJson } from '../model/parseModelJson'
import { checkCovers } from './checkCovers'
import { checkNames } from './checkNames'
import { checkSchema } from './checkSchema'
import { checkVerdicts } from './checkVerdicts'
import type { Draft, DraftHandler } from './Draft'
import { type Finding, Findings, fieldPath, joinPath } from './Finding'
import {
  buildRuleContext,
  type RuleContext,
  type ValidationContext,
} from './ruleContext'

export type { ValidationContext } from './ruleContext'

export interface ValidationResult {
  /** Set only when the reply parsed and its shape holds, so the caller may read it as a `Draft`. */
  draft?: Draft
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
          message: `reply with exactly one JSON object { "fields": { … }, "skips": [ … ] } and nothing else; the reply does not parse as JSON (${parsed.error})`,
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
  checkSchema(value, findings)
  if (findings.list.length > 0) {
    return { findings: findings.list }
  }
  const draft = value as Draft
  const rules = buildRuleContext(draft, ctx, findings)
  checkVerdicts(rules)
  checkNames(rules)
  checkCovers(rules)
  checkConstruction(rules)
  return { draft, findings: findings.list }
}

/**
 * V1's own handler factory, which is what `getHandlers` runs when the
 * template is applied; a handler it refuses would become an `ErrorHandler`
 * and an error in discovered.json.
 */
function checkConstruction(ctx: RuleContext): void {
  for (const [name, field] of Object.entries(ctx.draft.fields)) {
    try {
      getUserHandler(
        name,
        UserHandlerDefinition.parse(field.handler),
        ctx.facts.abi,
      )
    } catch (error) {
      ctx.findings.error(
        joinPath(fieldPath(name), 'handler'),
        `V1 cannot construct this handler: ${getErrorMessage(error)}${constructionHint(name, field.handler, ctx)}`,
      )
    }
  }
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
  handler: DraftHandler,
  ctx: RuleContext,
): string {
  if (handler.type !== 'array') {
    return ''
  }
  const method = ctx.reads.get(name)?.method
  if (method === undefined) {
    return ''
  }
  const getter = ctx.abi.functions.find(
    (fragment) =>
      fragment.name === method.name &&
      fragment.inputs.length === 1 &&
      (method.signature === undefined ||
        sighash(fragment) === method.signature),
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
  return `; array reads only a getter keyed by ${ARRAY_INDEX_TYPES.join(', ')}, and ${sighash(getter)} is keyed by ${key}${enumNote}: write one call field per key value with that value in args, or skip it`
}
