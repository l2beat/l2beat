import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { DiscoveryContractField } from '../config/RawDiscoveryConfig'
import {
  ContractMeta,
  getTargetsMeta,
  mergeContractMeta,
  mergePermissions,
} from './metaUtils'

describe.only('metaUtils', () => {
  describe('mergeContractMeta', () => {
    it('should merge two ContractMeta objects correctly', () => {
      const a: ContractMeta = {
        descriptions: ['description 1'],
        roles: new Set(['Challenger', 'Guardian']),
        permissions: {
          owner: new Set(['0x1234', '0x5678'].map(EthereumAddress.from)),
        },
        categories: new Set(['Gateways&Escrows', 'Core']),
        types: new Set(['CODE_CHANGE', 'EXTERNAL']),
        severity: 'LOW',
      }
      const b: ContractMeta = {
        descriptions: ['description 2', 'description 3'],
        roles: new Set(['Proposer', 'Challenger']),
        permissions: {
          owner: new Set(['0xabcd', '0x1234'].map(EthereumAddress.from)),
          admin: new Set(['0x1234'].map(EthereumAddress.from)),
        },
        categories: new Set(['Upgrades&Governance', 'Core']),
        types: new Set(['PERMISSION', 'L2', 'EXTERNAL']),
        severity: 'MEDIUM',
      }

      const result = mergeContractMeta(a, b)

      expect(result).toEqual({
        descriptions: ['description 1', 'description 2', 'description 3'],
        roles: new Set(['Challenger', 'Guardian', 'Proposer']),
        permissions: {
          owner: new Set(
            ['0x1234', '0x5678', '0xabcd'].map(EthereumAddress.from),
          ),
          admin: new Set(['0x1234'].map(EthereumAddress.from)),
        },
        categories: new Set([
          'Gateways&Escrows',
          'Core',
          'Upgrades&Governance',
        ]),
        types: new Set(['CODE_CHANGE', 'EXTERNAL', 'L2', 'PERMISSION']),
        severity: 'MEDIUM',
      })
    })
  })

  describe('mergePermissions', () => {
    it('should merge two permission objects correctly', () => {
      const a: ContractMeta['permissions'] = {
        owner: new Set(['0x1234', '0x5678'].map(EthereumAddress.from)),
        act: new Set(['0x5678'].map(EthereumAddress.from)),
      }
      const b: ContractMeta['permissions'] = {
        owner: new Set(['0xabcd', '0x1234'].map(EthereumAddress.from)),
        admin: new Set(['0x1234'].map(EthereumAddress.from)),
      }

      const result = mergePermissions(a, b)

      expect(result).toEqual({
        owner: new Set(
          ['0x1234', '0x5678', '0xabcd'].map(EthereumAddress.from),
        ),
        admin: new Set(['0x1234'].map(EthereumAddress.from)),
        act: new Set(['0x5678'].map(EthereumAddress.from)),
      })
    })
  })

  describe('getTargetsMeta', () => {
    it('should gather meta from handler result', () => {
      const handlerResults = [
        {
          field: 'overhead',
          value: 0,
        },
        {
          field: 'owner',
          value: '0xC72aE5c7cc9a332699305E29F68Be66c73b60542',
        },
        {
          field: 'resourceConfig',
          value: [
            20000000,
            10,
            '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf',
            8,
            1000000000,
            '0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf',
            1000000,
            '340282366920938463463374607431768211455',
          ],
        },
        {
          field: 'scalar',
          value:
            '452312848583266388373324160190187140051835877600158453279133909097067335200',
        },
      ]

      const fields: { [address: string]: DiscoveryContractField } = {
        overhead: {
          target: {
            description: 'The overhead of the contract',
            role: 'Challenger',
            permission: 'owner',
            category: 'Core',
          },
          severity: 'LOW',
          type: 'CODE_CHANGE',
        },
        owner: {
          target: {
            description: 'The owner of the contract',
            role: 'Challenger',
            permission: 'owner',
            category: 'Core',
          },
          severity: 'LOW',
          type: 'CODE_CHANGE',
        },
        resourceConfig: {
          target: {
            description: 'The resource config of the contract',
            role: ['Guardian', 'Challenger'],
            permission: ['admin', 'owner'],
            category: ['Gateways&Escrows', 'Core'],
          },
          severity: 'HIGH',
          type: ['L2', 'EXTERNAL'],
        },
        scalar: {
          target: {
            description: 'The scalar of the contract',
            role: 'Challenger',
            permission: 'owner',
            category: 'Core',
          },
          severity: 'LOW',
          type: 'CODE_CHANGE',
        },
      }

      const selfAddress = EthereumAddress.from('0x1234')
      const result = getTargetsMeta(selfAddress, handlerResults, fields)

      expect(result).toEqual({
        '0xC72aE5c7cc9a332699305E29F68Be66c73b60542': {
          descriptions: ['The owner of the contract'],
          roles: new Set(['Challenger']),
          permissions: {
            owner: new Set([selfAddress]),
          },
          categories: new Set(['Core']),
          severity: 'LOW',
          types: new Set(['CODE_CHANGE']),
        },
        '0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf': {
          categories: new Set(['Core', 'Gateways&Escrows']),
          descriptions: ['The resource config of the contract'],
          permissions: {
            owner: new Set([selfAddress]),
            admin: new Set([selfAddress]),
          },
          roles: new Set(['Challenger', 'Guardian']),
          severity: 'HIGH',
          types: new Set(['EXTERNAL', 'L2']),
        },
        '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf': {
          categories: new Set(['Core', 'Gateways&Escrows']),
          descriptions: ['The resource config of the contract'],
          permissions: {
            owner: new Set([selfAddress]),
            admin: new Set([selfAddress]),
          },
          roles: new Set(['Challenger', 'Guardian']),
          severity: 'HIGH',
          types: new Set(['EXTERNAL', 'L2']),
        },
      })
    })
  })
})
