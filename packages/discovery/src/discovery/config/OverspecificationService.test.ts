import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { TemplateService } from '../analysis/TemplateService'
import type { DiscoveryOutput } from '../output/types'
import type { ConfigReader } from './ConfigReader'
import type { ConfigRegistry } from './ConfigRegistry'
import { OverspecificationService } from './OverspecificationService'
import type { StructureContract } from './StructureConfig'

describe('OverspecificationService', () => {
  const mockConfigReader = mockObject<ConfigReader>({
    readDiscovery: mockFn(),
    readConfig: mockFn(),
    readAllDiscoveredProjects: mockFn(),
  })

  const mockTemplateService = mockObject<TemplateService>({
    loadContractTemplate: mockFn(),
    listAllTemplates: mockFn(),
  })

  const service = new OverspecificationService(
    mockConfigReader,
    mockTemplateService,
  )

  describe('checkConfigOverspecification', () => {
    it('detects overspecified methods that do not exist in ABI or values', () => {
      const address = ChainSpecificAddress.random()
      const implementation = ChainSpecificAddress.random()

      const mockDiscovery: DiscoveryOutput = {
        name: 'test-project',
        blockNumber: 12345,
        timestamp: Date.now(),
        configHash: Hash256.random(),
        usedTemplates: {},
        usedBlockNumbers: {},
        entries: [
          {
            type: 'Contract',
            address,
            values: {
              $implementation: implementation,
              validMethod: 'value',
              anotherValidMethod: 123,
            },
          },
        ],
        abis: {
          [address.toString()]: [
            'function transfer(address to, uint256 amount)',
            'function balanceOf(address account) view returns (uint256)',
          ],
          [implementation.toString()]: [
            'function approve(address spender, uint256 amount)',
          ],
        },
      }

      mockConfigReader.readDiscovery.returns(mockDiscovery)

      const result = service.checkConfigOverspecification(
        'test-project',
        address,
        {
          ignoreInWatchMode: ['thisMethodDefinitelyDoesNotExist', 'transfer'],
          ignoreMethods: ['nonExistentMethod'],
          ignoreRelatives: ['approve', 'missingMethod'],
        },
      )

      expect(result.ignoreInWatchMode).toEqual([
        'thisMethodDefinitelyDoesNotExist',
      ])
      expect(result.ignoreMethods).toEqual(['nonExistentMethod'])
      expect(result.ignoreRelatives).toEqual(['missingMethod'])
    })

    it('returns empty arrays when all methods are valid', () => {
      const address = ChainSpecificAddress.random()

      const mockDiscovery: DiscoveryOutput = {
        name: 'test-project',
        blockNumber: 12345,
        timestamp: Date.now(),
        configHash: Hash256.random(),
        usedTemplates: {},
        usedBlockNumbers: {},
        entries: [
          {
            type: 'Contract',
            address,
            values: {
              validMethod: 'value',
              anotherValidMethod: 123,
            },
          },
        ],
        abis: {
          [address.toString()]: [
            'function transfer(address to, uint256 amount)',
            'function balanceOf(address account) view returns (uint256)',
          ],
        },
      }

      mockConfigReader.readDiscovery.returns(mockDiscovery)

      const result = service.checkConfigOverspecification(
        'test-project',
        address,
        {
          ignoreInWatchMode: ['transfer', 'validMethod'],
          ignoreMethods: ['balanceOf'],
          ignoreRelatives: ['anotherValidMethod'],
        },
      )

      expect(result.ignoreInWatchMode).toEqual([])
      expect(result.ignoreMethods).toEqual([])
      expect(result.ignoreRelatives).toEqual([])
    })

    it('throws error when entry address not found', () => {
      const address = ChainSpecificAddress.random()
      const otherAddress = ChainSpecificAddress.random()

      const mockDiscovery: DiscoveryOutput = {
        name: 'test-project',
        blockNumber: 12345,
        timestamp: Date.now(),
        configHash: Hash256.random(),
        usedTemplates: {},
        usedBlockNumbers: {},
        entries: [
          {
            type: 'Contract',
            address: otherAddress,
            values: {},
          },
        ],
        abis: {},
      }

      mockConfigReader.readDiscovery.returns(mockDiscovery)

      expect(() =>
        service.checkConfigOverspecification('test-project', address, {}),
      ).toThrow('Entry with address')
    })
  })

  describe('checkAllConfigOverrides', () => {
    it('returns only entries with overspecified methods', () => {
      const address1 = ChainSpecificAddress(
        'eth:0x1111111111111111111111111111111111111111',
      )
      const address2 = ChainSpecificAddress(
        'eth:0x2222222222222222222222222222222222222222',
      )

      const mockConfig = {
        name: 'test-project',
        structure: {
          overrides: {
            [address1.toString()]: {
              ignoreInWatchMode: ['nonExistentMethod'],
              ignoreMethods: ['validMethod'],
              ignoreRelatives: [],
            },
            [address2.toString()]: {
              ignoreInWatchMode: ['transfer'],
              ignoreMethods: [],
              ignoreRelatives: [],
            },
          },
        },
      } as unknown as ConfigRegistry

      const mockDiscovery: DiscoveryOutput = {
        name: 'test-project',
        blockNumber: 12345,
        timestamp: Date.now(),
        configHash: Hash256.random(),
        usedTemplates: {},
        usedBlockNumbers: {},
        entries: [
          {
            type: 'Contract',
            address: address1,
            values: { validMethod: 'value' },
          },
          {
            type: 'Contract',
            address: address2,
            values: {},
          },
        ],
        abis: {
          [address1.toString()]: [],
          [address2.toString()]: [
            'function transfer(address to, uint256 amount)',
          ],
        },
      }

      mockConfigReader.readConfig.returns(mockConfig)
      mockConfigReader.readDiscovery.returns(mockDiscovery)

      const results = service.checkAllConfigOverrides('test-project')

      expect(results).toHaveLength(1)
      expect(results[0]?.address).toEqual(address1.toString())
      expect(results[0]?.overspecified.ignoreInWatchMode).toEqual([
        'nonExistentMethod',
      ])
      expect(results[0]?.overspecified.ignoreMethods).toEqual([])
      expect(results[0]?.overspecified.ignoreRelatives).toEqual([])
    })

    it('returns empty array when no overspecified methods found', () => {
      const address = ChainSpecificAddress.random()

      const mockConfig = {
        name: 'test-project',
        structure: {
          overrides: {
            [address.toString()]: {
              ignoreInWatchMode: ['validMethod'],
              ignoreMethods: [],
              ignoreRelatives: [],
            },
          },
        },
      } as unknown as ConfigRegistry

      const mockDiscovery: DiscoveryOutput = {
        name: 'test-project',
        blockNumber: 12345,
        timestamp: Date.now(),
        configHash: Hash256.random(),
        usedTemplates: {},
        usedBlockNumbers: {},
        entries: [
          {
            type: 'Contract',
            address,
            values: { validMethod: 'value' },
          },
        ],
        abis: {
          [address.toString()]: [],
        },
      }

      mockConfigReader.readConfig.returns(mockConfig)
      mockConfigReader.readDiscovery.returns(mockDiscovery)

      const results = service.checkAllConfigOverrides('test-project')

      expect(results).toEqual([])
    })
  })

  describe('checkTemplateOverspecification', () => {
    it('detects overspecified methods in templates', () => {
      const address = ChainSpecificAddress.random()

      mockConfigReader.readAllDiscoveredProjects.returns(['project1'])

      const mockDiscovery: DiscoveryOutput = {
        name: 'project1',
        blockNumber: 12345,
        timestamp: Date.now(),
        configHash: Hash256.random(),
        usedTemplates: {},
        usedBlockNumbers: {},
        entries: [
          {
            type: 'Contract',
            address,
            template: 'test-template',
            values: { validMethod: 'value' },
          },
        ],
        abis: {
          [address.toString()]: [
            'function transfer(address to, uint256 amount)',
            'function approve(address spender, uint256 amount)',
          ],
        },
      }

      mockConfigReader.readDiscovery.returns(mockDiscovery)

      const result = service.checkTemplateOverspecification('test-template', {
        ignoreInWatchMode: ['thisMethodDefinitelyDoesNotExist', 'transfer'],
        ignoreMethods: ['validMethod', 'nonExistent'],
        ignoreRelatives: [],
      })

      expect(result.ignoreInWatchMode).toEqual([
        'thisMethodDefinitelyDoesNotExist',
      ])
      expect(result.ignoreMethods).toEqual(['nonExistent'])
      expect(result.ignoreRelatives).toEqual([])
    })
  })

  describe('checkTemplateFile', () => {
    it('checks template file for overspecified methods', () => {
      const address = ChainSpecificAddress.random()

      const template = mockObject<StructureContract>({
        ignoreInWatchMode: ['nonExistentMethod'],
        ignoreMethods: ['transfer'],
        ignoreRelatives: [],
      })

      mockTemplateService.loadContractTemplate.returns(template)

      mockConfigReader.readAllDiscoveredProjects.returns(['project1'])

      const mockDiscovery: DiscoveryOutput = {
        name: 'project1',
        blockNumber: 12345,
        timestamp: Date.now(),
        configHash: Hash256.random(),
        usedTemplates: {},
        usedBlockNumbers: {},
        entries: [
          {
            type: 'Contract',
            address,
            template: 'test-template',
            values: {},
          },
        ],
        abis: {
          [address.toString()]: [
            'function transfer(address to, uint256 amount)',
          ],
        },
      }

      mockConfigReader.readDiscovery.returns(mockDiscovery)

      const result = service.checkTemplateFile('test-template')

      expect(result.templateId).toEqual('test-template')
      expect(result.overspecified.ignoreInWatchMode).toEqual([
        'nonExistentMethod',
      ])
      expect(result.overspecified.ignoreMethods).toEqual([])
      expect(result.overspecified.ignoreRelatives).toEqual([])
    })
  })

  describe('checkAllTemplates', () => {
    it('returns only templates with overspecified methods', () => {
      const address1 = ChainSpecificAddress.random()
      const address2 = ChainSpecificAddress.random()

      mockTemplateService.listAllTemplates.returns({
        template1: { shapePath: undefined },
        template2: { shapePath: undefined },
      })

      const firstTemplate = mockObject<StructureContract>({
        ignoreInWatchMode: ['nonExistentMethod'],
        ignoreMethods: [],
        ignoreRelatives: [],
      })

      const secondTemplate = mockObject<StructureContract>({
        ignoreInWatchMode: ['transfer'],
        ignoreMethods: [],
        ignoreRelatives: [],
      })

      mockTemplateService.loadContractTemplate
        .returnsOnce(firstTemplate)
        .returnsOnce(secondTemplate)

      mockConfigReader.readAllDiscoveredProjects.returns(['project1'])

      mockConfigReader.readDiscovery
        .returnsOnce({
          name: 'project1',
          blockNumber: 12345,
          timestamp: Date.now(),
          configHash: Hash256.random(),
          usedTemplates: {},
          usedBlockNumbers: {},
          entries: [
            {
              type: 'Contract',
              address: address1,
              template: 'template1',
              values: {},
            },
          ],
          abis: { [address1.toString()]: [] },
        })
        .returnsOnce({
          name: 'project1',
          blockNumber: 12345,
          timestamp: Date.now(),
          configHash: Hash256.random(),
          usedTemplates: {},
          usedBlockNumbers: {},
          entries: [
            {
              type: 'Contract',
              address: address2,
              template: 'template2',
              values: {},
            },
          ],
          abis: {
            [address2.toString()]: [
              'function transfer(address to, uint256 amount)',
            ],
          },
        })

      const results = service.checkAllTemplates()

      expect(results).toHaveLength(1)
      expect(results[0]?.templateId).toEqual('template1')
      expect(results[0]?.overspecified.ignoreInWatchMode).toEqual([
        'nonExistentMethod',
      ])
    })

    it('returns empty array when no templates have overspecified methods', () => {
      const address = ChainSpecificAddress.random()

      mockTemplateService.listAllTemplates.returns({
        template1: { shapePath: undefined },
      })

      const template = mockObject<StructureContract>({
        ignoreInWatchMode: ['transfer'],
        ignoreMethods: [],
        ignoreRelatives: [],
      })

      mockTemplateService.loadContractTemplate.returns(template)

      mockConfigReader.readAllDiscoveredProjects.returns(['project1'])

      mockConfigReader.readDiscovery.returns({
        name: 'project1',
        blockNumber: 12345,
        timestamp: Date.now(),
        configHash: Hash256.random(),
        usedTemplates: {},
        usedBlockNumbers: {},
        entries: [
          {
            type: 'Contract',
            address,
            template: 'template1',
            values: {},
          },
        ],
        abis: {
          [address.toString()]: [
            'function transfer(address to, uint256 amount)',
          ],
        },
      })

      const results = service.checkAllTemplates()

      expect(results).toEqual([])
    })
  })
})
