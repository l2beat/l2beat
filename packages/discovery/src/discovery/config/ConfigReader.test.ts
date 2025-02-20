import { expect } from 'earl'
import mockFs from 'mock-fs'
import { resolveImports } from './ConfigReader'

describe('resolveImports', () => {
  beforeEach(() => {
    mockFs({
      '/base/valid.jsonc': JSON.stringify({ maxDepth: 123 }),
      '/base/circular-a.jsonc': JSON.stringify({
        import: ['./circular-b.jsonc'],
      }),
      '/base/circular-b.jsonc': JSON.stringify({
        import: ['./circular-a.jsonc'],
      }),
      '/base/nested.jsonc': JSON.stringify({ import: ['./child.jsonc'] }),
      '/base/child.jsonc': JSON.stringify({ maxAddresses: 456 }),
      '/base/invalid.jsonc': 'INVALID_JSON',
    })
  })

  afterEach(() => mockFs.restore())

  it('should resolve basic imports', () => {
    const result = resolveImports('/base', ['valid.jsonc'], new Set())
    expect(result).toEqual({ maxDepth: 123 })
  })

  it('should detect circular imports', () => {
    expect(() =>
      resolveImports('/base', ['circular-a.jsonc'], new Set()),
    ).toThrow('Circular import detected')
  })

  it('should throw on invalid config', () => {
    expect(() => resolveImports('/base', ['invalid.jsonc'], new Set())).toThrow(
      'Cannot parse file',
    )
  })

  it('should resolve nested imports', () => {
    const result = resolveImports('/base', ['nested.jsonc'], new Set())
    expect(result).toEqual({ import: ['./child.jsonc'], maxAddresses: 456 })
  })

  it('should merge configs with correct precedence', () => {
    mockFs({
      '/base/parent.jsonc': JSON.stringify({
        import: ['./child.jsonc'],
        key: 'parent',
      }),
      '/base/child.jsonc': JSON.stringify({ maxDepth: 123 }),
    })

    const result = resolveImports('/base', ['parent.jsonc'], new Set())
    expect(result.maxDepth).toEqual(123)
  })
})
