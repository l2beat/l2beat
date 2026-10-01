/**
 * R2: the draft has the shape every later rule assumes.
 *
 * Checked piece by piece so one reply gets every shape mistake back at
 * once: the envelope (`fields`, `skips`), each field, each handler against
 * the V1 definition its `type` selects, the two blip positions (R7) and
 * each skip. A handler is only checked against its own type's schema,
 * because a failure against V1's 33-member union cannot say which key was
 * wrong.
 */

import { editProblem, whereProblem } from './checkBlips'
import {
  type DraftHandler,
  DraftShape,
  HANDLER_TYPES,
  handlerSchemaFor,
  isHandlerType,
} from './Draft'
import { type Findings, fieldPath, joinPath } from './Finding'
import { isPlainObject, schemaProblems, show } from './schemaProblems'

export function checkSchema(value: unknown, findings: Findings): void {
  if (!isPlainObject(value)) {
    findings.error(
      'draft',
      `the draft must be one JSON object { "fields": { … }, "skips": [ … ] }, got ${show(value)}`,
    )
    return
  }
  for (const problem of schemaProblems(DraftShape, value, '')) {
    findings.error(
      problem.path,
      withSkipReasonHint(problem.path, problem.message),
    )
  }
  if (isPlainObject(value.fields)) {
    for (const [name, field] of Object.entries(value.fields)) {
      if (isPlainObject(field)) {
        checkField(fieldPath(name), field, findings)
      }
    }
  }
}

function checkField(
  path: string,
  field: Record<string, unknown>,
  findings: Findings,
): void {
  if (typeof field.reason === 'string' && field.reason.trim() === '') {
    findings.error(
      joinPath(path, 'reason'),
      'must be one sentence naming the function that writes this state and its modifier, e.g. "isSequencer is written only by addSequencer/removeSequencer (onlyOwner), which emit UpdateSequencer"',
    )
  }
  if (field.edit !== undefined) {
    const problem = editProblem(field.edit)
    if (problem !== undefined) {
      findings.error(joinPath(path, 'edit'), problem)
    }
  }
  checkHandlerShape(joinPath(path, 'handler'), field.handler, findings)
}

function checkHandlerShape(
  path: string,
  handler: unknown,
  findings: Findings,
): void {
  if (!isPlainObject(handler)) {
    findings.error(
      path,
      `every field needs a handler object such as { "type": "call", "method": "getDelay", "args": [] }, got ${show(handler)}`,
    )
    return
  }
  if (!isHandlerType(handler.type)) {
    findings.error(
      joinPath(path, 'type'),
      `must be one of ${HANDLER_TYPES.join(', ')}; got ${show(handler.type)}`,
    )
    return
  }
  const typed = handler as DraftHandler
  const modeProblem = eventModeProblem(typed)
  if (modeProblem !== undefined) {
    findings.error(path, modeProblem)
    return
  }
  for (const problem of schemaProblems(handlerSchemaFor(typed), typed, path)) {
    findings.error(problem.path, problem.message)
  }
  if (typed.type === 'event') {
    checkWheres(path, typed, findings)
  }
  if (typed.type === 'hardcoded' && typed.value === undefined) {
    findings.error(
      joinPath(path, 'value'),
      'missing; a hardcoded field holds exactly the `value` given here',
    )
  }
}

/** `set` and `add` select different V1 schemas, so the mode is settled before either applies. */
function eventModeProblem(handler: DraftHandler): string | undefined {
  if (handler.type !== 'event') {
    return undefined
  }
  const hasSet = handler.set !== undefined
  const hasAdd = handler.add !== undefined || handler.remove !== undefined
  if (hasSet && hasAdd) {
    return 'an event handler either keeps the latest matching log (`set`) or replays logs into a set of values (`add`, optionally `remove`), not both'
  }
  if (!hasSet && !hasAdd) {
    return 'an event handler needs `set` (the latest matching log) or `add` (a set of values, optionally with `remove`)'
  }
  return undefined
}

function checkWheres(
  path: string,
  handler: DraftHandler,
  findings: Findings,
): void {
  for (const key of ['set', 'add', 'remove'] as const) {
    const value = handler[key]
    const actions = Array.isArray(value) ? value : [value]
    actions.forEach((action, i) => {
      if (!isPlainObject(action) || action.where === undefined) {
        return
      }
      const problem = whereProblem(action.where)
      if (problem !== undefined) {
        const actionPath = Array.isArray(value) ? `${key}[${i}]` : key
        findings.error(joinPath(path, `${actionPath}.where`), problem)
      }
    })
  }
}

function withSkipReasonHint(path: string, message: string): string {
  if (!/^skips\[\d+\]\.reason$/.test(path)) {
    return message
  }
  return `${message}; covered = another field or a baseline getter already holds it, computation = derivable from its inputs or other values, unbounded = privileged but not enumerable or growing per batch, user-activity = per-user or per-operation state, not-state = interface checks, versions, helpers`
}
