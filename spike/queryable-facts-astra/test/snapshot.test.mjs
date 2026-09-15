import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { root, runPipeline } from '../src/pipeline.mjs'
import { inspect, makeBriefing, checkAnswer } from '../src/briefing.mjs'
const source = await readFile(join(root, 'examples/06-known-gate.sol'), 'utf8')
const snapshot = JSON.parse(await readFile(join(root, 'examples/06-known-gate.discovery.json'), 'utf8'))
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
  assert.equal(from, snapshot.deployments[0].address)
  assert.equal(to, snapshot.deployments[1].address)
  assert.ok(after.locations[call].source.includes('gate.authorize(msg.sender)'))
  assert.ok(after.locations[fn].source.includes('require(caller == owner'))
  const briefing = makeBriefing(after, 'Who can change score?')
  assert.ok(!briefing.prompt.includes('require(caller == owner'))
  assert.ok(!briefing.prompt.includes(snapshot.deployments[1].address))
  const ask = (tool, target) => inspect(after, briefing.symbols, { tool, target: String(target), why: 'Inspect relevant dependency.' })
  const dep = ask('dependencies', after.derived.externalDependency[0][0])
  assert.equal(dep.evidence[0].targets[0].functionId, String(fn))
  const body = ask('source', fn)
  const owner = after.facts.stateVariable.find(([, name]) => name === 'owner')[0]
  const value = ask('values', owner)
  assert.equal(value.evidence[0].tuple[2], snapshot.deployments[1].values.owner)
  const checked = checkAnswer({ claims: [{ text: 'The snapshot identifies the owner.', evidence: [{ reference: value.evidence[0].id, explanation: 'This is the recorded owner address.', lines: [] }] }], unknowns: [] }, [dep, body, value])
  assert.equal(checked.claims[0].evidence[0].issue, null)
  assert.equal((await readFile(join(after.runDir, 'derived/resolvedCall.csv'), 'utf8')).trim(), after.derived.resolvedCall[0].join('\t'))
  assert.deepEqual(JSON.parse(await readFile(join(after.runDir, 'discovery.json'), 'utf8')), snapshot)
})

test('multiple deployments remain distinct; missing targets and mismatched selectors do not resolve', async (t) => {
  const multiple = structuredClone(snapshot)
  multiple.deployments.push({ ...multiple.deployments[0], address: '0x4444444444444444444444444444444444444444', values: { gate: '0x5555555555555555555555555555555555555555' } })
  let result = await run(t, multiple)
  assert.equal(result.derived.resolvedCall.length, 1)
  assert.equal(result.facts.snapshotAddress.length, 3)
  result = await run(t, { ...snapshot, deployments: snapshot.deployments.slice(0, 1) })
  assert.deepEqual(result.derived.resolvedCall, [])
  const wrong = structuredClone(snapshot)
  wrong.deployments[1].contract = 'DifferentGate'
  wrong.deployments[1].values = {}
  result = await run(t, wrong, source + '\ncontract DifferentGate { function authorize(uint256) external {} }')
  assert.deepEqual(result.derived.resolvedCall, [])
})

test('snapshot rejects malformed values, duplicate deployments, nonexistent fields and inherited dispatch', async (t) => {
  const bad = structuredClone(snapshot)
  bad.deployments[0].values.gate = 'not-an-address'
  await assert.rejects(run(t, bad), /20-byte/)
  const duplicate = structuredClone(snapshot)
  duplicate.deployments.push(duplicate.deployments[0])
  await assert.rejects(run(t, duplicate), /Duplicate/)
  const missing = structuredClone(snapshot)
  missing.deployments[0].values = { unknown: snapshot.deployments[1].address }
  await assert.rejects(run(t, missing), /declared address/)
  const inherited = structuredClone(snapshot)
  inherited.deployments[1].contract = 'InheritedGate'
  inherited.deployments[1].values = {}
  await assert.rejects(run(t, inherited, source + '\ncontract InheritedGate is OwnerGate { constructor() OwnerGate(address(1)) {} }'), /implementation inheritance/)
})
