// Synthetic examples: one Solidity file each, small enough to follow every tuple by hand. The
// comment block at the top of the file (before `pragma`) is the example's description.

import { existsSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { EXAMPLES_DIR } from './paths'

export interface Example {
  id: string
  file: string
  description: string
  lines: number
}

export function exampleId(id: string): string {
  if (!/^[\w.-]+$/.test(id)) throw new Error(`bad example id ${id}`)
  return id
}

export function exampleSource(id: string): string {
  const path = join(EXAMPLES_DIR, `${exampleId(id)}.sol`)
  if (!existsSync(path)) throw new Error(`no example ${id} (${path})`)
  return readFileSync(path, 'utf8')
}

export function listExamples(): Example[] {
  if (!existsSync(EXAMPLES_DIR)) return []
  return readdirSync(EXAMPLES_DIR)
    .filter((f) => f.endsWith('.sol'))
    .sort()
    .map((file) => {
      const source = readFileSync(join(EXAMPLES_DIR, file), 'utf8')
      const description = source
        .split('\n')
        .filter((l) => !/^\/\/ SPDX/.test(l))
        .reduce<{ done: boolean; out: string[] }>(
          (acc, line) => {
            if (acc.done) return acc
            if (line.startsWith('//')) acc.out.push(line.replace(/^\/\/ ?/, ''))
            else if (acc.out.length > 0) acc.done = true
            return acc
          },
          { done: false, out: [] },
        )
        .out.join('\n')
        .trim()
      return {
        id: file.replace(/\.sol$/, ''),
        file,
        description,
        lines: source.split('\n').length,
      }
    })
}
