import { expect } from 'earl'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { fixturePlan } from '../testing/fixturePlan'
import { PlanStore } from './PlanStore'
import { canonicalJson, planHash } from './planHash'

/**
 * Round-trips the fixture plan through a temporary store directory. What
 * matters is that a stored plan comes back byte-for-byte usable by the
 * executor, that a file which does not match its own name or the schema is
 * refused loudly, and that a shape-less plan cannot be stored at all.
 */
describe(PlanStore.name, () => {
  let directory: string
  let store: PlanStore

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'discovery-v2-plans-'))
    store = new PlanStore(directory)
  })

  afterEach(() => {
    fs.rmSync(directory, { recursive: true, force: true })
  })

  const provenance = {
    source: 'manual' as const,
    createdAt: '2026-09-21T00:00:00.000Z',
  }

  it('returns undefined for a shape that was never stored', () => {
    expect(store.load(`0x${'ff'.repeat(32)}`)).toEqual(undefined)
  })

  it('saves under <shapeHash>.json with provenance and loads it back', () => {
    const plan = fixturePlan()
    const file = store.save(plan, {
      ...provenance,
      source: 'model',
      model: 'gpt-5',
      rounds: 1,
    })

    expect(file).toEqual(path.join(directory, `${plan.shapeHash}.json`))
    expect(JSON.parse(fs.readFileSync(file, 'utf8'))).toEqual({
      plan,
      provenance: { ...provenance, source: 'model', model: 'gpt-5', rounds: 1 },
    })
    expect(store.load(plan.shapeHash as string)).toEqual({
      plan,
      provenance: { ...provenance, source: 'model', model: 'gpt-5', rounds: 1 },
    })
  })

  it('refuses to store a plan without a shape hash', () => {
    const { shapeHash: _, ...plan } = fixturePlan()
    expect(() => store.save(plan, provenance)).toThrow(/without a shapeHash/)
  })

  it('refuses a file whose plan names a different shape than the file', () => {
    const plan = fixturePlan()
    const other = `0x${'33'.repeat(32)}`
    fs.writeFileSync(
      path.join(directory, `${other}.json`),
      JSON.stringify({ plan, provenance }),
    )
    expect(() => store.load(other)).toThrow(/is for shape 0x2222/)
  })

  it('refuses a file whose plan fails the schema', () => {
    const plan = { ...fixturePlan(), steps: 'nope' }
    fs.writeFileSync(
      path.join(directory, `${plan.shapeHash}.json`),
      JSON.stringify({ plan, provenance }),
    )
    expect(() => store.load(plan.shapeHash as string)).toThrow(/invalid plan/)
  })

  it('rejects anything that is not a shape hash as a key', () => {
    expect(() => store.load('../etc/passwd')).toThrow(/Not a shape hash/)
  })
})

/**
 * Two layouts of the same plan must hash the same, since the benchmark
 * counts identical plans; a change to any value must not.
 */
describe(planHash.name, () => {
  it('ignores key order at every depth and undefined members', () => {
    const a = {
      version: 1,
      steps: [{ id: 'x', fetch: { kind: 'call', method: 'x()' } }],
    }
    const b = {
      steps: [
        { fetch: { method: 'x()', kind: 'call' }, id: 'x', at: undefined },
      ],
      version: 1,
    }
    expect(planHash(a)).toEqual(planHash(b))
    expect(canonicalJson(a)).toEqual(
      '{"steps":[{"fetch":{"kind":"call","method":"x()"},"id":"x"}],"version":1}',
    )
  })

  it('keeps array order significant and changes with any value', () => {
    const a = { steps: [{ id: 'x' }, { id: 'y' }] }
    const b = { steps: [{ id: 'y' }, { id: 'x' }] }
    expect(planHash(a)).not.toEqual(planHash(b))
    expect(planHash({ v: 1 })).not.toEqual(planHash({ v: 2 }))
    expect(planHash({ v: 1 })).toMatchRegex(/^0x[0-9a-f]{64}$/)
  })
})
