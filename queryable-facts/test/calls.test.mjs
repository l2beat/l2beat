import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { root, runPipeline } from '../src/pipeline.mjs'
import { inspect, makeBriefing } from '../src/briefing.mjs'

async function run(t, source, followCalls = true) {
  const outputRoot = await mkdtemp(join(tmpdir(), 'astra-calls-'))
  t.after(() => rm(outputRoot, { recursive: true, force: true }))
  return runPipeline(source, { outputRoot, followCalls })
}
const contract = (body) => `pragma solidity 0.8.34; contract Example { ${body} }`
const named = (r, relation) => {
  const fn = new Map(r.facts.functionDefinition), v = new Map(r.facts.stateVariable)
  return r.derived[relation].map(([f, variable]) => `${fn.get(f)}:${v.get(variable)}`).sort()
}

test('guarded chain exposes only the entry point, retains every helper, and toggle preserves direct facts', async (t) => {
  const source = await readFile(join(root, 'examples/05-internal-chain.sol'), 'utf8')
  const off = await run(t, source, false)
  const on = await run(t, source)
  assert.deepEqual(on.facts, off.facts)
  assert.deepEqual(on.tuples, off.tuples)
  assert.deepEqual(off.derived, {})
  assert.deepEqual(named(on, 'entryWrite'), ['updateScore:score'])
  assert.deepEqual(named(on, 'potentialWrite'), ['checkAndSetScore:score', 'constructor:owner', 'setScore:score', 'updateScore:score'])
  const names = new Map(on.facts.functionDefinition)
  assert.deepEqual(on.derived.calls.map(([f,g]) => `${names.get(f)}>${names.get(g)}`).sort(), ['checkAndSetScore>setScore', 'updateScore>checkAndSetScore'])
  const briefing = makeBriefing(on, 'Who can change score?')
  const target = String(on.facts.stateVariable.find(([,n]) => n === 'score')[0])
  const step = inspect(on, briefing.symbols, { tool: 'entrypoints', target, why: 'Locate entry points and their helpers.' })
  assert.equal(step.evidence.length, 1)
  assert.equal(step.evidence[0].functionIds.length, 3)
  const sources = step.evidence[0].functionIds.map((id) => inspect(on, briefing.symbols, { tool: 'source', target: id, why: 'Read the path.' }).evidence[0].source)
  assert.ok(sources.some((s) => s.includes('require(msg.sender == owner')))
  assert.ok(!briefing.prompt.includes('require(msg.sender == owner'))
  assert.throws(() => inspect(off, briefing.symbols, { tool:'entrypoints', target, why:'Read.' }), /Enable lesson 03/)
  assert.equal((await readFile(join(on.runDir, 'derived/entryWrite.csv'), 'utf8')).trim(), on.derived.entryWrite[0].join('\t'))
})

test('recursion terminates, shared paths and multiple entries remain; dead helpers and constructors are not entries', async (t) => {
  const r = await run(t, contract(`
    uint256 score; uint256 hidden;
    constructor() { hidden = 1; }
    function first(uint256 n) external { a(n); }
    function second(uint256 n) public { b(n); }
    function a(uint256 n) internal { if (n > 0) b(n - 1); }
    function b(uint256 n) private { if (n > 0) a(n - 1); score = n; }
    function dead() internal { hidden = 2; }
  `))
  assert.deepEqual(named(r, 'entryWrite'), ['first:score', 'second:score'])
  assert.ok(named(r, 'potentialWrite').includes('dead:hidden'))
  assert.equal(r.derived.writePathEdge.length, 6)
})

test('overloads resolve by declaration; unreachable calls remain potential and external/member calls are not followed', async (t) => {
  const r = await run(t, contract(`
    uint256 score; uint256 other;
    function route() external { revert(); write(uint256(1)); }
    function write(uint256 n) internal { score = n; }
    function write(address a) internal { other = uint160(a); }
    function outside() external { this.route(); }
  `))
  assert.deepEqual(named(r, 'entryWrite'), ['route:score'])
  assert.equal(r.derived.calls.length, 1)
  assert.ok(r.scope.some((s) => s.includes('Missing') || s.includes('No path found')))
})

test('virtual calls and function pointers are not silently treated as resolved calls; fallback and receive count', async (t) => {
  const r = await run(t, contract(`
    uint256 score;
    function v() internal virtual { score = 1; }
    function viaVirtual() external { v(); }
    function viaPointer() external { function() internal ptr = v; ptr(); }
    fallback() external { score = 2; }
    receive() external payable { score = 3; }
  `))
  assert.deepEqual(r.derived.calls, [])
  assert.deepEqual(named(r, 'entryWrite'), ['fallback:score', 'receive:score'])
  assert.ok(r.scope.some((s) => s.includes('virtual dispatch')))
})
