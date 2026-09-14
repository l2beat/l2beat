import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { root, runPipeline } from '../src/pipeline.mjs'

async function run(t, source) {
  const outputRoot = await mkdtemp(join(tmpdir(), 'astra-test-'))
  t.after(() => rm(outputRoot, { recursive: true, force: true }))
  return runPipeline(source, { outputRoot })
}
function pairs(result) {
  return result.findings.map((finding) => `${finding.function} → ${finding.variable}`).sort()
}
const contract = (body) => `// SPDX-License-Identifier: MIT\npragma solidity 0.8.34;\ncontract Example { ${body} }`

test('setter matches, reader does not, and saved results are actual Soufflé tuples', async (t) => {
  const result = await run(t, await readFile(join(root, 'examples/01-direct.sol'), 'utf8'))
  assert.deepEqual(pairs(result), ['setScore → score'])
  assert.equal(result.findings[0].assignment, 'score = next')
  const csv = await readFile(join(result.runDir, 'derived/directWrite.csv'), 'utf8')
  assert.equal(csv.trim(), result.tuples[0].join('\t'))
  const saved = JSON.parse(await readFile(join(result.runDir, 'result.json'), 'utf8'))
  assert.deepEqual(saved.tuples, result.tuples)
})

test('unreachable assignment is still a syntactic write site', async (t) => {
  const result = await run(t, await readFile(join(root, 'examples/02-unreachable.sol'), 'utf8'))
  assert.deepEqual(pairs(result), ['setScore → score'])
  assert.ok(result.warnings.some((warning) => warning.includes('Unreachable code')))
})

test('renaming, local shadowing, guards, and internal callers remain distinct', async (t) => {
  const result = await run(t, contract(`
    uint256 public amount;
    function change(uint256 next) internal { require(next > 0); amount = next; }
    function forward(uint256 next) external { change(next); }
    function localOnly() external pure returns (uint256) { uint256 amount; amount = 7; return amount; }
    function adjust() external { amount += 1; }
  `))
  assert.deepEqual(pairs(result), ['adjust → amount', 'change → amount'])
})

test('external authorization does not turn a write-site tuple into an access verdict', async (t) => {
  const source = `// SPDX-License-Identifier: MIT
    pragma solidity 0.8.34;
    interface IGate { function authorize(address who) external; }
    contract Example {
      IGate public gate;
      uint256 public score;
      function setScore(uint256 next) external { gate.authorize(msg.sender); score = next; }
    }`
  const result = await run(t, source)
  assert.deepEqual(pairs(result), ['setScore → score'])
  assert.ok(result.scope.some((item) => item.includes('No permissions')))
  assert.equal(result.findings[0].assignment, 'score = next')
})

test('unsupported writes are not presented as a no-write proof', async (t) => {
  const result = await run(t, contract(`
    uint256 public score;
    uint256[] values;
    function increment() external { score++; }
    function clear() external { delete score; }
    function writeIndex() external { values[0] = 1; }
    function raw() external { assembly { sstore(0, 1) } }
  `))
  assert.deepEqual(result.tuples, [])
  assert.ok(result.scope.some((item) => item.includes('absent tuple is not a general proof')))
  assert.ok(result.scope.some((item) => item.includes('assembly')))
})

test('UTF-8 offsets produce the correct excerpt and line', async (t) => {
  const source = contract('// A non-ASCII comment: café ☕\nuint256 score;\nfunction set(uint256 n) external { score = n; }')
  const result = await run(t, source)
  assert.equal(result.findings[0].assignment, 'score = n')
  assert.equal(result.findings[0].line, 5)
})

test('compiler error aborts analysis instead of returning empty findings', async (t) => {
  await assert.rejects(() => run(t, 'pragma solidity 0.8.34; contract Broken {'), /ParserError/)
})
