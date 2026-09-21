import { expect } from 'earl'
import type { Step } from './Plan'
import {
  collectReferences,
  findCycles,
  parseReference,
  stepDependencies,
} from './references'

/**
 * Pins the reference grammar and the positions a reference may occupy. The
 * validator and the executor share these functions, so this is where "a
 * reference the validator accepted resolves in the executor" is tested.
 */
describe('references', () => {
  it('parses the three reference forms and nothing else', () => {
    expect(parseReference('$self')).toEqual({ kind: 'self' })
    expect(parseReference('$baseline.owner')).toEqual({
      kind: 'baseline',
      field: 'owner',
    })
    expect(parseReference('$step.validators')).toEqual({
      kind: 'step',
      id: 'validators',
    })
    expect(parseReference('$baseline.owner.x')).toEqual(undefined)
    expect(parseReference('$step')).toEqual(undefined)
    expect(parseReference('owner')).toEqual(undefined)
    expect(parseReference(5)).toEqual(undefined)
  })

  it('collects references from at, call args, keys.from and range.length with their paths', () => {
    const step: Step = {
      id: 'x',
      fetch: {
        kind: 'call',
        method: 'f(address,uint256)',
        args: ['$self', 5, '$baseline.n'],
        at: '$step.registry',
      },
      reason: 'r',
    }
    expect(
      collectReferences(step).map((site) => [site.path, site.raw]),
    ).toEqual([
      ['fetch.at', '$step.registry'],
      ['fetch.args[0]', '$self'],
      ['fetch.args[2]', '$baseline.n'],
    ])
    const from: Step = {
      id: 'y',
      fetch: {
        kind: 'callEach',
        method: 'g(address)',
        keys: { from: '$step.x' },
      },
      reason: 'r',
    }
    expect(collectReferences(from).map((site) => site.path)).toEqual([
      'fetch.keys.from',
    ])
    const range: Step = {
      id: 'z',
      fetch: {
        kind: 'callEach',
        method: 'h(uint256)',
        keys: { range: { length: '$baseline.count' } },
      },
      reason: 'r',
    }
    expect(collectReferences(range).map((site) => site.path)).toEqual([
      'fetch.keys.range.length',
    ])
    expect(stepDependencies(step)).toEqual(['registry'])
  })

  it('finds every dependency cycle and ignores edges to unknown steps', () => {
    const steps: Step[] = [
      call('a', '$step.b'),
      call('b', '$step.c'),
      call('c', '$step.a'),
      call('d', '$step.d'),
      call('e', '$step.missing'),
      call('f', '$step.a'),
    ]
    expect(findCycles(steps)).toEqual([
      ['a', 'b', 'c', 'a'],
      ['d', 'd'],
    ])
    expect(
      findCycles([call('a', '$step.b'), call('b', '$baseline.x')]),
    ).toEqual([])
  })
})

function call(id: string, at: string): Step {
  return { id, fetch: { kind: 'call', method: 'owner()', at }, reason: 'r' }
}
