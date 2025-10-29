import { expect } from 'earl'
import type {
  ContractConfigSchema,
  DiscoveryConfigSchema,
} from '../../../../../discovery/src/schemas/schemas'
import { ConfigModel, ContractConfigModel } from './ConfigModel'

// ===================================
// Helper functions for creating test configs
// ===================================

/**
 * Creates a valid DiscoveryConfigSchema with sensible defaults.
 * Helps reduce boilerplate in tests and ensures type safety.
 */
function createDiscoveryConfig(
  overrides?: Partial<DiscoveryConfigSchema>,
): DiscoveryConfigSchema {
  return {
    name: 'test-project',
    initialAddresses: ['eth:0x1234567890123456789012345678901234567890'] as any,
    maxAddresses: 100,
    maxDepth: 7,
    sharedModules: [],
    ...overrides,
  }
}

/**
 * Creates a valid ContractConfigSchema with sensible defaults.
 * All required fields are populated to satisfy type constraints.
 */
function createContractConfig(
  overrides?: Partial<ContractConfigSchema>,
): ContractConfigSchema {
  return {
    ignoreDiscovery: false,
    ignoreMethods: [],
    ignoreRelatives: [],
    methods: {},
    manualSourcePaths: {},
    types: {},
    fields: {},
    ...overrides,
  }
}

