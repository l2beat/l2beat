// The ladder: one rule file per level, rules/<n>-<name>.dl. Enabling level n means running the
// files 0..n as one program. Each file opens with a banner that names the level, states the
// question it answers and what it may claim; that text is the presentation.

import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { RULES_DIR } from './paths'
import { type Program, parseProgram, withMarker } from './program'

export interface Level {
  n: number
  /** File name, e.g. `2-writes.dl`. */
  file: string
  /** From the banner: "Level 2: direct writes" → "direct writes". */
  title: string
  /** From the banner: the line starting with "Question:". */
  question: string
  /** The rest of the banner, paragraphs separated by blank lines. */
  intro: string
  text: string
}

const BANNER = /^\/\/ [-=]{5,}\s*$/

function parseBanner(text: string): {
  title: string
  question: string
  intro: string
} {
  const lines = text.split('\n')
  const start = lines.findIndex((l) => BANNER.test(l.trim()))
  if (start < 0) return { title: '', question: '', intro: '' }
  const body: string[] = []
  for (let i = start + 1; i < lines.length; i++) {
    const line = (lines[i] ?? '').trim()
    if (BANNER.test(line)) break
    body.push(line.replace(/^\/\/ ?/, ''))
  }
  const [first = '', ...rest] = body
  const title = first.replace(/^Level \d+:\s*/, '').trim()
  let question = ''
  const intro: string[] = []
  for (const line of rest) {
    const q = /^Question:\s*(.*)$/.exec(line)
    if (q && !question) question = q[1] ?? ''
    else intro.push(line)
  }
  return { title, question, intro: intro.join('\n').trim() }
}

export function listLevels(): Level[] {
  if (!existsSync(RULES_DIR)) return []
  return readdirSync(RULES_DIR)
    .map((file) => ({ file, m: /^(\d+)-[\w-]+\.dl$/.exec(file) }))
    .filter((x) => x.m)
    .map(({ file, m }) => {
      const text = readFileSync(join(RULES_DIR, file), 'utf8')
      return { n: Number(m?.[1]), file, text, ...parseBanner(text) }
    })
    .sort((a, b) => a.n - b.n)
}

export function maxLevel(): number {
  const all = listLevels()
  return all.length > 0 ? (all[all.length - 1]?.n ?? 0) : 0
}

/** The program for level n: files 0..n concatenated, each behind a `// ----- <file> -----` marker. */
export function programText(level: number): string {
  return listLevels()
    .filter((l) => l.n <= level)
    .map((l) => withMarker(l.file, l.text))
    .join('\n\n')
}

export function programFor(level: number): Program {
  return parseProgram(programText(level))
}

/** Value of a `// strength: <word>` line in a relation's comment, if any. */
export function strengthOf(comment: string): string | undefined {
  return /^strength:\s*(\S+)/m.exec(comment)?.[1]
}
