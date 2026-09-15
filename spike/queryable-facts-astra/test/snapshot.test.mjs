import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { root, runPipeline } from '../src/pipeline.mjs'
import { inspect, makeBriefing, checkAnswer } from '../src/briefing.mjs'
const source = Object.fromEntries(await Promise.all(['Playground', 'OwnerGate'].map(async (name) => [`.flat/${name}.sol`, await readFile(join(root, `examples/playground/.flat/${name}.sol`), 'utf8')])))
const snapshot = JSON.parse(await readFile(join(root, 'examples/playground/discovered.json'), 'utf8'))
async function run(t, snapshot, text = source) {
  const outputRoot = await mkdtemp(join(tmpdir(), 'astra-snapshot-'))
  t.after(() => rm(outputRoot, { recursive: true, force: true }))
  return runPipeline(text, { outputRoot, connectContracts: true, followCalls: true, snapshot })
}

test('external dependency exists without values; snapshot resolves source and supports retrieved evidence', async (t) => {
  const before = await run(t, null)
  const after = await run(t, snapshot)
  assert.equal(before.derived.externalDependency.length, 1)
  assert.deepEqual(before.derived.resolvedCall, [])
  assert.deepEqual(before.derived.externalDependency, after.derived.externalDependency)
  assert.deepEqual(before.tuples, after.tuples)
  assert.equal(after.derived.resolvedCall.length, 1)
  const [from, call, to, fn] = after.derived.resolvedCall[0]
  assert.equal(from, snapshot.entries[0].address)
  assert.equal(to, snapshot.entries[1].address)
  assert.ok(after.locations[call].source.includes('gate.authorize(msg.sender)'))
  assert.ok(after.locations[fn].source.includes('require(caller == owner'))
  const briefing = makeBriefing(after, 'Who can change score?')
  assert.ok(!briefing.prompt.includes('require(caller == owner'))
  assert.ok(!briefing.prompt.includes(snapshot.entries[1].address))
  const ask = (tool, target) => inspect(after, briefing.symbols, { tool, target: String(target), why: 'Inspect relevant dependency.' })
  const dep = ask('dependencies', after.derived.externalDependency[0][0])
  assert.equal(dep.evidence[0].targets[0].functionId, String(fn))
  const body = ask('source', fn)
  const owner = after.facts.stateVariable.find(([, name]) => name === 'owner')[0]
  const value = ask('values', owner)
  assert.equal(value.evidence[0].tuple[3], snapshot.entries[1].values.owner)
  const checked = checkAnswer({ claims: [{ text: 'The snapshot identifies the owner.', evidence: [{ reference: value.evidence[0].id, explanation: 'This is the recorded owner address.', lines: [] }] }], unknowns: [] }, [dep, body, value])
  assert.equal(checked.claims[0].evidence[0].issue, null)
  assert.equal((await readFile(join(after.runDir, 'derived/resolvedCall.csv'), 'utf8')).trim(), after.derived.resolvedCall[0].join('\t'))
  assert.deepEqual(JSON.parse(await readFile(join(after.runDir, 'discovered.json'), 'utf8')), snapshot)
})

test('multiple deployments remain distinct; missing targets and mismatched selectors do not resolve', async (t) => {
  const multiple = structuredClone(snapshot)
  multiple.entries.push({ ...multiple.entries[0], address: '0x4444444444444444444444444444444444444444', values: { gate: '0x5555555555555555555555555555555555555555' } })
  let result = await run(t, multiple)
  assert.equal(result.derived.resolvedCall.length, 1)
  assert.equal(result.facts.snapshotValue.length, 4)
  result = await run(t, { ...snapshot, entries: snapshot.entries.slice(0, 1) })
  assert.deepEqual(result.derived.resolvedCall, [])
  const wrong = structuredClone(snapshot)
  wrong.entries[1].name = 'DifferentGate'
  wrong.entries[1].values = {}
  result = await run(t, wrong, { ...source, '.flat/DifferentGate.sol': 'pragma solidity 0.8.34; contract DifferentGate { function authorize(uint256) external {} }' })
  assert.deepEqual(result.derived.resolvedCall, [])
})

