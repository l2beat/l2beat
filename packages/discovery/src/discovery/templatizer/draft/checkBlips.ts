/**
 * The blip whitelist (R7): the only `where` and `edit` forms a draft uses.
 *
 * Blip is a small Lisp; the census of committed templates found every event
 * `where` to be one argument compared with one literal, and edits to be
 * `format` with a type caster or `get` of a key. Restricting the model to
 * those forms means it fills arguments of fixed programs instead of writing
 * programs, which is what kept the research drafts checkable. Anything else
 * gets one finding that shows every allowed form with an example.
 */
import { validateBlip } from '../../../blip/validateBlip'
import { FORMAT_TYPE_CASTERS } from './Draft'
import { show } from './schemaProblems'

export interface WhereComparison {
  operator: '=' | '!='
  /** The event argument name, without the leading `#`. */
  argument: string
  literal: string | number | boolean
}

const ARGUMENT = /^#([A-Za-z_$][A-Za-z0-9_$]*)$/

/** The comparison a whitelisted `where` makes, or undefined for any other value. */
export function parseWhere(where: unknown): WhereComparison | undefined {
  if (!Array.isArray(where) || where.length !== 3) {
    return undefined
  }
  const [operator, argument, literal] = where as unknown[]
  const name = typeof argument === 'string' ? ARGUMENT.exec(argument) : null
  if (
    (operator !== '=' && operator !== '!=') ||
    name === null ||
    !isLiteral(literal)
  ) {
    return undefined
  }
  return { operator, argument: name[1] as string, literal }
}

export function whereProblem(where: unknown): string | undefined {
  if (parseWhere(where) !== undefined && validateBlip(where)) {
    return undefined
  }
  return `\`where\` must be one comparison of an event argument with a literal: ["=", "#status", true] keeps logs whose \`status\` is true, ["!=", "#status", true] keeps the others; the argument is written "#name" and the literal is a string, number or boolean. Got ${show(where)}`
}

export function editProblem(edit: unknown): string | undefined {
  if (isAllowedEdit(edit) && validateBlip(edit)) {
    return undefined
  }
  const casters = FORMAT_TYPE_CASTERS.map((name) => `["format", "${name}"]`)
  return `\`edit\` must be ${casters.join(' or ')} (render seconds as a duration) or ["get", key, …] (keep one part of the value: ["get", "owner"] for an object key, ["get", 0] for an array index); got ${show(edit)}`
}

function isAllowedEdit(edit: unknown): boolean {
  if (!Array.isArray(edit)) {
    return false
  }
  const [operation, ...args] = edit as unknown[]
  if (operation === 'format') {
    return (
      args.length === 1 &&
      (FORMAT_TYPE_CASTERS as readonly unknown[]).includes(args[0])
    )
  }
  return (
    operation === 'get' &&
    args.length >= 1 &&
    args.every((key) => typeof key === 'string' || typeof key === 'number')
  )
}

/** A string starting with `#` is not a literal to blip: it reads another argument. */
function isLiteral(value: unknown): value is string | number | boolean {
  return (
    (typeof value === 'string' && !value.startsWith('#')) ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}
