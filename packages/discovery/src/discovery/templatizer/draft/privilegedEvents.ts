/**
 * Which code emits an event, read off the flattened source.
 *
 * Event-only state (reverted batches, verifier routes) was dropped in the
 * research benchmark because the model skipped its events as activity. An
 * event that only privileged functions or the constructor emit announces a
 * configuration change, not activity, so a skip calling it activity is
 * wrong. This is a regex heuristic, not a parser: it strips comments and
 * string literals (so braces and `emit` inside them do not count), finds
 * every function, constructor and modifier with a body by matching braces,
 * and asks which one each `emit <Event>(` sits in. It errs towards "not
 * privileged": an emit in an internal helper, a modifier or a function
 * guarded by an inline `require` is not flagged.
 *
 * Not every `only*` modifier guards an authority. Run over the benchmark
 * suite, `onlyCallByCounterpart`, `onlyInDropContext`, `onlyOtherBridge`
 * and `onlyAllowed` guard user withdrawals, refunds and deposits relayed by
 * a messenger or allow-list. So emitters are graded: `authority` when at
 * least one emitter is the constructor or is guarded by a modifier naming
 * an owner, admin, role or governance body, `guarded` when every guard
 * names something else. ScrollChain's `RevertBatch` is `authority`:
 * `revertBatch` is `onlyOwner`, the other emitter `OnlyTopLevelCall`.
 */
import type { FlatSource } from '../facts'

export type Privilege = 'authority' | 'guarded'

export interface Emitters {
  privilege: Privilege
  /** `revertBatch (onlyOwner)`, `constructor`, in source order, deduplicated. */
  emitters: string[]
}

export interface EmitSite {
  /** Name of the source bundle the emit is in. */
  source: string
  /** Undefined when the emit sits outside any body the scan recognises. */
  callable?: Callable
}

export interface Callable {
  kind: CallableKind
  /** The declared name; the keyword for `constructor`, `fallback` and `receive`. */
  name: string
  /** Header text after the parameter list, `returns (…)` removed. */
  attributes: string
  bodyStart: number
  bodyEnd: number
}

export type CallableKind =
  | 'function'
  | 'constructor'
  | 'modifier'
  | 'fallback'
  | 'receive'

const PRIVILEGE_MODIFIER = /\b[Oo]nly[A-Z]\w*/
const AUTHORITY =
  /Owner|Admin|Role|Gov|Guardian|Council|Manager|Revoker|Pauser|Upgrader|Timelock|Multisig|Committee|Emergency|Security/

/**
 * The emitters of an event when every emit sits in the constructor or in a
 * function carrying an `only*`/`Only*` modifier; undefined when one does not, or
 * when the source never emits the event (then nothing can be concluded).
 */
export function privilegedEmitters(
  sources: readonly FlatSource[],
  eventName: string,
): Emitters | undefined {
  const sites = findEmitSites(sources, eventName)
  if (sites.length === 0 || !sites.every(isPrivilegedSite)) {
    return undefined
  }
  return {
    privilege: sites.some(isAuthoritySite) ? 'authority' : 'guarded',
    emitters: [...new Set(sites.map(describeEmitter))],
  }
}

export function emittedOnlyByPrivilegedCode(
  sources: readonly FlatSource[],
  eventName: string,
): boolean {
  return privilegedEmitters(sources, eventName) !== undefined
}

export function findEmitSites(
  sources: readonly FlatSource[],
  eventName: string,
): EmitSite[] {
  const emit = emitPattern(eventName)
  const sites: EmitSite[] = []
  for (const source of sources) {
    const code = stripCommentsAndStrings(source.flattened)
    const callables = findCallables(code)
    for (const match of code.matchAll(emit)) {
      const offset = match.index ?? 0
      sites.push({
        source: source.name,
        callable: callables.find(
          (callable) =>
            callable.bodyStart < offset && offset < callable.bodyEnd,
        ),
      })
    }
  }
  return sites
}

export function isPrivilegedSite(site: EmitSite): boolean {
  const callable = site.callable
  if (callable === undefined) {
    return false
  }
  if (callable.kind === 'constructor') {
    return true
  }
  return (
    callable.kind === 'function' && PRIVILEGE_MODIFIER.test(callable.attributes)
  )
}

function isAuthoritySite(site: EmitSite): boolean {
  const callable = site.callable as Callable
  return (
    callable.kind === 'constructor' ||
    privilegeModifiers(callable).some((modifier) => AUTHORITY.test(modifier))
  )
}

function describeEmitter(site: EmitSite): string {
  const callable = site.callable as Callable
  if (callable.kind === 'constructor') {
    return 'constructor'
  }
  return `${callable.name} (${privilegeModifiers(callable).join(', ')})`
}

function privilegeModifiers(callable: Callable): string[] {
  const all = new RegExp(PRIVILEGE_MODIFIER.source, 'g')
  return [...callable.attributes.matchAll(all)].map((match) => match[0])
}

