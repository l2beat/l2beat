/**
 * The parts of the discovery README the model needs when an existing
 * template uses what the condensed handler reference does not cover: a
 * handler type outside the seven a draft may use, or an `edit` operator
 * other than `format` and `get`.
 *
 * The model has no tools, so it cannot look these up; and it must not
 * guess what an existing field does when deciding what the template still
 * misses. The README is read at run time from the package, so the prompt
 * and the researchers' documentation never drift apart. A handler type the
 * README does not document gets one line naming its keys, taken from V1's
 * own schema.
 */
import { toJsonSchema } from '@l2beat/validate'
import fs from 'fs'
import path from 'path'
import { UserHandlers } from '../../handlers/user'
import { DOCUMENTED_HANDLER_TYPES } from './draftJsonSchema'

/** Same depth below the package root from `src/…` and from `dist/…`. */
export const README_PATH = path.resolve(__dirname, '../../../../README.md')

/** The `edit` operators the condensed reference already explains. */
const DOCUMENTED_OPERATORS: ReadonlySet<string> = new Set(['format', 'get'])

export interface ReadmeIndex {
  /** Handler type → the `### … handler` section that documents it, verbatim. */
  handlers: Map<string, string>
  /** `edit` operator → its section under `## Edit`, verbatim. */
  operators: Map<string, string>
}

let loaded: ReadmeIndex | undefined

/** The package README, parsed once; empty when the file is not where the package keeps it. */
export function readmeIndex(): ReadmeIndex {
  if (loaded === undefined) {
    loaded = fs.existsSync(README_PATH)
      ? parseReadme(fs.readFileSync(README_PATH, 'utf8'))
      : { handlers: new Map(), operators: new Map() }
  }
  return loaded
}

interface Section {
  level: number
  title: string
  start: number
  /** Exclusive line index where the section's text ends. */
  end: number
}

export function parseReadme(text: string): ReadmeIndex {
  const lines = text.split('\n')
  const sections = headings(lines)
  const handlers = new Map<string, string>()
  const operators = new Map<string, string>()
  for (const [i, section] of sections.entries()) {
    if (section.level === 3 && section.title.endsWith(' handler')) {
      const body = textOf(lines, section, nextOfLevelAtMost(sections, i, 3))
      const type = /"type":\s*"([A-Za-z0-9]+)"/.exec(body)?.[1]
      if (type !== undefined && !handlers.has(type)) {
        handlers.set(type, body)
      }
    }
    const operator = /^`([^`]+)`$/.exec(section.title)?.[1]
    if (operator !== undefined && underEdit(sections, i)) {
      operators.set(operator, textOf(lines, section, sections[i + 1]))
    }
  }
  return { handlers, operators }
}

function headings(lines: string[]): Section[] {
  const sections: Section[] = []
  let inCode = false
  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      inCode = !inCode
      return
    }
    const match = inCode ? null : /^(#{2,4}) (.+)$/.exec(line)
    if (match !== null) {
      sections.push({
        level: (match[1] as string).length,
        title: (match[2] as string).trim(),
        start: i,
        end: lines.length,
      })
    }
  })
  return sections
}

/** A handler section keeps its `####` subsections; it ends at the next `##` or `###`. */
function nextOfLevelAtMost(
  sections: Section[],
  index: number,
  level: number,
): Section | undefined {
  return sections.slice(index + 1).find((section) => section.level <= level)
}

function underEdit(sections: Section[], index: number): boolean {
  const parent = [...sections.slice(0, index)]
    .reverse()
    .find((section) => section.level === 2)
  return parent?.title === 'Edit'
}

function textOf(lines: string[], section: Section, next?: Section): string {
  return lines
    .slice(section.start, next?.start ?? lines.length)
    .join('\n')
    .trimEnd()
}

/**
 * The reference lines for the handler types and edit operators the
 * existing fields use beyond the condensed reference; nothing when they
 * use nothing beyond it, so a prompt for a template of generic fields is
 * unchanged.
 */
export function readmeReferenceFor(
  handlerTypes: Iterable<string>,
  editOperators: Iterable<string>,
  readme: ReadmeIndex = readmeIndex(),
): string[] {
  const types = [...new Set(handlerTypes)].filter(
    (type) => !(DOCUMENTED_HANDLER_TYPES as readonly string[]).includes(type),
  )
  const operators = [...new Set(editOperators)].filter(
    (operator) => !DOCUMENTED_OPERATORS.has(operator),
  )
  return [
    ...types.map(
      (type) => readme.handlers.get(type) ?? undocumentedHandler(type),
    ),
    ...operators.map(
      (operator) =>
        readme.operators.get(operator) ??
        `\`${operator}\`: an edit operator the README does not document.`,
    ),
  ]
}

/** One line from V1's own schema, so the model at least knows the field's keys. */
function undocumentedHandler(type: string): string {
  const schema = (UserHandlers as Record<string, unknown>)[type]
  if (schema === undefined) {
    return `\`${type}\`: not a handler type V1 has.`
  }
  const json = toJsonSchema(schema as Parameters<typeof toJsonSchema>[0]) as {
    properties?: Record<string, unknown>
  }
  const keys = Object.keys(json.properties ?? {}).join(', ')
  return `\`${type}\` handler: the README does not document it; its definition keys are: ${keys}.`
}

/**
 * Every operator a blip program applies: the first element of each nested
 * program. Not every array is one: `set` takes a path first and `shape`
 * takes `[key, program]` pairs, as `validateBlip` reads them.
 */
export function editOperatorsOf(edit: unknown): string[] {
  if (!Array.isArray(edit) || typeof edit[0] !== 'string') {
    return []
  }
  const [operator, ...args] = edit as [string, ...unknown[]]
  const programs =
    operator === 'set'
      ? args.slice(1)
      : operator === 'shape'
        ? args.map((arg) => (Array.isArray(arg) ? arg[1] : undefined))
        : args
  return [operator, ...programs.flatMap(editOperatorsOf)]
}