describe('ConfigModel', () => {
  describe('constructor and initialization', () => {
    it('creates instance with minimal valid config', () => {
      // Given a minimal valid discovery config
      const config = createDiscoveryConfig()

      // When creating a ConfigModel instance
      const editor = ConfigModel.fromPeak(config)

      // Then it should initialize successfully
      expect(editor.peak().name).toEqual('test-project')
    })

    it('initializes overrides as empty object when not provided', () => {
      // Given a config without overrides
      const config = createDiscoveryConfig()

      // When creating a ConfigModel instance
      const editor = ConfigModel.fromPeak(config)

      // Then overrides should be initialized
      const result = editor.peak()
      expect(result.overrides).toEqual({})
    })

    it('creates ContractConfigModel for each override', () => {
      // Given a config with multiple overrides
      const config = createDiscoveryConfig({
        overrides: {
          '0xAddress1': createContractConfig(),
          '0xAddress2': createContractConfig({
            ignoreDiscovery: true,
            ignoreMethods: ['method1'],
          }),
        },
      })

      // When creating a ConfigModel instance
      const editor = ConfigModel.fromPeak(config)

      // Then it should properly initialize overrides
      expect(editor.getIgnoreDiscovery('0xAddress1')).toEqual(false)
      expect(editor.getIgnoreDiscovery('0xAddress2')).toEqual(true)
      expect(editor.getIgnoreMethods('0xAddress2')).toEqual(['method1'])
    })
  })

  describe('fromRawJsonc', () => {
    it('parses valid JSONC without comments', () => {
      // Given valid JSONC config
      const jsonc = `{
  "name": "test-project",
  "initialAddresses": ["eth:0x1234567890123456789012345678901234567890"],
  "maxAddresses": 100,
  "maxDepth": 7,
  "sharedModules": []
}`

      // When parsing from raw JSONC
      const editor = ConfigModel.fromRawJsonc(jsonc)

      // Then it should create a valid ConfigModel
      expect(editor.peak().name).toEqual('test-project')
    })

    it('parses JSONC with single-line comments', () => {
      // Given JSONC with single-line comments
      const jsonc = `{
  // This is the project name
  "name": "test-project",
  // Initial addresses to discover
  "initialAddresses": ["eth:0x1234567890123456789012345678901234567890"],
  "maxAddresses": 100,
  "maxDepth": 7,
  "sharedModules": []
}`

      // When parsing from raw JSONC
      const editor = ConfigModel.fromRawJsonc(jsonc)

      // Then it should parse correctly ignoring comments
      const result = editor.peak()
      expect(result.name).toEqual('test-project')
      expect(result.initialAddresses.length).toEqual(1)
    })

    it('parses JSONC with multi-line comments', () => {
      // Given JSONC with multi-line comments
      const jsonc = `{
  /* 
   * Project configuration
   * for test project
   */
  "name": "test-project",
  "initialAddresses": ["eth:0x1234567890123456789012345678901234567890"],
  "maxAddresses": 100,
  "maxDepth": 7,
  "sharedModules": []
}`

      // When parsing from raw JSONC
      const editor = ConfigModel.fromRawJsonc(jsonc)

      // Then it should parse correctly ignoring comments
      expect(editor.peak().name).toEqual('test-project')
    })

    it('parses JSONC with inline comments', () => {
      // Given JSONC with inline comments
      const jsonc = `{
  "name": "test-project", // project identifier
  "initialAddresses": ["eth:0x1234567890123456789012345678901234567890"], // starting point
  "maxAddresses": 100,
  "maxDepth": 7,
  "sharedModules": []
}`

      // When parsing from raw JSONC
      const editor = ConfigModel.fromRawJsonc(jsonc)

      // Then it should parse correctly preserving data
      expect(editor.peak().name).toEqual('test-project')
    })

    it('parses JSONC with trailing commas', () => {
      // Given JSONC with trailing commas (valid in JSONC)
      const jsonc = `{
  "name": "test-project",
  "initialAddresses": ["eth:0x1234567890123456789012345678901234567890"],
  "maxAddresses": 100,
  "maxDepth": 7,
  "sharedModules": [],
}`

      // When parsing from raw JSONC
      const editor = ConfigModel.fromRawJsonc(jsonc)

      // Then it should handle trailing commas gracefully
      expect(editor.peak().name).toEqual('test-project')
    })

    it('parses JSONC with overrides containing comments', () => {
      // Given JSONC with comments in overrides section
      const jsonc = `{
  "name": "test-project",
  "initialAddresses": ["eth:0x1234567890123456789012345678901234567890"],
  "maxAddresses": 100,
  "maxDepth": 7,
  "sharedModules": [],
  "overrides": {
    // Main contract override
    "0xMainContract": {
      "ignoreDiscovery": true, // Skip this contract
      "ignoreMethods": ["deprecated"], // Old methods to ignore
      "ignoreRelatives": [],
      "methods": {},
      "manualSourcePaths": {},
      "types": {},
      "fields": {}
    }
  }
}`

      // When parsing from raw JSONC
      const editor = ConfigModel.fromRawJsonc(jsonc)

      // Then it should parse overrides correctly
      expect(editor.getIgnoreDiscovery('0xMainContract')).toEqual(true)
      // Note: comment-json returns CommentArray which behaves like Array but has different type
      const methods = editor.getIgnoreMethods('0xMainContract')
      expect(Array.isArray(methods)).toEqual(true)
      expect(methods[0]).toEqual('deprecated')
    })
  })

  describe('peak', () => {
    it('returns a snapshot of current config state', () => {
      // Given a config with overrides
      const config = createDiscoveryConfig({
        overrides: {
          '0xAddress1': createContractConfig({
            ignoreDiscovery: true,
            ignoreMethods: ['method1'],
          }),
        },
      })

      // When getting a snapshot
      const editor = ConfigModel.fromPeak(config)
      const snapshot = editor.peak()

      // Then it should return the current state
      expect(snapshot.name).toEqual('test-project')
      expect(snapshot.overrides?.['0xAddress1']?.ignoreDiscovery).toEqual(true)
    })

    it('returns reference to internal state for comment preservation', () => {
      // Given a ConfigModel instance
      const config = createDiscoveryConfig({ maxDepth: 5 })
      const editor = ConfigModel.fromPeak(config)

      // When getting a snapshot
      const snapshot = editor.peak()

      // Then it should return the actual config (not a copy) to preserve comments
      // Note: This is intentional behavior for comment preservation
      expect(snapshot.maxDepth).toEqual(5)
      expect(snapshot.name).toEqual('test-project')
    })

    it('includes all overrides in snapshot', () => {
      // Given a config with multiple overrides
      const config = createDiscoveryConfig({
        overrides: {
          '0xAddress1': createContractConfig(),
          '0xAddress2': createContractConfig({ ignoreDiscovery: true }),
          '0xAddress3': createContractConfig({ ignoreMethods: ['test'] }),
        },
      })

      // When getting a snapshot
      const editor = ConfigModel.fromPeak(config)
      const snapshot = editor.peak()

      // Then all overrides should be present
      expect(Object.keys(snapshot.overrides ?? {})).toEqual([
        '0xAddress1',
        '0xAddress2',
        '0xAddress3',
      ])
    })
  })

  describe('toString', () => {
    it('converts config to formatted JSON string', () => {
      // Given a simple config
      const config = createDiscoveryConfig()

      // When converting to string
      const editor = ConfigModel.fromPeak(config)
      const result = editor.toString()

      // Then it should be valid JSON with proper formatting
      expect(result.includes('"name": "test-project"')).toEqual(true)
      expect(result.includes('"initialAddresses"')).toEqual(true)
    })

    it('preserves comments when parsing and stringifying', () => {
      // Given JSONC with comments
      const jsonc = `{
  // Project name
  "name": "test-project",
  "initialAddresses": ["eth:0x1234567890123456789012345678901234567890"],
  "maxAddresses": 100,
  "maxDepth": 7,
  "sharedModules": []
}`

      // When parsing and converting back to string
      const editor = ConfigModel.fromRawJsonc(jsonc)
      const result = editor.toString()

      // Then comments should be preserved
      expect(result.includes('// Project name')).toEqual(true)
    })

    it('formats nested overrides correctly', () => {
      // Given a config with nested overrides
      const config = createDiscoveryConfig({
        overrides: {
          '0xAddress1': createContractConfig({
            ignoreDiscovery: true,
            ignoreMethods: ['method1', 'method2'],
          }),
        },
      })

      // When converting to string
      const editor = ConfigModel.fromPeak(config)
      const result = editor.toString()

      // Then it should be properly indented
      expect(result.includes('"overrides"')).toEqual(true)
      expect(result.includes('"0xAddress1"')).toEqual(true)
      expect(result.includes('"ignoreMethods"')).toEqual(true)
    })
  })

  describe('ignoreDiscovery management', () => {
    it('sets ignoreDiscovery for existing override', () => {
      // Given a config with an override
      const config = createDiscoveryConfig({
        overrides: {
          '0xAddress1': createContractConfig(),
        },
      })

      // When setting ignoreDiscovery to true
      const editor = ConfigModel.fromPeak(config)
      editor.setIgnoreDiscovery('0xAddress1', true)

      // Then it should be updated
      expect(editor.getIgnoreDiscovery('0xAddress1')).toEqual(true)
    })

    it('does nothing when setting ignoreDiscovery for non-existent override', () => {
      // Given a config without overrides
      const config = createDiscoveryConfig()

      // When setting ignoreDiscovery for non-existent address
      const editor = ConfigModel.fromPeak(config)
      editor.setIgnoreDiscovery('0xNonExistent', true)

      // Then it should not throw and return default value
      expect(editor.getIgnoreDiscovery('0xNonExistent')).toEqual(false)
    })

    it('gets ignoreDiscovery for existing override', () => {
      // Given a config with ignoreDiscovery set
      const config = createDiscoveryConfig({
        overrides: {
          '0xAddress1': createContractConfig({ ignoreDiscovery: true }),
        },
      })

      // When getting ignoreDiscovery
      const editor = ConfigModel.fromPeak(config)
      const result = editor.getIgnoreDiscovery('0xAddress1')

      // Then it should return the correct value
      expect(result).toEqual(true)
    })

    it('returns false for non-existent override', () => {
      // Given a config without the specified override
      const config = createDiscoveryConfig()

      // When getting ignoreDiscovery for non-existent address
      const editor = ConfigModel.fromPeak(config)
      const result = editor.getIgnoreDiscovery('0xNonExistent')

      // Then it should return false as default
      expect(result).toEqual(false)
    })
  })

  describe('ignoreInWatchMode management', () => {
    it('sets ignoreInWatchMode for existing override', () => {
      // Given a config with an override
      const config = createDiscoveryConfig({
        overrides: {
          '0xAddress1': createContractConfig(),
        },
      })

      // When setting ignoreInWatchMode
      const editor = ConfigModel.fromPeak(config)
      editor.setIgnoreInWatchMode('0xAddress1', ['field1', 'field2'])

      // Then it should be updated
      expect(editor.getIgnoreInWatchMode('0xAddress1')).toEqual([
        'field1',
        'field2',
      ])
    })

    it('handles empty array for ignoreInWatchMode', () => {
      // Given a config with ignoreInWatchMode set
      const config = createDiscoveryConfig({
        overrides: {
          '0xAddress1': createContractConfig({
            ignoreInWatchMode: ['field1'],
          }),
        },
      })

      // When setting ignoreInWatchMode to empty array
      const editor = ConfigModel.fromPeak(config)
      editor.setIgnoreInWatchMode('0xAddress1', [])

      // Then it should be cleared
      expect(editor.getIgnoreInWatchMode('0xAddress1')).toEqual([])
    })

    it('returns empty array for non-existent override', () => {
      // Given a config without the specified override
      const config = createDiscoveryConfig()

      // When getting ignoreInWatchMode for non-existent address
      const editor = ConfigModel.fromPeak(config)
      const result = editor.getIgnoreInWatchMode('0xNonExistent')

      // Then it should return empty array as default
      expect(result).toEqual([])
    })
  })

  describe('ignoreMethods management', () => {
    it('sets ignoreMethods for existing override', () => {
      // Given a config with an override
      const config = createDiscoveryConfig({
        overrides: {
          '0xAddress1': createContractConfig(),
        },
      })

      // When setting ignoreMethods
      const editor = ConfigModel.fromPeak(config)
      editor.setIgnoreMethods('0xAddress1', ['method1', 'method2'])

      // Then it should be updated
      expect(editor.getIgnoreMethods('0xAddress1')).toEqual([
        'method1',
        'method2',
      ])
    })

    it('updates existing ignoreMethods', () => {
      // Given a config with ignoreMethods already set
      const config = createDiscoveryConfig({
        overrides: {
          '0xAddress1': createContractConfig({
            ignoreMethods: ['oldMethod'],
          }),
        },
      })

      // When updating ignoreMethods
      const editor = ConfigModel.fromPeak(config)
      editor.setIgnoreMethods('0xAddress1', ['newMethod1', 'newMethod2'])

      // Then it should replace the old values
      expect(editor.getIgnoreMethods('0xAddress1')).toEqual([
        'newMethod1',
        'newMethod2',
      ])
    })

    it('returns empty array for non-existent override', () => {
      // Given a config without the specified override
      const config = createDiscoveryConfig()

      // When getting ignoreMethods for non-existent address
      const editor = ConfigModel.fromPeak(config)
      const result = editor.getIgnoreMethods('0xNonExistent')

      // Then it should return empty array as default
      expect(result).toEqual([])
    })
  })

  describe('ignoreRelatives management', () => {
    it('sets ignoreRelatives for existing override', () => {
      // Given a config with an override
      const config = createDiscoveryConfig({
        overrides: {
          '0xAddress1': createContractConfig(),
        },
      })

      // When setting ignoreRelatives
      const editor = ConfigModel.fromPeak(config)
      editor.setIgnoreRelatives('0xAddress1', ['relative1', 'relative2'])

      // Then it should be updated
      expect(editor.getIgnoreRelatives('0xAddress1')).toEqual([
        'relative1',
        'relative2',
      ])
    })

    it('handles empty array for ignoreRelatives', () => {
      // Given a config with ignoreRelatives set
      const config = createDiscoveryConfig({
        overrides: {
          '0xAddress1': createContractConfig({
            ignoreRelatives: ['relative1'],
          }),
        },
      })

      // When setting ignoreRelatives to empty array
      const editor = ConfigModel.fromPeak(config)
      editor.setIgnoreRelatives('0xAddress1', [])

      // Then it should be cleared
      expect(editor.getIgnoreRelatives('0xAddress1')).toEqual([])
    })

    it('returns empty array for non-existent override', () => {
      // Given a config without the specified override
      const config = createDiscoveryConfig()

      // When getting ignoreRelatives for non-existent address
      const editor = ConfigModel.fromPeak(config)
      const result = editor.getIgnoreRelatives('0xNonExistent')

      // Then it should return empty array as default
      expect(result).toEqual([])
    })
  })

  describe('comments preservation in complex scenarios', () => {
    it('preserves comments when modifying ignoreDiscovery', () => {
      // Given JSONC with detailed comments
      const jsonc = `{
  "name": "test-project",
  "initialAddresses": ["eth:0x1234567890123456789012345678901234567890"],
  "maxAddresses": 100,
  "maxDepth": 7,
  "sharedModules": [],
  "overrides": {
    // Critical contract - handle with care
    "0xAddress1": {
      "ignoreDiscovery": false, // Currently active
      "ignoreMethods": [],
      "ignoreRelatives": [],
      "methods": {},
      "manualSourcePaths": {},
      "types": {},
      "fields": {}
    }
  }
}`

      // When modifying the config
      const editor = ConfigModel.fromRawJsonc(jsonc)
      editor.setIgnoreDiscovery('0xAddress1', true)
      const result = editor.toString()

      // Then comments should be preserved along with the modification
      expect(
        result.includes('// Critical contract - handle with care'),
      ).toEqual(true)
      expect(result.includes('"ignoreDiscovery": true')).toEqual(true)
      expect(result.includes('0xAddress1')).toEqual(true)
    })

    it('preserves comments when modifying arrays', () => {
      // Given JSONC with array comments
      const jsonc = `{
  "name": "test-project",
  "initialAddresses": ["eth:0x1234567890123456789012345678901234567890"],
  "maxAddresses": 100,
  "maxDepth": 7,
  "sharedModules": [],
  "overrides": {
    "0xAddress1": {
      "ignoreDiscovery": false,
      // Methods that should not be called during discovery
      "ignoreMethods": ["deprecated", "legacy"],
      "ignoreRelatives": [],
      "methods": {},
      "manualSourcePaths": {},
      "types": {},
      "fields": {}
    }
  }
}`

      // When modifying the methods array
      const editor = ConfigModel.fromRawJsonc(jsonc)
      editor.setIgnoreMethods('0xAddress1', [
        'deprecated',
        'legacy',
        'obsolete',
      ])
      const result = editor.toString()

      // Then comments should be preserved
      expect(
        result.includes(
          '// Methods that should not be called during discovery',
        ),
      ).toEqual(true)
    })

    it('maintains structure with multiple commented overrides', () => {
      // Given JSONC with multiple commented sections
      const jsonc = `{
  "name": "test-project",
  "initialAddresses": ["eth:0x1234567890123456789012345678901234567890"],
  "maxAddresses": 100,
  "maxDepth": 7,
  "sharedModules": [],
  "overrides": {
    /* 
     * Main contracts 
     */
    "0xMainContract": {
      "ignoreDiscovery": false,
      "ignoreMethods": [],
      "ignoreRelatives": [],
      "methods": {},
      "manualSourcePaths": {},
      "types": {},
      "fields": {}
    },
    // Secondary contract
    "0xSecondary": {
      "ignoreDiscovery": true, // Deprecated
      "ignoreMethods": [],
      "ignoreRelatives": [],
      "methods": {},
      "manualSourcePaths": {},
      "types": {},
      "fields": {}
    }
  }
}`

      // When parsing and converting back
      const editor = ConfigModel.fromRawJsonc(jsonc)
      const result = editor.toString()

      // Then all comments should be preserved
      expect(result.includes('Main contracts')).toEqual(true)
      expect(result.includes('// Secondary contract')).toEqual(true)
      expect(result.includes('// Deprecated')).toEqual(true)
      expect(result.includes('0xMainContract')).toEqual(true)
      expect(result.includes('0xSecondary')).toEqual(true)
    })
  })
})