test('snapshot rejects malformed values, duplicate deployments, nonexistent fields and inherited dispatch', async (t) => {
  const bad = structuredClone(snapshot)
  bad.entries[0].values.gate = 'not-an-address'
  await assert.rejects(run(t, bad), /20-byte/)
  const duplicate = structuredClone(snapshot)
  duplicate.entries.push(duplicate.entries[0])
  await assert.rejects(run(t, duplicate), /Duplicate/)
  const missing = structuredClone(snapshot)
  missing.entries[0].values = { unknown: snapshot.entries[1].address }
  await assert.rejects(run(t, missing), /declared variable/)
  const inherited = structuredClone(snapshot)
  inherited.entries[1].name = 'InheritedGate'
  inherited.entries[1].values = {}
  await assert.rejects(run(t, inherited, { ...source, '.flat/InheritedGate.sol': 'pragma solidity 0.8.34; import "./OwnerGate.sol"; contract InheritedGate is OwnerGate { constructor() OwnerGate(address(1)) {} }' }), /implementation inheritance/)
})


test('source retrieval and line evidence retain file identity; ambiguous ranges are rejected', async (t) => {
  const result = await run(t, snapshot)
  const { symbols, prompt } = makeBriefing(result, 'What is score and who can change it?')
  const fn = symbols.find((s) => s.label === 'OwnerGate.authorize(address)')
  assert.equal(fn.file, '.flat/OwnerGate.sol')
  const body = inspect(result, symbols, { tool: 'source', target: fn.id, why: 'Read authorization.' }).evidence[0]
  assert.equal(body.file, '.flat/OwnerGate.sol')
  assert.match(body.source, /require\(caller == owner/)
  assert.ok(!body.source.includes('score = next'))
  const line = inspect(result, symbols, { tool: 'lines', target: '.flat/OwnerGate.sol:9-11', why: 'Read exact lines.' }).evidence[0]
  assert.equal(line.file, '.flat/OwnerGate.sol')
  assert.match(line.source, /require/)
  assert.throws(() => inspect(result, symbols, { tool: 'lines', target: '9-11', why: 'Read.' }), /exact file path/)
  assert.match(prompt, /\.flat\/OwnerGate.sol/)
  assert.ok(!prompt.includes('require(caller == owner'))
  assert.equal(await readFile(join(result.runDir, 'sources/.flat/OwnerGate.sol'), 'utf8'), source['.flat/OwnerGate.sol'])
  const score = symbols.find((s) => s.label === 'Playground.score')
  const values = inspect(result, symbols, { tool: 'values', target: score.id, why: 'Read current score.' })
  assert.deepEqual(values.evidence[0].tuple.slice(2), ['uint256', '42'])
})

test('generic values preserve integers, booleans and JSON; non-address values cannot create call connections', async (t) => {
  const text = { ...source, '.flat/Playground.sol': source['.flat/Playground.sol'].replace('uint256 public score;', 'uint256 public score; bool public enabled; string public note; uint256[] public items;') }
  const data = structuredClone(snapshot)
  data.entries[0].values = { ...data.entries[0].values, score: (2n ** 256n - 1n).toString(), enabled: false, note: 'line 1\nline 2', items: [1, 2] }
  const result = await run(t, data, text)
  const values = new Map(result.facts.snapshotValue.map(([, v, type, value]) => [new Map(result.facts.stateVariable).get(v), [type, value]]))
  assert.deepEqual(values.get('score'), ['uint256', (2n ** 256n - 1n).toString()])
  assert.deepEqual(values.get('enabled'), ['bool', 'false'])
  assert.deepEqual(values.get('note'), ['string', JSON.stringify('line 1\nline 2')])
  assert.deepEqual(values.get('items'), ['uint256[]', '[1,2]'])
  assert.equal(result.derived.resolvedCall.length, 1)
  data.entries[0].values.score = 9007199254740992
  await assert.rejects(run(t, data, text), /safe precision/)
  data.entries[0].values.score = '-1'
  await assert.rejects(run(t, data, text), /uint256 range/)
})

test('discovery source names and chain prefixes remain explicit rather than guessed', async (t) => {
  const otherChain = structuredClone(snapshot)
  otherChain.entries[0].values.gate = 'arb:0x2222222222222222222222222222222222222222'
  assert.deepEqual((await run(t, otherChain)).derived.resolvedCall, [])
  const unprefixed = structuredClone(snapshot)
  unprefixed.entries[0].values.gate = '0x2222222222222222222222222222222222222222'
  assert.equal((await run(t, unprefixed)).derived.resolvedCall.length, 1)
  await assert.rejects(run(t, snapshot, { ...source, '.flat/OwnerGate.sol': 'pragma solidity 0.8.34; contract WrongName {}' }), /Expected one concrete OwnerGate/)
})
