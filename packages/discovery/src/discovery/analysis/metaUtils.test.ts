import { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  DiscoveryContractField,
  PermissionConfiguration,
} from '../config/RawDiscoveryConfig'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import { AnalyzedContract, ExtendedTemplate } from './AddressAnalyzer'
import {
  ContractMeta,
  findHighestSeverity,
  getMetaFromUpgradeability,
  getTargetsMeta,
  interpolateDescription,
  invertMeta,
  mergeContractMeta,
  mergePermissions,
} from './metaUtils'

describe('metaUtils', () => {
  describe('mergeContractMeta', () => {
    it('should merge two ContractMeta objects correctly', () => {
      const a: ContractMeta = {
        displayName: 'ContractA',
        descriptions: ['description 1'],
        roles: new Set(['Challenger', 'Guardian']),
        permissions: [
          {
            type: 'configure',
            delay: 0,
            target: EthereumAddress.from('0x1234'),
          },
          {
            type: 'configure',
            delay: 0,
            target: EthereumAddress.from('0x5678'),
          },
        ],
        categories: new Set(['Gateways&Escrows', 'Core']),
        types: new Set(['CODE_CHANGE', 'EXTERNAL']),
        severity: 'LOW',
      }
      const b: ContractMeta = {
        displayName: undefined,
        descriptions: ['description 2', 'description 3'],
        roles: new Set(['Proposer', 'Challenger']),
        permissions: [
          {
            type: 'configure',
            delay: 0,
            target: EthereumAddress.from('0xabcd'),
          },
          {
            type: 'configure',
            delay: 0,
            target: EthereumAddress.from('0x1234'),
          },
          { type: 'upgrade', delay: 0, target: EthereumAddress.from('0x1234') },
        ],
        categories: new Set(['Upgrades&Governance', 'Core']),
        types: new Set(['PERMISSION', 'L2', 'EXTERNAL']),
        severity: 'MEDIUM',
      }

      const result = mergeContractMeta(a, b)

      expect(result).toEqual({
        displayName: 'ContractA',
        descriptions: ['description 1', 'description 2', 'description 3'],
        roles: new Set(['Challenger', 'Guardian', 'Proposer']),
        permissions: [
          {
            type: 'configure',
            delay: 0,
            target: EthereumAddress.from('0x1234'),
          },
          {
            type: 'configure',
            delay: 0,
            target: EthereumAddress.from('0x5678'),
          },
          {
            type: 'configure',
            delay: 0,
            target: EthereumAddress.from('0xabcd'),
          },
          { type: 'upgrade', delay: 0, target: EthereumAddress.from('0x1234') },
        ],
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
      const a: PermissionConfiguration[] = [
        { type: 'configure', delay: 0, target: EthereumAddress.from('0x1234') },
        { type: 'configure', delay: 0, target: EthereumAddress.from('0x5678') },
        { type: 'act', delay: 0, target: EthereumAddress.from('0x5678') },
      ]
      const b: PermissionConfiguration[] = [
        { type: 'configure', delay: 0, target: EthereumAddress.from('0xabcd') },
        { type: 'configure', delay: 0, target: EthereumAddress.from('0x1234') },
        { type: 'upgrade', delay: 15, target: EthereumAddress.from('0x1234') },
      ]

      expect(mergePermissions(a, b)).toEqual([
        { type: 'configure', delay: 0, target: EthereumAddress.from('0x1234') },
        { type: 'configure', delay: 0, target: EthereumAddress.from('0x5678') },
        { type: 'act', delay: 0, target: EthereumAddress.from('0x5678') },
        { type: 'configure', delay: 0, target: EthereumAddress.from('0xabcd') },
        { type: 'upgrade', delay: 15, target: EthereumAddress.from('0x1234') },
      ])
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

      const selfAddress = EthereumAddress.from('0x1234')
      const fields: { [address: string]: DiscoveryContractField } = {
        overhead: {
          target: {
            role: 'Challenger',
            permissions: [{ type: 'configure', delay: 0 }],
            category: 'Core',
          },
          severity: 'LOW',
          type: 'CODE_CHANGE',
        },
        owner: {
          target: {
            role: 'Challenger',
            permissions: [
              {
                type: 'configure',
                delay: 0,
                description:
                  'configuring the {{ $.address }} allows to change this number: {{ numberField }}',
              },
            ],
            category: 'Core',
          },
          severity: 'LOW',
          type: 'CODE_CHANGE',
        },
        resourceConfig: {
          target: {
            // description: 'The resource config of the contract {{ $.address }}',
            role: ['Guardian', 'Challenger'],
            permissions: [
              {
                type: 'upgrade',
                delay: 0,
                description:
                  'upgrading the {{ $.address }} contract gives access to all funds',
              },
              {
                type: 'configure',
                delay: 0,
                description:
                  'configuring the {{ $.address }} contract allows freeze funds',
              },
            ],
            category: ['Gateways&Escrows', 'Core'],
          },
          severity: 'HIGH',
          type: ['L2', 'EXTERNAL'],
        },
        scalar: {
          target: {
            // description: 'The scalar of the contract',
            role: 'Challenger',
            permissions: [{ type: 'configure', delay: 0 }],
            category: 'Core',
          },
          severity: 'LOW',
          type: 'CODE_CHANGE',
        },
      }

      const mergedValues = {
        $admin: '0xC72aE5c7cc9a332699305E29F68Be66c73b60542',
        ...Object.fromEntries(
          handlerResults.map(({ field, value }) => [field, value]),
        ),
      }

      const result = getTargetsMeta(
        selfAddress,
        mergedValues,
        fields,
        generateFakeAnalysis(selfAddress),
      )

      expect(result).toEqual({
        '0xC72aE5c7cc9a332699305E29F68Be66c73b60542': {
          displayName: undefined,
          descriptions: undefined,
          roles: new Set(['Challenger']),
          permissions: [
            { type: 'upgrade', delay: 0, target: selfAddress },
            {
              type: 'configure',
              delay: 0,
              target: selfAddress,
              description:
                'configuring the 0x0000000000000000000000000000000000001234 allows to change this number: 1122',
            },
          ],
          categories: new Set(['Core']),
          severity: 'LOW',
          types: new Set(['CODE_CHANGE']),
        },
        '0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf': {
          displayName: undefined,
          categories: new Set(['Core', 'Gateways&Escrows']),
          descriptions: undefined,
          permissions: [
            {
              type: 'upgrade',
              delay: 0,
              target: selfAddress,
              description:
                'upgrading the 0x0000000000000000000000000000000000001234 contract gives access to all funds',
            },
            {
              type: 'configure',
              delay: 0,
              target: selfAddress,
              description:
                'configuring the 0x0000000000000000000000000000000000001234 contract allows freeze funds',
            },
          ],
          roles: new Set(['Challenger', 'Guardian']),
          severity: 'HIGH',
          types: new Set(['EXTERNAL', 'L2']),
        },
        '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf': {
          displayName: undefined,
          categories: new Set(['Core', 'Gateways&Escrows']),
          descriptions: undefined,
          permissions: [
            {
              type: 'upgrade',
              delay: 0,
              target: selfAddress,
              description:
                'upgrading the 0x0000000000000000000000000000000000001234 contract gives access to all funds',
            },
            {
              type: 'configure',
              delay: 0,
              target: selfAddress,
              description:
                'configuring the 0x0000000000000000000000000000000000001234 contract allows freeze funds',
            },
          ],
          roles: new Set(['Challenger', 'Guardian']),
          severity: 'HIGH',
          types: new Set(['EXTERNAL', 'L2']),
        },
      })
    })
  })

  describe('findHighestSeverity', () => {
    it('should properly find highest severity', () => {
      expect(findHighestSeverity('HIGH', 'LOW')).toEqual('HIGH')
      expect(findHighestSeverity('LOW', 'MEDIUM')).toEqual('MEDIUM')
      expect(findHighestSeverity('LOW', 'LOW')).toEqual('LOW')
      expect(findHighestSeverity(undefined, undefined)).toEqual(undefined)
      expect(findHighestSeverity('HIGH', undefined)).toEqual('HIGH')
      expect(findHighestSeverity(undefined, 'MEDIUM')).toEqual('MEDIUM')
      expect(findHighestSeverity('LOW', undefined)).toEqual('LOW')
    })
  })

  describe('invertMeta', () => {
    it('should properly invert meta', () => {
      const targetsMeta: AnalyzedContract['targetsMeta'][] = [
        {
          // for merge:
          '0xC72aE5c7cc9a332699305E29F68Be66c73b60542': {
            displayName: undefined,
            descriptions: ['Important contract'],
            roles: new Set(['Challenger']),
            permissions: [
              {
                type: 'configure',
                delay: 0,
                target: EthereumAddress.from('0x1234'),
              },
            ],
            categories: new Set(['Core']),
            severity: 'LOW',
            types: new Set(['CODE_CHANGE']),
          },
          '0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf': {
            displayName: undefined,
            categories: new Set(['Core', 'Gateways&Escrows']),
            descriptions: ['The resource config of the contract'],
            permissions: [
              {
                type: 'configure',
                delay: 0,
                target: EthereumAddress.from('0x1234'),
              },
              {
                type: 'upgrade',
                delay: 0,
                target: EthereumAddress.from('0x1234'),
              },
            ],
            roles: new Set(['Challenger', 'Guardian']),
            severity: 'HIGH',
            types: new Set(['EXTERNAL', 'L2']),
          },
        },
        {
          // for merge:
          '0xC72aE5c7cc9a332699305E29F68Be66c73b60542': {
            displayName: undefined,
            descriptions: ['Very important contract'],
            roles: undefined,
            permissions: [
              {
                type: 'configure',
                delay: 0,
                target: EthereumAddress.from('0xbeef'),
              },
            ],
            categories: new Set(['Core', 'Gateways&Escrows']),
            severity: 'MEDIUM',
            types: new Set(['EXTERNAL', 'L2']),
          },
          '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf': {
            displayName: undefined,
            categories: new Set(['Core', 'Gateways&Escrows']),
            descriptions: ['The resource config of the contract'],
            permissions: [
              {
                type: 'configure',
                delay: 0,
                target: EthereumAddress.from('0xbeef'),
              },
              {
                type: 'upgrade',
                delay: 0,
                target: EthereumAddress.from('0xbeef'),
              },
            ],
            roles: new Set(['Challenger', 'Guardian']),
            severity: 'HIGH',
            types: new Set(['EXTERNAL', 'L2']),
          },
        },
      ]

      const result = invertMeta(targetsMeta)

      expect(result).toEqual({
        // merged:
        '0xC72aE5c7cc9a332699305E29F68Be66c73b60542': {
          displayName: undefined,
          descriptions: ['Important contract', 'Very important contract'],
          roles: new Set(['Challenger']),
          permissions: [
            {
              type: 'configure',
              delay: 0,
              target: EthereumAddress.from('0x1234'),
            },
            {
              type: 'configure',
              delay: 0,
              target: EthereumAddress.from('0xbeef'),
            },
          ],
          categories: new Set(['Core', 'Gateways&Escrows']),
          types: new Set(['CODE_CHANGE', 'EXTERNAL', 'L2']),
          severity: 'MEDIUM',
        },
        '0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf': {
          displayName: undefined,
          descriptions: ['The resource config of the contract'],
          roles: new Set(['Challenger', 'Guardian']),
          permissions: [
            {
              type: 'configure',
              delay: 0,
              target: EthereumAddress.from('0x1234'),
            },
            {
              type: 'upgrade',
              delay: 0,
              target: EthereumAddress.from('0x1234'),
            },
          ],
          categories: new Set(['Core', 'Gateways&Escrows']),
          types: new Set(['EXTERNAL', 'L2']),
          severity: 'HIGH',
        },
        '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf': {
          displayName: undefined,
          descriptions: ['The resource config of the contract'],
          roles: new Set(['Challenger', 'Guardian']),
          permissions: [
            {
              type: 'configure',
              delay: 0,
              target: EthereumAddress.from('0xbeef'),
            },
            {
              type: 'upgrade',
              delay: 0,
              target: EthereumAddress.from('0xbeef'),
            },
          ],
          categories: new Set(['Core', 'Gateways&Escrows']),
          types: new Set(['EXTERNAL', 'L2']),
          severity: 'HIGH',
        },
      })
    })
  })

  describe('getMetaFromUpgradeability', () => {
    it('should properly get meta from upgradeability', () => {
      const selfAddress = EthereumAddress.from('0x1234')
      const admin = EthereumAddress.from('0xabcd')

      const result = getMetaFromUpgradeability(selfAddress, [admin])

      expect(result).toEqual({
        [admin.toString()]: {
          displayName: undefined,
          categories: undefined,
          descriptions: undefined,
          roles: undefined,
          severity: undefined,
          types: undefined,
          permissions: [{ type: 'upgrade', delay: 0, target: selfAddress }],
        },
      })
    })
  })

  describe('interpolateDescription', () => {
    it('should correctly interpolate variables in the description', () => {
      const description =
        'Contract with address {{ $.address }} and value {{ someValue }}'
      const analysis = generateFakeAnalysis(
        EthereumAddress.from('0x1234567890123456789012345678901234567890'),
        undefined,
        undefined,
        {
          someValue: 42,
        },
      )

      const result = interpolateDescription(description, analysis)

      expect(result).toEqual(
        'Contract with address 0x1234567890123456789012345678901234567890 and value 42',
      )
    })

    it('should throw an error if a variable is not found in the analysis', () => {
      const description = 'Contract with missing {{ missingValue }}'
      const analysis = generateFakeAnalysis(
        EthereumAddress.from('0x1234567890123456789012345678901234567890'),
      )

      expect(() => interpolateDescription(description, analysis)).toThrow(
        'Value for variable "{{ missingValue }}" in contract description not found in contract analysis',
      )
    })
  })
})

const generateFakeAnalysis = (
  address: EthereumAddress,
  extendedTemplate?: ExtendedTemplate,
  errors?: Record<string, string>,
  values?: Record<string, ContractValue | undefined>,
): AnalyzedContract => {
  return {
    ...EMPTY_ANALYZED_CONTRACT,
    address,
    name: `NameOf${address.toString()}`,
    isVerified: true,
    values: values ?? { numberField: 1122 },
    errors: errors ?? {},
    extendedTemplate,
  }
}