describe('ContractConfigModel', () => {
  describe('constructor and initialization', () => {
    it('creates instance with minimal config', () => {
      // Given a minimal contract config
      const config = createContractConfig()

      // When creating a ContractConfigModel instance
      const editor = new ContractConfigModel(config)

      // Then it should initialize successfully
      expect(editor.peak().ignoreDiscovery).toEqual(false)
    })

    it('creates instance with full config', () => {
      // Given a complete contract config
      const config = createContractConfig({
        ignoreDiscovery: true,
        ignoreMethods: ['method1', 'method2'],
        ignoreRelatives: ['relative1'],
        ignoreInWatchMode: ['field1'],
      })

      // When creating a ContractConfigModel instance
      const editor = new ContractConfigModel(config)

      // Then all properties should be accessible
      expect(editor.getIgnoreDiscovery()).toEqual(true)
      expect(editor.getIgnoreMethods()).toEqual(['method1', 'method2'])
      expect(editor.getIgnoreRelatives()).toEqual(['relative1'])
      expect(editor.getIgnoreInWatchMode()).toEqual(['field1'])
    })
  })

  describe('fromRawJsonc', () => {
    it('parses valid JSONC without comments', () => {
      // Given valid JSONC contract config
      const jsonc = `{
  "ignoreDiscovery": true,
  "ignoreMethods": ["test"],
  "ignoreRelatives": [],
  "methods": {},
  "manualSourcePaths": {},
  "types": {},
  "fields": {}
}`

      // When parsing from raw JSONC
      const editor = ContractConfigModel.fromRawJsonc(jsonc)

      // Then it should create a valid ContractConfigModel
      expect(editor.getIgnoreDiscovery()).toEqual(true)
      // Note: comment-json returns CommentArray which behaves like Array but has different type
      const methods = editor.getIgnoreMethods()
      expect(Array.isArray(methods)).toEqual(true)
      expect(methods[0]).toEqual('test')
    })

    it('parses JSONC with comments', () => {
      // Given JSONC with comments
      const jsonc = `{
  // Ignore this contract in discovery
  "ignoreDiscovery": true,
  // Methods to skip
  "ignoreMethods": ["deprecated", "legacy"],
  "ignoreRelatives": [],
  "methods": {},
  "manualSourcePaths": {},
  "types": {},
  "fields": {}
}`

      // When parsing from raw JSONC
      const editor = ContractConfigModel.fromRawJsonc(jsonc)

      // Then it should parse correctly
      expect(editor.getIgnoreDiscovery()).toEqual(true)
      // Note: comment-json returns CommentArray which behaves like Array but has different type
      const methods = editor.getIgnoreMethods()
      expect(Array.isArray(methods)).toEqual(true)
      expect(methods.length).toEqual(2)
      expect(methods[0]).toEqual('deprecated')
      expect(methods[1]).toEqual('legacy')
    })
  })

  describe('peak', () => {
    it('returns the current config state', () => {
      // Given a contract config
      const config = createContractConfig({
        ignoreDiscovery: true,
        ignoreMethods: ['test'],
        ignoreRelatives: ['rel1'],
      })

      // When getting a snapshot
      const editor = new ContractConfigModel(config)
      const snapshot = editor.peak()

      // Then it should return the current state
      expect(snapshot.ignoreDiscovery).toEqual(true)
      expect(snapshot.ignoreMethods).toEqual(['test'])
      expect(snapshot.ignoreRelatives).toEqual(['rel1'])
    })
  })

  describe('toString', () => {
    it('converts config to formatted JSON string', () => {
      // Given a contract config
      const config = createContractConfig({
        ignoreDiscovery: true,
        ignoreMethods: ['method1'],
      })

      // When converting to string
      const editor = new ContractConfigModel(config)
      const result = editor.toString()

      // Then it should be valid JSON
      expect(result.includes('"ignoreDiscovery": true')).toEqual(true)
      expect(result.includes('"ignoreMethods"')).toEqual(true)
    })

    it('preserves comments when stringifying', () => {
      // Given JSONC with comments
      const jsonc = `{
  // Important flag
  "ignoreDiscovery": true,
  "ignoreMethods": [],
  "ignoreRelatives": [],
  "methods": {},
  "manualSourcePaths": {},
  "types": {},
  "fields": {}
}`

      // When parsing and converting back to string
      const editor = ContractConfigModel.fromRawJsonc(jsonc)
      const result = editor.toString()

      // Then comments should be preserved
      expect(result.includes('// Important flag')).toEqual(true)
    })
  })

  describe('setIgnoreDiscovery', () => {
    it('sets ignoreDiscovery to true', () => {
      // Given a contract config with ignoreDiscovery false
      const config = createContractConfig()

      // When setting ignoreDiscovery to true
      const editor = new ContractConfigModel(config)
      editor.setIgnoreDiscovery(true)

      // Then it should be updated
      expect(editor.getIgnoreDiscovery()).toEqual(true)
    })

    it('removes ignoreDiscovery when set to false', () => {
      // Given a contract config with ignoreDiscovery true
      const config = createContractConfig({ ignoreDiscovery: true })

      // When setting ignoreDiscovery to false
      const editor = new ContractConfigModel(config)
      editor.setIgnoreDiscovery(false)

      // Then the value is removed (set to undefined which cleans up the config)
      // Note: getIgnoreDiscovery will return the actual value from the config
      const snapshot = editor.peak()
      expect(snapshot.ignoreDiscovery === undefined).toEqual(true)
    })

    it('preserves other properties when updating ignoreDiscovery', () => {
      // Given a contract config with multiple properties
      const config = createContractConfig({
        ignoreMethods: ['method1'],
        ignoreRelatives: ['rel1'],
      })

      // When setting ignoreDiscovery
      const editor = new ContractConfigModel(config)
      editor.setIgnoreDiscovery(true)

      // Then other properties should remain unchanged
      expect(editor.getIgnoreMethods()).toEqual(['method1'])
      expect(editor.getIgnoreRelatives()).toEqual(['rel1'])
    })
  })

  describe('setIgnoreInWatchMode', () => {
    it('sets ignoreInWatchMode with non-empty array', () => {
      // Given a contract config
      const config = createContractConfig()

      // When setting ignoreInWatchMode
      const editor = new ContractConfigModel(config)
      editor.setIgnoreInWatchMode(['field1', 'field2'])

      // Then it should be updated
      expect(editor.getIgnoreInWatchMode()).toEqual(['field1', 'field2'])
    })

    it('removes ignoreInWatchMode when set to empty array', () => {
      // Given a contract config with ignoreInWatchMode set
      const config = createContractConfig({
        ignoreInWatchMode: ['field1'],
      })

      // When setting ignoreInWatchMode to empty array
      const editor = new ContractConfigModel(config)
      editor.setIgnoreInWatchMode([])

      // Then the array is removed (set to undefined which cleans up the config)
      const snapshot = editor.peak()
      expect(snapshot.ignoreInWatchMode === undefined).toEqual(true)
    })

    it('replaces existing ignoreInWatchMode values', () => {
      // Given a contract config with ignoreInWatchMode already set
      const config = createContractConfig({
        ignoreInWatchMode: ['oldField'],
      })

      // When updating ignoreInWatchMode
      const editor = new ContractConfigModel(config)
      editor.setIgnoreInWatchMode(['newField1', 'newField2'])

      // Then it should replace old values
      expect(editor.getIgnoreInWatchMode()).toEqual(['newField1', 'newField2'])
    })
  })

  describe('setIgnoreMethods', () => {
    it('sets ignoreMethods with non-empty array', () => {
      // Given a contract config
      const config = createContractConfig()

      // When setting ignoreMethods
      const editor = new ContractConfigModel(config)
      editor.setIgnoreMethods(['method1', 'method2'])

      // Then it should be updated
      expect(editor.getIgnoreMethods()).toEqual(['method1', 'method2'])
    })

    it('removes ignoreMethods when set to empty array', () => {
      // Given a contract config with ignoreMethods set
      const config = createContractConfig({
        ignoreMethods: ['method1'],
      })

      // When setting ignoreMethods to empty array
      const editor = new ContractConfigModel(config)
      editor.setIgnoreMethods([])

      // Then the array is removed (set to undefined which cleans up the config)
      const snapshot = editor.peak()
      expect(snapshot.ignoreMethods === undefined).toEqual(true)
    })

    it('handles special method names', () => {
      // Given a contract config
      const config = createContractConfig()

      // When setting ignoreMethods with special names
      const editor = new ContractConfigModel(config)
      editor.setIgnoreMethods(['_internal', '__private', 'fallback'])

      // Then it should handle them correctly
      expect(editor.getIgnoreMethods()).toEqual([
        '_internal',
        '__private',
        'fallback',
      ])
    })
  })

  describe('setIgnoreRelatives', () => {
    it('sets ignoreRelatives with non-empty array', () => {
      // Given a contract config
      const config = createContractConfig()

      // When setting ignoreRelatives
      const editor = new ContractConfigModel(config)
      editor.setIgnoreRelatives(['relative1', 'relative2'])

      // Then it should be updated
      expect(editor.getIgnoreRelatives()).toEqual(['relative1', 'relative2'])
    })

    it('removes ignoreRelatives when set to empty array', () => {
      // Given a contract config with ignoreRelatives set
      const config = createContractConfig({
        ignoreRelatives: ['relative1'],
      })

      // When setting ignoreRelatives to empty array
      const editor = new ContractConfigModel(config)
      editor.setIgnoreRelatives([])

      // Then the array is removed (set to undefined which cleans up the config)
      const snapshot = editor.peak()
      expect(snapshot.ignoreRelatives === undefined).toEqual(true)
    })
  })

  describe('getters with default values', () => {
    it('getIgnoreDiscovery returns actual value when set', () => {
      // Given a contract config with ignoreDiscovery true
      const config = createContractConfig({ ignoreDiscovery: true })

      // When getting ignoreDiscovery
      const editor = new ContractConfigModel(config)
      const result = editor.getIgnoreDiscovery()

      // Then it should return the set value
      expect(result).toEqual(true)
    })

    it('getIgnoreInWatchMode returns empty array when undefined', () => {
      // Given a contract config without ignoreInWatchMode
      const config = createContractConfig()

      // When getting ignoreInWatchMode
      const editor = new ContractConfigModel(config)
      const result = editor.getIgnoreInWatchMode()

      // Then it should return empty array as default
      expect(result).toEqual([])
    })

    it('getIgnoreRelatives returns empty array when undefined', () => {
      // Given a contract config without ignoreRelatives
      const config = createContractConfig()

      // When getting ignoreRelatives
      const editor = new ContractConfigModel(config)
      const result = editor.getIgnoreRelatives()

      // Then it should return empty array as default
      expect(result).toEqual([])
    })
  })

  describe('comment preservation during modifications', () => {
    it('preserves inline comments when modifying values', () => {
      // Given JSONC with inline comments
      const jsonc = `{
  "ignoreDiscovery": false, // Active contract
  "ignoreMethods": ["old"], // Deprecated methods
  "ignoreRelatives": [],
  "methods": {},
  "manualSourcePaths": {},
  "types": {},
  "fields": {}
}`

      // When modifying values
      const editor = ContractConfigModel.fromRawJsonc(jsonc)
      editor.setIgnoreMethods(['new'])
      const result = editor.toString()

      // Then inline comments should be preserved
      expect(result.includes('// Active contract')).toEqual(true)
      expect(result.includes('// Deprecated methods')).toEqual(true)
    })

    it('preserves block comments when modifying values', () => {
      // Given JSONC with block comments
      const jsonc = `{
  /* 
   * Discovery settings for this contract
   */
  "ignoreDiscovery": false,
  "ignoreMethods": [],
  "ignoreRelatives": [],
  "methods": {},
  "manualSourcePaths": {},
  "types": {},
  "fields": {}
}`

      // When modifying values
      const editor = ContractConfigModel.fromRawJsonc(jsonc)
      editor.setIgnoreDiscovery(true)
      const result = editor.toString()

      // Then block comments should be preserved
      expect(result.includes('Discovery settings for this contract')).toEqual(
        true,
      )
    })

    it('maintains comment structure after multiple modifications', () => {
      // Given JSONC with multiple comments
      const jsonc = `{
  // Main flag
  "ignoreDiscovery": false,
  // Method list
  "ignoreMethods": [],
  // Relative list
  "ignoreRelatives": [],
  "methods": {},
  "manualSourcePaths": {},
  "types": {},
  "fields": {}
}`

      // When making multiple modifications
      const editor = ContractConfigModel.fromRawJsonc(jsonc)
      editor.setIgnoreDiscovery(true)
      editor.setIgnoreMethods(['method1'])
      editor.setIgnoreRelatives(['rel1'])
      const result = editor.toString()

      // Then all comments should be preserved
      expect(result.includes('// Main flag')).toEqual(true)
      expect(result.includes('// Method list')).toEqual(true)
      expect(result.includes('// Relative list')).toEqual(true)
    })
  })
})
