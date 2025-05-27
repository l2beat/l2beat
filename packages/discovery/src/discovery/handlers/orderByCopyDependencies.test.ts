import { expect } from 'earl'
import type { StructureContractField } from '../config/StructureConfig'
import { orderByCopyDependencies } from './orderByCopyDependencies'

// For testing, we'll use a partial type that matches StructureContract['fields']
type TestFields = Record<string, Partial<StructureContractField>>

describe('orderByCopyDependencies', () => {
  it('should return an empty array for empty fields', () => {
    const fields: TestFields = {}
    const result = orderByCopyDependencies(fields)
    expect(result).toEqual([])
  })

  it('should return an empty array for fields with no copy dependencies', () => {
    const fields: TestFields = {
      a: { template: 'some template' },
      b: {},
    }
    const result = orderByCopyDependencies(fields)
    expect(result).toEqual([])
  })

  it('should handle a simple dependency correctly', () => {
    const fields: TestFields = {
      a: {}, // No copy, so it's known immediately
      b: { copy: 'a' }, // Depends on 'a'
    }
    const result = orderByCopyDependencies(fields)
    expect(result).toEqual([['b']]) // 'b' is added to the first batch once 'a' is known
  })

  it('should handle multiple dependencies at the same level', () => {
    const fields: TestFields = {
      a: {}, // Known immediately
      b: { copy: 'a' },
      c: { copy: 'a' },
      d: { copy: 'b' }, // Depends on 'b', which depends on 'a'
    }
    const result = orderByCopyDependencies(fields)
    expect(result).toEqual([['b', 'c'], ['d']]) // 'b' and 'c' can be processed together, then 'd'
  })

  it('should handle multiple levels of dependencies', () => {
    const fields: TestFields = {
      a: {}, // Known immediately
      b: { copy: 'a' },
      c: { copy: 'b' },
      d: { copy: 'c' },
    }
    const result = orderByCopyDependencies(fields)
    expect(result).toEqual([['b'], ['c'], ['d']]) // Each is added in sequence as dependencies resolve
  })

  it('should throw an error for a cyclic dependency', () => {
    const fields: TestFields = {
      a: { copy: 'b' },
      b: { copy: 'a' },
    }
    expect(() => orderByCopyDependencies(fields)).toThrow(
      'Impossible to resolve dependencies',
    )
  })

  it('should throw an error for a self-referential dependency', () => {
    const fields: TestFields = {
      a: { copy: 'a' },
    }
    expect(() => orderByCopyDependencies(fields)).toThrow(
      'Impossible to resolve dependencies',
    )
  })

  it('should throw an error for an unresolvable dependency', () => {
    const fields: TestFields = {
      a: { copy: 'b' }, // 'b' exists but depends on 'c'
      b: { copy: 'c' }, // 'c' does not exist
    }
    expect(() => orderByCopyDependencies(fields)).toThrow(
      'Impossible to resolve dependencies',
    )
  })

  it('should handle a mix of dependencies and non-dependencies', () => {
    const fields: TestFields = {
      a: {}, // Known immediately
      b: { copy: 'a' },
      c: {}, // Known immediately, but not in batches
      d: { copy: 'b' },
    }
    const result = orderByCopyDependencies(fields)
    expect(result).toEqual([['b'], ['d']]) // Only dependent fields are in batches
  })
})
