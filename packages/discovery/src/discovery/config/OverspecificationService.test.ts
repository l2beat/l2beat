import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DiscoveryOutput } from '../output/types'
import type { ConfigReader } from './ConfigReader'
import { OverspecificationService } from './OverspecificationService'

describe('OverspecificationService', () => {
  const mockConfigReader = mockObject<ConfigReader>({
    readDiscovery: mockFn(),
    readConfig: mockFn(),
    readAllDiscoveredProjects: mockFn(),
  })

  const service = new OverspecificationService(mockConfigReader)

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
})
