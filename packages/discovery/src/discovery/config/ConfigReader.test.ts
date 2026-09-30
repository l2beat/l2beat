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
      '/base/nested.jsonc': JSON.stringify({
        import: ['./child.jsonc'],
        maxDepth: 7,
      }),
      '/base/child.jsonc': JSON.stringify({ maxAddresses: 456 }),
      '/base/invalid.jsonc': 'INVALID_JSON',
    })
  })

  afterEach(() => mockFs.restore())

  it('returns one parsed layer per imported file', () => {
    const reader = new ConfigReader('/base')
    const result = reader.resolveImports('/base', ['valid.jsonc'], new Set())
    expect(result).toEqual([{ maxDepth: 123 }])
  })

  it('detects circular imports', () => {
    const reader = new ConfigReader('/base')
    expect(() =>
      reader.resolveImports('/base', ['circular-a.jsonc'], new Set()),
    ).toThrow('Circular import detected')
  })

  it('throws on invalid config', () => {
    const reader = new ConfigReader('/base')
    expect(() =>
      reader.resolveImports('/base', ['invalid.jsonc'], new Set()),
    ).toThrow('Unexpected token')
  })

  it('orders nested imports below the file that imports them', () => {
    const reader = new ConfigReader('/base')
    const result = reader.resolveImports('/base', ['nested.jsonc'], new Set())
    expect(result).toEqual([{ maxAddresses: 456 }, { maxDepth: 7 }])
  })
})

describe('readConfig layering', () => {
  const ADDRESS = 'eth:0x1234567890123456789012345678901234567890'

  beforeEach(() => {
    mockFs({
      '/layered/global.jsonc': JSON.stringify({
        names: { [ADDRESS]: 'Global' },
        overrides: {
          [ADDRESS]: {
            ignoreMethods: ['a'],
            ignoreDiscovery: true,
            fields: {
              f: { severity: 'LOW', handler: { type: 'storage', slot: 1 } },
            },
          },
        },
      }),
      '/layered/proj/config.jsonc': JSON.stringify({
        import: ['../global.jsonc'],
        name: 'proj',
        initialAddresses: [ADDRESS],
        overrides: {
          [ADDRESS]: {
            ignoreMethods: ['b'],
            fields: { f: { severity: 'HIGH' } },
          },
        },
      }),
    })
  })

  afterEach(() => mockFs.restore())

  it('merges an imported override through the same policy as templates', () => {
    const config = new ConfigReader('/layered').readConfig('proj')
    const structure = config.structure.overrides?.[ADDRESS]
    const color = config.color.overrides?.[ADDRESS]

    expect(structure?.ignoreMethods).toEqual(['a', 'b'])
    expect(structure?.ignoreDiscovery).toEqual(true)
    expect(structure?.fields.f?.handler).toEqual({ type: 'storage', slot: 1 })
    expect(color?.fields.f?.severity).toEqual('HIGH')
    expect(config.color.names?.[ADDRESS]).toEqual('Global')
  })

  it('does not apply schema defaults before layering so an imported flag survives', () => {
    const config = new ConfigReader('/layered').readConfig('proj')
    expect(config.structure.overrides?.[ADDRESS]?.ignoreDiscovery).toEqual(true)
  })
})

describe('config and discovery resolution', () => {
  afterEach(() => mockFs.restore())

  describe('resolveProjectPath', () => {
    it('should find projects in root directory', () => {
      mockFs({
        '/base/project1/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/project2/config.jsonc': JSON.stringify({
          chains: { polygon: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      expect(reader.resolveProjectPath('project1')).toEqual('/base/project1')
      expect(reader.resolveProjectPath('project2')).toEqual('/base/project2')
    })

    it('should throw error when project not found', () => {
      mockFs({
        '/base/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      expect(() => reader.resolveProjectPath('nonexistent')).toThrow(
        'Project not found, check if case matches',
      )
    })

    it('should throw when directory exists but has no config.jsonc', () => {
      mockFs({
        '/base/usdc/somefile.txt': '',
      })

      const reader = new ConfigReader('/base')

      expect(() => reader.resolveProjectPath('usdc')).toThrow(
        'Project not found, check if case matches',
      )
    })
  })

  describe('enumerateProjectDirectories', () => {
    it('should enumerate projects in root directory', () => {
      mockFs({
        '/base/project1/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/project2/config.jsonc': JSON.stringify({
          chains: { polygon: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      const result = reader.enumerateProjectDirectories()
      expect(result).toEqual(['/base/project1', '/base/project2'])
    })

    it('should ignore directories starting with underscore', () => {
      mockFs({
        '/base/project1/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/_private/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      const result = reader.enumerateProjectDirectories()
      expect(result).toEqual(['/base/project1'])
    })
  })

  describe('readAllDiscoveredProjects', () => {
    it('should read all projects that have discovered.json', () => {
      mockFs({
        '/base/project1/discovered.json': JSON.stringify({}),
        '/base/project2/discovered.json': JSON.stringify({}),
        '/base/project3/config.jsonc': JSON.stringify({}),
      })

      const reader = new ConfigReader('/base')
      const result = reader.readAllDiscoveredProjects()

      expect(result).toEqual(['project1', 'project2'])
    })
  })

  describe('readConfig', () => {
    it('should read config from project', () => {
      mockFs({
        '/base/usdc/config.jsonc': JSON.stringify({
          name: 'usdc',
          maxAddresses: 10,
          initialAddresses: ['eth:0x1234567890123456789012345678901234567890'],
        }),
      })

      const reader = new ConfigReader('/base')
      const config = reader.readConfig('usdc')

      expect(config.structure.name).toEqual('usdc')
      expect(config.structure.maxAddresses).toEqual(10)
    })
  })

  describe('readDiscovery', () => {
    it('should read discovery from project', () => {
      const discoveryData = { entries: [], abis: {} }

      mockFs({
        '/base/usdc/config.jsonc': JSON.stringify({
          initialAddresses: [],
        }),
        '/base/usdc/discovered.json': JSON.stringify(discoveryData),
      })

      const reader = new ConfigReader('/base')
      const discovery = reader.readDiscovery('usdc')

      expect(discovery.entries).toEqual([])
      expect(discovery.abis).toEqual({})
    })
  })
})
