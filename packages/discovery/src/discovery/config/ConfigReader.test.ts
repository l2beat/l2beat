import { expect } from 'earl'
import mockFs from 'mock-fs'
import { ConfigReader } from './ConfigReader'

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
    const reader = new ConfigReader('/base')
    const result = reader.resolveImports('/base', ['valid.jsonc'], new Set())
    expect(result).toEqual({ maxDepth: 123 })
  })

  it('should detect circular imports', () => {
    const reader = new ConfigReader('/base')
    expect(() =>
      reader.resolveImports('/base', ['circular-a.jsonc'], new Set()),
    ).toThrow('Circular import detected')
  })

  it('should throw on invalid config', () => {
    const reader = new ConfigReader('/base')
    expect(() =>
      reader.resolveImports('/base', ['invalid.jsonc'], new Set()),
    ).toThrow('Cannot parse file')
  })

  it('should resolve nested imports', () => {
    const reader = new ConfigReader('/base')
    const result = reader.resolveImports('/base', ['nested.jsonc'], new Set())
    expect(result).toEqual({ import: ['./child.jsonc'], maxAddresses: 456 })
  })

  it('should merge configs with correct precedence', () => {
    const reader = new ConfigReader('/base')
    mockFs({
      '/base/parent.jsonc': JSON.stringify({
        import: ['./child.jsonc'],
        key: 'parent',
      }),
      '/base/child.jsonc': JSON.stringify({ maxDepth: 123 }),
    })

    const result = reader.resolveImports('/base', ['parent.jsonc'], new Set())
    expect((result as any).maxDepth).toEqual(123)
  })
})
