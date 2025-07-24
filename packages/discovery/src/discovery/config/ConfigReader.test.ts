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

describe('config and discovery resolution', () => {
  afterEach(() => mockFs.restore())

  describe('isGroupingFolder', () => {
    it('should identify grouping folders correctly', () => {
      const reader = new ConfigReader('/base')

      expect(reader.isGroupingFolder('(tokens)')).toEqual(true)
      expect(reader.isGroupingFolder('(defi)')).toEqual(true)
      expect(reader.isGroupingFolder('(bridges)')).toEqual(true)
      expect(reader.isGroupingFolder('(l2s)')).toEqual(true)

      expect(reader.isGroupingFolder('tokens')).toEqual(false)
      expect(reader.isGroupingFolder('(tokens')).toEqual(false)
      expect(reader.isGroupingFolder('tokens)')).toEqual(false)
      expect(reader.isGroupingFolder('_private')).toEqual(false)
      expect(reader.isGroupingFolder('')).toEqual(false)
    })
  })

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

    it('should find projects in grouping folders', () => {
      mockFs({
        '/base/(tokens)/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(tokens)/dai/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(defi)/uniswap/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      expect(reader.resolveProjectPath('usdc')).toEqual('/base/(tokens)/usdc')
      expect(reader.resolveProjectPath('dai')).toEqual('/base/(tokens)/dai')
      expect(reader.resolveProjectPath('uniswap')).toEqual(
        '/base/(defi)/uniswap',
      )
    })

    it('should find projects in nested grouping folders', () => {
      mockFs({
        '/base/(tokens)/(stablecoins)/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(tokens)/(stablecoins)/dai/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(tokens)/(wrapped)/wbtc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      expect(reader.resolveProjectPath('usdc')).toEqual(
        '/base/(tokens)/(stablecoins)/usdc',
      )
      expect(reader.resolveProjectPath('dai')).toEqual(
        '/base/(tokens)/(stablecoins)/dai',
      )
      expect(reader.resolveProjectPath('wbtc')).toEqual(
        '/base/(tokens)/(wrapped)/wbtc',
      )
    })

    it('should throw error when project not found', () => {
      mockFs({
        '/base/(tokens)/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      expect(() => reader.resolveProjectPath('nonexistent')).toThrow(
        'Project not found, check if case matches',
      )
    })

    it('should throw error when multiple projects with same name exist', () => {
      mockFs({
        '/base/(tokens)/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(defi)/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      expect(() => reader.resolveProjectPath('usdc')).toThrow(
        'Multiple projects named "usdc" found in grouping folders',
      )
    })

    it('should prioritize direct children over grouped projects', () => {
      mockFs({
        '/base/usdc/config.jsonc': JSON.stringify({ chains: { ethereum: {} } }),
        '/base/(tokens)/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      expect(reader.resolveProjectPath('usdc')).toEqual('/base/usdc')
    })

    it('should ignore directories starting with underscore', () => {
      mockFs({
        '/base/(tokens)/_internal/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      // This should not be found because directories starting with _ are ignored
      expect(() => reader.resolveProjectPath('_internal')).toThrow(
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

    it('should enumerate projects in grouping folders', () => {
      mockFs({
        '/base/(tokens)/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(tokens)/dai/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(defi)/uniswap/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      const result = reader.enumerateProjectDirectories()
      expect(result).toEqual([
        '/base/(tokens)/dai',
        '/base/(tokens)/usdc',
        '/base/(defi)/uniswap',
      ])
    })

    it('should enumerate projects in nested grouping folders', () => {
      mockFs({
        '/base/(tokens)/(stablecoins)/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(tokens)/(stablecoins)/dai/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(tokens)/(wrapped)/wbtc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      const result = reader.enumerateProjectDirectories()
      expect(result).toEqual([
        '/base/(tokens)/(wrapped)/wbtc',
        '/base/(tokens)/(stablecoins)/dai',
        '/base/(tokens)/(stablecoins)/usdc',
      ])
    })

    it('should ignore directories starting with underscore', () => {
      mockFs({
        '/base/project1/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/_private/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(tokens)/_internal/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      const result = reader.enumerateProjectDirectories()
      expect(result).toEqual(['/base/project1'])
    })

    it('should handle mixed structure with root and grouped projects', () => {
      mockFs({
        '/base/project1/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(tokens)/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(defi)/uniswap/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      const result = reader.enumerateProjectDirectories()
      expect(result).toEqual([
        '/base/project1',
        '/base/(tokens)/usdc',
        '/base/(defi)/uniswap',
      ])
    })
  })

  describe('getProjectsInGroup', () => {
    it('should return projects in specified group', () => {
      mockFs({
        '/base/(tokens)/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(tokens)/dai/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(defi)/uniswap/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(defi)/aave/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      expect(reader.getProjectsInGroup('tokens')).toEqual(['dai', 'usdc'])
      expect(reader.getProjectsInGroup('defi')).toEqual(['aave', 'uniswap'])
    })

    it('should return empty array for non-existent group', () => {
      mockFs({
        '/base/(tokens)/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      expect(reader.getProjectsInGroup('nonexistent')).toEqual([])
    })

    it('should return empty array for empty group', () => {
      mockFs({
        '/base/(empty)/.gitkeep': '',
      })

      const reader = new ConfigReader('/base')

      expect(reader.getProjectsInGroup('empty')).toEqual([])
    })

    it('should handle nested grouping folders correctly', () => {
      mockFs({
        '/base/(tokens)/(stablecoins)/usdc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(tokens)/(stablecoins)/dai/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
        '/base/(tokens)/(wrapped)/wbtc/config.jsonc': JSON.stringify({
          chains: { ethereum: {} },
        }),
      })

      const reader = new ConfigReader('/base')

      expect(reader.getProjectsInGroup('stablecoins')).toEqual(['dai', 'usdc'])
      expect(reader.getProjectsInGroup('wrapped')).toEqual(['wbtc'])
    })
  })

  describe('readAllConfiguredProjects with grouping', () => {
    it('should read all configured projects including grouped ones', () => {
      mockFs({
        '/base/project1/config.jsonc': JSON.stringify({
          name: 'project1',
          initialAddresses: ['eth:0x1234567890123456789012345678901234567890'],
        }),
        '/base/(tokens)/usdc/config.jsonc': JSON.stringify({
          name: 'usdc',
          initialAddresses: ['eth:0x1234567890123456789012345678901234567890'],
        }),
        '/base/(defi)/uniswap/config.jsonc': JSON.stringify({
          name: 'uniswap',
          initialAddresses: ['eth:0x1234567890123456789012345678901234567890'],
        }),
      })

      const reader = new ConfigReader('/base')
      const result = reader.readAllConfiguredProjects()

      expect(result).toEqual([
        { project: 'project1', chains: ['ethereum'] },
        { project: 'usdc', chains: ['ethereum'] },
        { project: 'uniswap', chains: ['ethereum'] },
      ])
    })
  })

  describe('readAllDiscoveredProjects with grouping', () => {
    it('should read all discovered projects including grouped ones', () => {
      mockFs({
        '/base/project1/ethereum/discovered.json': JSON.stringify({
          chain: 'ethereum',
        }),
        '/base/(tokens)/usdc/ethereum/discovered.json': JSON.stringify({
          chain: 'ethereum',
        }),
        '/base/(defi)/uniswap/ethereum/discovered.json': JSON.stringify({
          chain: 'ethereum',
        }),
        '/base/(defi)/aave/polygon/discovered.json': JSON.stringify({
          chain: 'polygon',
        }),
      })

      const reader = new ConfigReader('/base')
      const result = reader.readAllDiscoveredProjects()

      expect(result).toEqual([
        { project: 'project1', chains: ['ethereum'] },
        { project: 'usdc', chains: ['ethereum'] },
        { project: 'aave', chains: ['polygon'] },
        { project: 'uniswap', chains: ['ethereum'] },
      ])
    })

    it('should skip projects in skipTokens group', () => {
      mockFs({
        '/base/project1/ethereum/discovered.json': JSON.stringify({
          chain: 'ethereum',
        }),
        '/base/(tokens)/usdc/ethereum/discovered.json': JSON.stringify({
          chain: 'ethereum',
        }),
        '/base/(defi)/uniswap/ethereum/discovered.json': JSON.stringify({
          chain: 'ethereum',
        }),
        '/base/(defi)/aave/polygon/discovered.json': JSON.stringify({
          chain: 'polygon',
        }),
      })

      const reader = new ConfigReader('/base')
      const result = reader.readAllDiscoveredProjects({ skipGroup: 'defi' })

      expect(result).toEqual([
        { project: 'project1', chains: ['ethereum'] },
        { project: 'usdc', chains: ['ethereum'] },
      ])
    })
  })

  describe('readConfig with grouping', () => {
    it('should read config from grouped project', () => {
      mockFs({
        '/base/(tokens)/usdc/config.jsonc': JSON.stringify({
          name: 'usdc',
          maxAddresses: 10,
          initialAddresses: ['eth:0x1234567890123456789012345678901234567890'],
        }),
      })

      const reader = new ConfigReader('/base')
      const config = reader.readConfig('usdc', 'ethereum')

      expect(config.structure.name).toEqual('usdc')
      expect(config.structure.chain).toEqual('ethereum')
      expect(config.structure.maxAddresses).toEqual(10)
    })
  })

  describe('readDiscovery with grouping', () => {
    it('should read discovery from grouped project', () => {
      const discoveryData = {
        chain: 'ethereum',
        entries: [],
        abis: {},
      }

      mockFs({
        '/base/(tokens)/usdc/config.jsonc': JSON.stringify({
          initialAddresses: [],
        }),
        '/base/(tokens)/usdc/ethereum/discovered.json':
          JSON.stringify(discoveryData),
      })

      const reader = new ConfigReader('/base')
      const discovery = reader.readDiscovery('usdc', 'ethereum')

      expect(discovery.chain).toEqual('ethereum')
      expect(discovery.entries).toEqual([])
      expect(discovery.abis).toEqual({})
    })
  })
})
