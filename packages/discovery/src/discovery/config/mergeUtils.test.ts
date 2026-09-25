import { expect } from 'earl'
import {
  type MergePolicy,
  mergeRecordByName,
  mergeWithPolicy,
  overrideScalar,
  replaceArray,
} from './mergeUtils'

describe(mergeWithPolicy.name, () => {
  type Sample = { name?: string; tags: string[] }
  const samplePolicy: MergePolicy<Sample> = {
    name: overrideScalar,
    tags: replaceArray,
  }

  it('applies the per-key policy and produces every key of the policy', () => {
    const result = mergeWithPolicy(
      samplePolicy,
      { name: 'base', tags: ['a', 'b'] },
      { tags: ['c'] },
    )

    expect(result).toEqual({ name: 'base', tags: ['c'] })
  })

  it('refuses inputs carrying a key the policy does not name', () => {
    const stale = { name: 'x', tags: [], extra: 1 } as unknown as Sample

    expect(() => mergeWithPolicy(samplePolicy, stale, { tags: [] })).toThrow()
    expect(() => mergeWithPolicy(samplePolicy, { tags: [] }, stale)).toThrow()
  })

  it('fails to compile when the policy misses or invents a schema key', () => {
    // @ts-expect-error missing key: tags
    const missing: MergePolicy<Sample> = { name: overrideScalar }
    const invented: MergePolicy<Sample> = {
      name: overrideScalar,
      tags: replaceArray,
      // @ts-expect-error unknown key: colour
      colour: overrideScalar,
    }
    const retyped: MergePolicy<Sample> = {
      name: overrideScalar,
      // @ts-expect-error a scalar helper cannot merge an array key
      tags: overrideScalar,
    }

    expect([missing, invented, retyped].length).toEqual(3)
  })
})

describe(mergeRecordByName.name, () => {
  it('keeps base-only and override-only names and merges shared ones by policy', () => {
    type Field = { severity?: string; tags: string[] }
    const policy: MergePolicy<Field> = {
      severity: overrideScalar,
      tags: replaceArray,
    }
    const merge = mergeRecordByName<Field>((base, override) =>
      mergeWithPolicy(policy, base, override),
    )

    const result = merge(
      { a: { severity: 'LOW', tags: ['x'] }, b: { tags: ['y'] } },
      { b: { severity: 'HIGH', tags: [] }, c: { tags: ['z'] } },
    )

    expect(result).toEqual({
      a: { severity: 'LOW', tags: ['x'] },
      b: { severity: 'HIGH', tags: [] },
      c: { tags: ['z'] },
    })
  })
})
