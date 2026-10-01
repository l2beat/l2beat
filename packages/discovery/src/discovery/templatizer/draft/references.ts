/**
 * Where a draft handler may hold `{{ field }}` references, and the
 * dependency cycles they form.
 *
 * The positions are the ones V1's handlers resolve (call `args` and
 * `address`, array `length` and `indices`, storage `slot` and `offset`),
 * and a value counts as a reference exactly when V1's `getReferencedPath`
 * says so. Anywhere else, or in any other spelling, V1 passes the string on
 * literally.
 */
import { getReferencedPath } from '../../handlers/reference'
import type { DraftHandler } from './Draft'

export type ReferencePosition =
  | 'arg'
  | 'address'
  | 'length'
  | 'indices'
  | 'slot'
  | 'offset'

export interface ReferenceSlot {
  /** Path inside the handler, e.g. `args[1]`. */
  path: string
  position: ReferencePosition
  /** For `arg`: which argument of the called function. */
  argIndex?: number
  value: unknown
}

export interface ReferenceSite extends ReferenceSlot {
  /** `constructorArgs._owner` for `{{ constructorArgs._owner }}`. */
  referenced: string
  /** The field name V1 schedules the dependency on. */
  base: string
  /** The path V1 walks inside that field's value. */
  rest: string[]
}

/** Every value at a position V1 resolves references in. */
export function referenceSlots(handler: DraftHandler): ReferenceSlot[] {
  switch (handler.type) {
    case 'call':
      return [
        ...(handler.args as unknown[]).map((value, i) => ({
          path: `args[${i}]`,
          position: 'arg' as const,
          argIndex: i,
          value,
        })),
        ...optionalSlot('address', 'address', handler.address),
      ]
    case 'array':
      return [
        ...optionalSlot('length', 'length', handler.length),
        ...optionalSlot('indices', 'indices', handler.indices),
      ]
    case 'storage':
      return [
        ...(Array.isArray(handler.slot)
          ? handler.slot.map((value, i) => ({
              path: `slot[${i}]`,
              position: 'slot' as const,
              value,
            }))
          : optionalSlot('slot', 'slot', handler.slot)),
        ...optionalSlot('offset', 'offset', handler.offset),
      ]
    default:
      return []
  }
}

/** The slots V1 reads as references, split into the field and the path within it. */
export function referenceSites(handler: DraftHandler): ReferenceSite[] {
  return referenceSlots(handler).flatMap((slot) => {
    const referenced = getReferencedPath(slot.value)
    if (referenced === undefined) {
      return []
    }
    const [base = '', ...rest] = referenced.split('.')
    return [{ ...slot, referenced, base, rest }]
  })
}

/** A string V1 will not read as a reference although it looks like one was meant. */
export function isMalformedReference(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    value.includes('{{') &&
    getReferencedPath(value) === undefined
  )
}

/**
 * Every dependency cycle among the draft fields, each as the names along
 * it, starting and ending at the same name. References to names that are
 * not draft fields are not edges; they cannot close a cycle.
 */
export function findCycles(
  handlers: Readonly<Record<string, DraftHandler>>,
): string[][] {
  const edges = new Map(
    Object.entries(handlers).map(([name, handler]) => [
      name,
      [...new Set(referenceSites(handler).map((site) => site.base))],
    ]),
  )
  const cycles: string[][] = []
  const state = new Map<string, 'visiting' | 'done'>()
  const stack: string[] = []

  const visit = (name: string) => {
    if (state.get(name) === 'done') {
      return
    }
    if (state.get(name) === 'visiting') {
      cycles.push([...stack.slice(stack.indexOf(name)), name])
      return
    }
    state.set(name, 'visiting')
    stack.push(name)
    for (const next of edges.get(name) ?? []) {
      if (edges.has(next)) {
        visit(next)
      }
    }
    stack.pop()
    state.set(name, 'done')
  }

  for (const name of edges.keys()) {
    visit(name)
  }
  return cycles
}

function optionalSlot(
  path: string,
  position: ReferencePosition,
  value: unknown,
): ReferenceSlot[] {
  return value === undefined ? [] : [{ path, position, value }]
}