/** `emit Name(` and the qualified `emit Interface.Name(`, never `emit NameSuffix(`. */
function emitPattern(eventName: string): RegExp {
  const name = eventName.replace(/\$/g, '\\$')
  return new RegExp(
    `\\bemit\\s+(?:[A-Za-z_$][\\w$]*\\s*\\.\\s*)*${name}\\s*\\(`,
    'g',
  )
}

/**
 * Comments and string literals replaced by spaces, newlines kept, so every
 * offset still points at the same place in the original text.
 */
export function stripCommentsAndStrings(source: string): string {
  const out = source.split('')
  let i = 0
  const blank = (from: number, to: number) => {
    for (let j = from; j < to; j++) {
      if (out[j] !== '\n') {
        out[j] = ' '
      }
    }
  }
  while (i < source.length) {
    const char = source[i]
    const next = source[i + 1]
    if (char === '/' && next === '/') {
      const end = source.indexOf('\n', i)
      const stop = end === -1 ? source.length : end
      blank(i, stop)
      i = stop
    } else if (char === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2)
      const stop = end === -1 ? source.length : end + 2
      blank(i, stop)
      i = stop
    } else if (char === '"' || char === "'") {
      const stop = stringEnd(source, i)
      blank(i, stop)
      i = stop
    } else {
      i++
    }
  }
  return out.join('')
}

function stringEnd(source: string, start: number): number {
  const quote = source[start]
  let i = start + 1
  while (i < source.length && source[i] !== quote && source[i] !== '\n') {
    i += source[i] === '\\' ? 2 : 1
  }
  return Math.min(i + 1, source.length)
}

const CALLABLE_KEYWORD = /\b(function|constructor|modifier|fallback|receive)\b/g

/** Every callable with a body; declarations without one (interfaces, function types) are skipped. */
export function findCallables(code: string): Callable[] {
  const callables: Callable[] = []
  for (const match of code.matchAll(CALLABLE_KEYWORD)) {
    const kind = match[1] as CallableKind
    const callable = readCallable(code, kind, (match.index ?? 0) + kind.length)
    if (callable !== undefined) {
      callables.push(callable)
    }
  }
  return callables
}

function readCallable(
  code: string,
  kind: CallableKind,
  afterKeyword: number,
): Callable | undefined {
  let i = skipSpace(code, afterKeyword)
  let name: string = kind
  if (kind === 'function' || kind === 'modifier') {
    const identifier = /^[A-Za-z_$][\w$]*/.exec(code.slice(i, i + 200))
    if (identifier === null) {
      return undefined
    }
    name = identifier[0]
    i = skipSpace(code, i + name.length)
  }
  if (code[i] === '(') {
    const close = matchingClose(code, i, '(', ')')
    if (close === undefined) {
      return undefined
    }
    i = close + 1
  } else if (kind !== 'modifier') {
    return undefined
  }
  const bodyStart = headerEnd(code, i)
  if (bodyStart === undefined) {
    return undefined
  }
  const bodyEnd = matchingClose(code, bodyStart, '{', '}')
  if (bodyEnd === undefined) {
    return undefined
  }
  const attributes = withoutReturns(code.slice(i, bodyStart))
  return { kind, name, attributes, bodyStart, bodyEnd }
}

/**
 * The `{` opening the body, skipping balanced parentheses of modifier
 * arguments and `returns (…)`. A `;` means a declaration without a body; a
 * `,`, `)` or `=` means the keyword was a function type inside a parameter
 * list or a variable declaration.
 */
function headerEnd(code: string, from: number): number | undefined {
  let i = from
  while (i < code.length) {
    const char = code[i]
    if (char === '{') {
      return i
    }
    if (char === ';' || char === ',' || char === ')' || char === '=') {
      return undefined
    }
    if (char === '(') {
      const close = matchingClose(code, i, '(', ')')
      if (close === undefined) {
        return undefined
      }
      i = close + 1
      continue
    }
    i++
  }
  return undefined
}

function withoutReturns(header: string): string {
  const start = header.search(/\breturns\s*\(/)
  if (start === -1) {
    return header
  }
  const open = header.indexOf('(', start)
  const close = matchingClose(header, open, '(', ')') ?? header.length - 1
  return header.slice(0, start) + header.slice(close + 1)
}

function matchingClose(
  code: string,
  openAt: number,
  open: string,
  close: string,
): number | undefined {
  let depth = 0
  for (let i = openAt; i < code.length; i++) {
    if (code[i] === open) {
      depth++
    } else if (code[i] === close) {
      depth--
      if (depth === 0) {
        return i
      }
    }
  }
  return undefined
}

function skipSpace(code: string, from: number): number {
  let i = from
  while (i < code.length && /\s/.test(code[i] as string)) {
    i++
  }
  return i
}
