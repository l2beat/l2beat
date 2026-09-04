// Server-side smoke test: renders every step with a real run (no browser needed).
//   pnpm exec tsx --tsconfig web/tsconfig.json web/smoke.ts /tmp/qf-run.json
import { readFileSync } from 'fs'
import { createElement, type ReactElement } from 'react'
import { renderToString } from 'react-dom/server'
import { ProofTree } from './client/components/ProofTree'
import { type Ctx, type Nav, RunContext } from './client/lib/context'
import { RunIndex } from './client/lib/run'
import { Step2Compile } from './client/steps/Step2Compile'
import { Step3Facts } from './client/steps/Step3Facts'
import { Step4Rules } from './client/steps/Step4Rules'
import { Step5Derive } from './client/steps/Step5Derive'
import { Step6Report } from './client/steps/Step6Report'
import type { RunResult } from './shared/types'

const run = JSON.parse(
  readFileSync(process.argv[2] ?? '/tmp/qf-run.json', 'utf8'),
) as RunResult
const index = new RunIndex(run)
const fnNode = index.nodesById.get(
  run.facts.find((f) => f.relation === 'writeSite')?.rows[0]?.origin?.id ?? -1,
)

const navs: Array<[string, Partial<Nav>]> = [
  ['plain', {}],
  [
    'node selected',
    {
      astNode: fnNode,
      range: fnNode ? index.rangeOfNode(fnNode) : undefined,
      line: 12,
    },
  ],
  [
    'relation stmt',
    { relation: 'stmt', factRef: { relation: 'stmt', index: 0 } },
  ],
  ['filter line', { filterLine: 16 }],
  ['filter node', { filterNodeId: fnNode?.id }],
  ['derived writes', { derivedRelation: 'writes' }],
  ['focus relation', { focusRelation: 'writesOwn' }],
]
const steps: Array<[string, () => ReactElement]> = [
  ['Step2Compile', () => createElement(Step2Compile)],
  ['Step3Facts', () => createElement(Step3Facts)],
  ['Step4Rules', () => createElement(Step4Rules)],
  ['Step5Derive', () => createElement(Step5Derive)],
  ['Step6Report', () => createElement(Step6Report)],
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
        `ok   ${name.padEnd(12)} ${navName.padEnd(16)} ${html.length} chars`,
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
    nav: { step: 5, nonce: 0 },
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
    `ok   ProofTree ${html.length} chars; matched atoms: ${(html.match(/class="rn"/g) ?? []).length}, snippets: ${(html.match(/class="snippet"/g) ?? []).length}`,
  )
}
// Index sanity
console.log(
  'deepestNodeAt(600):',
  index.deepestNodeAt(600)?.nodeType,
  '| shortLabel writeSite:',
  index.shortLabel(
    run.facts.find((f) => f.relation === 'writeSite')?.rows[1]?.cols[0] ?? '',
  ),
)
console.log(
  'rowsByLine sizes:',
  [...index.rowsByLine.entries()]
    .slice(0, 8)
    .map(([l, r]) => `${l}:${r.length}`)
    .join(' '),
)
process.exitCode = failures > 0 ? 1 : 0
