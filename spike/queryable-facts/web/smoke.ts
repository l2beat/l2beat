// Server-side smoke test: renders every step with a real run (no browser needed).
//   pnpm exec tsx --tsconfig web/tsconfig.json web/smoke.ts /tmp/qf-run.json [/tmp/qf-proof.json]
import { readFileSync } from 'fs'
import { createElement, type ReactElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ProofTree } from './client/components/ProofTree'
import { type Ctx, type Nav, RunContext } from './client/lib/context'
import { RunIndex } from './client/lib/run'
import { Step2Compile } from './client/steps/Step2Compile'
import { Step3Facts } from './client/steps/Step3Facts'
import { Step4Concepts } from './client/steps/Step4Concepts'
import { Step5Rules } from './client/steps/Step5Rules'
import { Step6Derive } from './client/steps/Step6Derive'
import { Step7Report } from './client/steps/Step7Report'
import type { RunResult } from './shared/types'

const run = JSON.parse(
  readFileSync(process.argv[2] ?? '/tmp/qf-run.json', 'utf8'),
) as RunResult
const index = new RunIndex(run)
const firstWrite = index.concepts.get('writeSite')?.[0]
const writeNode = firstWrite ? index.nodeOfSym(firstWrite[0] ?? '') : undefined
const writeNodeId = writeNode ? index.numIdOf(writeNode) : undefined

const navs: Array<[string, Partial<Nav>]> = [
  ['plain', {}],
  [
    'node selected',
    {
      astNode: writeNode,
      range: writeNode ? index.rangeOfNode(writeNode) : undefined,
      line: 12,
      baseNodeId: writeNodeId,
    },
  ],
  ['base relation child', { baseRelation: 'child', baseLine: 16 }],
  [
    'concept stmt pinned',
    { relation: 'stmt', factRef: { relation: 'stmt', index: 0 } },
  ],
  ['filter line', { filterLine: 16 }],
  ['filter node', { filterNodeId: writeNodeId }],
  ['derived writes', { derivedRelation: 'writes' }],
  ['focus relation', { focusRelation: 'writesOwn' }],
]
const steps: Array<[string, () => ReactElement]> = [
  ['Step2Compile', () => createElement(Step2Compile)],
  ['Step3Facts', () => createElement(Step3Facts)],
  ['Step4Concepts', () => createElement(Step4Concepts)],
  ['Step5Rules', () => createElement(Step5Rules)],
  ['Step6Derive', () => createElement(Step6Derive)],
  ['Step7Report', () => createElement(Step7Report)],
]
let failures = 0
for (const [navName, patch] of navs) {
  const nav: Nav = { step: 2, nonce: 0, ...patch }
  const ctx: Ctx = {
    index,
    nav,
    setNav: () => {},
    showRange: () => {},
    showId: () => {},
  }
  for (const [name, make] of steps) {
    try {
      const html = renderToString(
        createElement(RunContext.Provider, { value: ctx }, make()),
      )
      console.log(
        `ok   ${name.padEnd(13)} ${navName.padEnd(20)} ${html.length} chars`,
      )
    } catch (e) {
      failures++
      console.log(
        `FAIL ${name} ${navName}: ${e instanceof Error ? e.stack : e}`,
      )
    }
  }
}
// Proof tree with a captured explain result, if given.
if (process.argv[3]) {
  const proof = JSON.parse(readFileSync(process.argv[3], 'utf8'))
  const ctx: Ctx = {
    index,
    nav: { step: 6, nonce: 0 },
    setNav: () => {},
    showRange: () => {},
    showId: () => {},
  }
  const html = renderToString(
    createElement(
      RunContext.Provider,
      { value: ctx },
      createElement(ProofTree, { node: proof.proof }),
    ),
  )
  console.log(
    `ok   ProofTree ${html.length} chars; matched atoms: ${(html.match(/class="rn"/g) ?? []).length}, snippets: ${(html.match(/class="snippet"/g) ?? []).length}, concept tags: ${(html.match(/tag concept/g) ?? []).length}`,
  )
}
// Index sanity
console.log(
  'layers:',
  `base ${index.baseCount}, concepts ${index.conceptCount}, derived ${index.derivedCount}`,
  '| deepestNodeAt(600):',
  index.deepestNodeAt(600)?.nodeType,
  '| shortLabel writeSite:',
  index.shortLabel(firstWrite?.[0] ?? ''),
  '| anchor of writeSite[0]:',
  writeNode?.nodeType,
  writeNodeId,
)
console.log(
  'baseRowsByLine:',
  [...index.baseRowsByLine.entries()]
    .slice(0, 6)
    .map(([l, r]) => `${l}:${r.length}`)
    .join(' '),
  '| conceptRowsByLine:',
  [...index.conceptRowsByLine.entries()]
    .slice(0, 6)
    .map(([l, r]) => `${l}:${r.length}`)
    .join(' '),
)
process.exitCode = failures > 0 ? 1 : 0
