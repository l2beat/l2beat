/**
 * The static checks a draft passes before it is dry-run and written.
 *
 * Findings are the only feedback the model gets in a repair round, so every
 * rule states what is wrong and what would be right, at the path of the
 * offending value. Rules, in order: R1 the reply is one JSON object; R2 the
 * shape (with R7, the blip whitelist, for `where` and `edit`); R3 one verdict
 * per worklist token; R4 names; R5 what each handler reads exists and runs
 * in V1; R6 references; R8 covers match what the handler reads; R9 events
 * skipped as activity that only privileged code emits. Last, every field
 * without an error is constructed with V1's own handler factory. R10, the
 * dry run, happens elsewhere.
 *
 * Schema findings are returned alone: every later rule reads the value as
 * a `Draft`, which is only safe once the schema holds.
 */
import { parseModelJson } from '../model/parseModelJson'
import { checkCoverage } from './checkCoverage'
import { checkCovers } from './checkCovers'
import { checkHandlers, checkV1Construction } from './checkHandlers'
import { checkNames } from './checkNames'
import { checkPrivilegedSkips } from './checkPrivilegedSkips'
import { checkReferences } from './checkReferences'
import { checkSchema } from './checkSchema'
import type { Draft } from './Draft'
import { type Finding, Findings } from './Finding'
import { buildRuleContext, type ValidationContext } from './ruleContext'

export { type NaturalCovers, naturalCovers } from './checkCovers'
export {
  emittedOnlyByPrivilegedCode,
  privilegedEmitters,
} from './privilegedEvents'
export type { ValidationContext } from './ruleContext'

export interface ValidationResult {
  /** Set only when R1 and R2 passed, so the caller may read it as a `Draft`. */
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
          severity: 'error',
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
  if (findings.hasErrors()) {
    return { findings: findings.list }
  }
  const draft = value as Draft
  const rules = buildRuleContext(draft, ctx, findings)
  checkCoverage(rules)
  checkNames(rules)
  checkHandlers(rules)
  checkReferences(rules)
  checkCovers(rules)
  checkPrivilegedSkips(rules)
  checkV1Construction(rules)
  return { draft, findings: findings.list }
}
