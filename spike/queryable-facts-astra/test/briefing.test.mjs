import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { root, runPipeline } from '../src/pipeline.mjs'
import { makeBriefing, inspect, checkAnswer } from '../src/briefing.mjs'
import { ask, loadRun } from '../src/ask.mjs'

async function fixture(t, name = '03-owner') {
  const outputRoot = await mkdtemp(join(tmpdir(), 'astra-reading-test-'))
  t.after(() => rm(outputRoot, { recursive: true, force: true }))
  return runPipeline(await readFile(join(root, 'examples', `${name}.sol`), 'utf8'), { outputRoot })
}
const find = (briefing, name) => briefing.symbols.find((s) => s.label === name)
const request = (tool, target) => ({ action: 'inspect', tool, target, why: 'Check the relevant code or facts.', claims: [], unknowns: [] })
const final = (reference, lines = []) => ({ action: 'answer', tool: 'none', target: '', why: '',
  claims: [{ text: 'Only the owner passes the check.', evidence: [{ reference, explanation: 'The check compares the caller to owner.', lines }] }], unknowns: [] })

test('initial briefing has an index and boundaries, without source or an imposed variable', async (t) => {
  const run = await fixture(t)
  const briefing = makeBriefing(run, 'How is access controlled?')
  assert.ok(find(briefing, 'Playground.score'))
  assert.ok(find(briefing, 'Playground.setScore(uint256)'))
  assert.ok(briefing.prompt.includes(run.scope[0]))
  assert.ok(!briefing.prompt.includes('require(msg.sender == owner'))
  assert.ok(!briefing.prompt.includes('owner = initialOwner'))
  assert.equal('variableId' in briefing, false)
})

test('requests filter by declaration, retrieve full function context, and expose unknown gate interfaces', async (t) => {
  for (const name of ['02-unreachable', '03-owner', '04-external-gate']) {
    const run = await fixture(t, name)
    const briefing = makeBriefing(run, 'Who can change score?')
    const writers = inspect(run, briefing.symbols, request('writers', find(briefing, 'Playground.score').id))
    assert.equal(writers.evidence.length, 1)
    const code = inspect(run, briefing.symbols, request('source', writers.evidence[0].functionId)).evidence[0]
    assert.match(code.source, /function setScore/)
    assert.match(code.source, /score = next/)
    assert.match(code.source, name === '02-unreachable' ? /revert\(/ : name === '03-owner' ? /require\(/ : /gate.authorize/)
    assert.ok(code.source.trim().endsWith('}'))
  }
})

test('only retrieved evidence can be resolved; highlights must belong to the excerpt', async (t) => {
  const run = await fixture(t)
  const briefing = makeBriefing(run, 'Question?')
  const id = find(briefing, 'Playground.setScore(uint256)').id
  const step = inspect(run, briefing.symbols, request('source', id))
  const answer = checkAnswer(final(`source:${id}`, [13]), [step])
  assert.equal(answer.claims[0].evidence[0].issue, null)
  assert.match(answer.claims[0].evidence[0].material.source, /require/)
  assert.match(checkAnswer(final(`source:${id}`), []).claims[0].evidence[0].issue, /not retrieved/)
  assert.match(checkAnswer(final(`source:${id}`, [999]), [step]).claims[0].evidence[0].issue, /do not belong/)
  const falseClaim = final(`source:${id}`, [13]); falseClaim.claims[0].text = 'Anyone passes.'
  assert.equal(checkAnswer(falseClaim, [step]).claims[0].evidence[0].issue, null) // membership is not truth
})

test('actual retrieval loop supplies requested results, emits steps, and saves prompts and answer', async (t) => {
  const run = await fixture(t)
  const briefing = makeBriefing(run, 'Question?')
  const variable = find(briefing, 'Playground.score').id
  const fn = find(briefing, 'Playground.setScore(uint256)').id
  let turn = 0
  const events = []
  const record = await ask(run, 'Who can change score?', { onEvent: (e) => events.push(e), execute: async (prompt) => {
    if (turn++ === 0) {
      assert.ok(!prompt.includes('score = next'))
      return JSON.stringify(request('writers', variable))
    }
    if (turn === 2) {
      assert.match(prompt, /functionId/)
      assert.ok(!prompt.includes('require(msg.sender == owner'))
      return JSON.stringify(request('source', fn))
    }
    assert.match(prompt, /require\(msg.sender == owner/)
    return JSON.stringify(final(`source:${fn}`, [13]))
  } })
  assert.equal(record.trail.length, 2)
  assert.deepEqual(events.map((e) => e.type), ['started', 'inspection', 'inspection'])
  assert.ok((await readFile(join(record.askDir, 'turn-03/prompt.txt'), 'utf8')).includes('INSPECTION HISTORY'))
  assert.equal(JSON.parse(await readFile(join(record.askDir, 'answer.json'), 'utf8')).answer.claims.length, 1)
})

test('invalid requests can be corrected; limits and source-free answers fail explicitly', async (t) => {
  const run = await fixture(t)
  let turns = 0
  await assert.rejects(() => ask(run, 'Question?', { maxInspections: 1, execute: async (prompt) => {
    if (turns++ > 0) assert.match(prompt, /Writers requires/)
    return JSON.stringify(request('writers', 'missing'))
  } }), /more inspections/)
  await assert.rejects(() => ask(run, 'Question?', { execute: async () => JSON.stringify(final('source:1')) }), /without reading source/)
  const controller = new AbortController(); controller.abort()
  await assert.rejects(() => ask(run, 'Question?', { signal: controller.signal, execute: async () => { assert.fail('Must not start a model call') } }), /abort/i)
})

test('range limits, invalid questions, and untrusted paths are rejected', async (t) => {
  const run = await fixture(t)
  const briefing = makeBriefing(run, 'Question?')
  assert.throws(() => inspect(run, briefing.symbols, request('lines', '1-1000')), /valid source range/)
  assert.throws(() => inspect(run, briefing.symbols, request('source', '999')), /symbol ID/)
  assert.throws(() => makeBriefing(run, ' '), /Provide a question/)
  await assert.rejects(() => loadRun('../../private'), /Invalid run ID/)
})
