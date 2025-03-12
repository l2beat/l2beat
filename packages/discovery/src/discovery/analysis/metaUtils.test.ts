import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type {
  DiscoveryContractField,
  PermissionConfiguration,
} from '../config/RawDiscoveryConfig'
import type { ContractValue } from '../output/types'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import type { AnalyzedContract, ExtendedTemplate } from './AddressAnalyzer'
import {
  type ContractMeta,
  findHighestSeverity,
  getMetaFromUpgradeability,
  getTargetsMeta,
  interpolateString,
  invertMeta,
  mergeContractMeta,
  mergePermissions,
} from './metaUtils'

describe('metaUtils', () => {
  describe('mergeContractMeta', () => {
    it('should merge two ContractMeta objects correctly', () => {
      const a: ContractMeta = {
        displayName: 'ContractA',
        description: 'description 1',
        permissions: [
          {
            type: 'interact',
            delay: 0,
            target: EthereumAddress.from('0x1234'),
          },
          {
            type: 'interact',
            delay: 0,
            target: EthereumAddress.from('0x5678'),
          },
        ],
        types: new Set(['CODE_CHANGE', 'EXTERNAL']),
        severity: 'LOW',
        references: [
          { text: 'Source Code', href: 'link1' },
          { text: 'Source Code', href: 'link2' },
        ],
      }
      const b: ContractMeta = {
        displayName: undefined,
        description: 'description 2',
        permissions: [
          {
            type: 'interact',
            delay: 0,
            target: EthereumAddress.from('0xabcd'),
          },
          {
            type: 'interact',
            delay: 0,
            target: EthereumAddress.from('0x1234'),
          },
          { type: 'upgrade', delay: 0, target: EthereumAddress.from('0x1234') },
        ],
        types: new Set(['PERMISSION', 'L2', 'EXTERNAL']),
        severity: 'MEDIUM',
        references: [
          { text: 'Some docs', href: 'link1' },
          { text: 'Source Code', href: 'link2' },
        ],
      }

      const result = mergeContractMeta(a, b)

      expect(result).toEqual({
        displayName: 'ContractA',
        description: 'description 1',
        canActIndependently: undefined,
        permissions: [
          {
            type: 'interact',
            delay: 0,
            target: EthereumAddress.from('0x1234'),
          },
          {
            type: 'interact',
            delay: 0,
            target: EthereumAddress.from('0x5678'),
          },
          {
            type: 'interact',
            delay: 0,
            target: EthereumAddress.from('0xabcd'),
          },
          { type: 'upgrade', delay: 0, target: EthereumAddress.from('0x1234') },
        ],
        types: new Set(['CODE_CHANGE', 'EXTERNAL', 'L2', 'PERMISSION']),
        severity: 'MEDIUM',
        references: [
          { text: 'Source Code', href: 'link1' },
          { text: 'Source Code', href: 'link2' },
          { text: 'Some docs', href: 'link1' },
        ],
      })
    })
  })

  describe('mergePermissions', () => {
    it('should merge two permission objects correctly, but not merge interact permissions with the same description', () => {
      const a: PermissionConfiguration[] = [
        { type: 'interact', delay: 0, target: EthereumAddress.from('0x1234') },
        { type: 'interact', delay: 0, target: EthereumAddress.from('0x5678') },
        {
          type: 'interact',
          description: 'can add tx',
          delay: 0,
          target: EthereumAddress.from('0xbeed'),
        },
        {
          type: 'interact',
          description: 'can remove tx',
          delay: 100,
          target: EthereumAddress.from('0xbeed'),
        },
        { type: 'act', delay: 0, target: EthereumAddress.from('0x5678') },
      ]
      const b: PermissionConfiguration[] = [
        { type: 'interact', delay: 0, target: EthereumAddress.from('0xabcd') },
        { type: 'interact', delay: 0, target: EthereumAddress.from('0x1234') },
        { type: 'upgrade', delay: 15, target: EthereumAddress.from('0x1234') },
      ]

      expect(mergePermissions(a, b)).toEqual([
        { type: 'interact', delay: 0, target: EthereumAddress.from('0x1234') },
        { type: 'interact', delay: 0, target: EthereumAddress.from('0x5678') },
        {
          type: 'interact',
          description: 'can add tx',
          delay: 0,
          target: EthereumAddress.from('0xbeed'),
        },
        {
          type: 'interact',
          description: 'can remove tx',
          delay: 100,
          target: EthereumAddress.from('0xbeed'),
        },
        { type: 'act', delay: 0, target: EthereumAddress.from('0x5678') },
        { type: 'interact', delay: 0, target: EthereumAddress.from('0xabcd') },
        { type: 'upgrade', delay: 15, target: EthereumAddress.from('0x1234') },
      ])
    })

    it('returns undefined if both arrays are empty', () => {
      expect(mergePermissions([], [])).toEqual(undefined)
    })

    it('returns the non-empty array if the other is empty', () => {
      const a: PermissionConfiguration[] = [
        { type: 'interact', delay: 0, target: EthereumAddress.from('0x1234') },
      ]
      expect(mergePermissions(a, [])).toEqual(a)
      expect(mergePermissions([], a)).toEqual(a)
    })

    it('keeps only entries with the highest delay', () => {
      const a: PermissionConfiguration[] = [
        { type: 'interact', delay: 5, target: EthereumAddress.from('0x1234') },
        { type: 'interact', delay: 0, target: EthereumAddress.from('0x5678') },
      ]
      const b: PermissionConfiguration[] = [
        {
          type: 'interact',
          delay: 10,
          target: EthereumAddress.from('0x1234'),
        },
      ]
      expect(mergePermissions(a, b)).toEqual([
        {
          type: 'interact',
          delay: 10,
          target: EthereumAddress.from('0x1234'),
        },
        { type: 'interact', delay: 0, target: EthereumAddress.from('0x5678') },
      ])
    })

    it('prefers entries with a description at the same highest delay', () => {
      const a: PermissionConfiguration[] = [
        {
          type: 'upgrade',
          delay: 10,
          target: EthereumAddress.from('0x1111'),
          description: 'Described upgrade',
        },
        {
          type: 'upgrade',
          delay: 10,
          target: EthereumAddress.from('0x1111'),
        },
      ]
      const b: PermissionConfiguration[] = [
        {
          type: 'upgrade',
          delay: 10,
          target: EthereumAddress.from('0x1111'),
        },
      ]
      expect(mergePermissions(a, b)).toEqual([
        {
          type: 'upgrade',
          delay: 10,
          target: EthereumAddress.from('0x1111'),
          description: 'Described upgrade',
        },
      ])
    })

    it('retains multiple described entries if they share the same largest delay', () => {
      const a: PermissionConfiguration[] = [
        {
          type: 'interact',
          delay: 7,
          target: EthereumAddress.from('0x2222'),
          description: 'Description A',
        },
      ]
      const b: PermissionConfiguration[] = [
        {
          type: 'interact',
          delay: 7,
          target: EthereumAddress.from('0x2222'),
          description: 'Description B',
        },
      ]
      const result = mergePermissions(a, b)
      expect(result ?? []).toEqualUnsorted([
        {
          type: 'interact',
          delay: 7,
          target: EthereumAddress.from('0x2222'),
          description: 'Description A',
        },
        {
          type: 'interact',
          delay: 7,
          target: EthereumAddress.from('0x2222'),
          description: 'Description B',
        },
      ])
    })

    it('merges permissions even if they differ by condition', () => {
      const a: PermissionConfiguration[] = [
        {
          type: 'interact',
          delay: 0,
          target: EthereumAddress.from('0x3333'),
          condition: 'some-condition',
        },
      ]
      const b: PermissionConfiguration[] = [
        {
          type: 'interact',
          delay: 0,
          target: EthereumAddress.from('0x3333'),
        },
      ]
      expect(mergePermissions(a, b)).toEqual([
        {
          type: 'interact',
          delay: 0,
          target: EthereumAddress.from('0x3333'),
          condition: 'some-condition',
        },
        {
          type: 'interact',
          delay: 0,
          target: EthereumAddress.from('0x3333'),
        },
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
            permissions: [{ type: 'interact', delay: 0 }],
          },
          severity: 'LOW',
          type: 'CODE_CHANGE',
        },
        owner: {
          target: {
            permissions: [
              {
                type: 'interact',
                delay: 0,
                description:
                  'configuring the {{ $.address }} allows to change this number: {{ numberField }}',
              },
            ],
          },
          severity: 'LOW',
          type: 'CODE_CHANGE',
        },
        resourceConfig: {
          target: {
            // description: 'The resource config of the contract {{ $.address }}',
            permissions: [
              {
                type: 'upgrade',
                delay: 0,
                description:
                  'upgrading the {{ $.address }} contract gives access to all funds',
              },
              {
                type: 'interact',
                condition: 'condition C1 is met',
                delay: 0,
                description:
                  'configuring the {{ $.address }} contract allows freeze funds',
              },
            ],
          },
          severity: 'HIGH',
          type: ['L2', 'EXTERNAL'],
        },
        scalar: {
          target: {
            // description: 'The scalar of the contract',
            permissions: [{ type: 'interact', delay: 0 }],
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
          canActIndependently: undefined,
          displayName: undefined,
          description: undefined,
          permissions: [
            { type: 'upgrade', delay: 0, target: selfAddress },
            {
              type: 'interact',
              delay: 0,
              target: selfAddress,
              description:
                'configuring the 0x0000000000000000000000000000000000001234 allows to change this number: 1122',
              condition: undefined,
            },
          ],
          severity: 'LOW',
          types: new Set(['CODE_CHANGE']),
          references: undefined,
        },
        '0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf': {
          canActIndependently: undefined,
          displayName: undefined,
          description: undefined,
          permissions: [
            {
              type: 'upgrade',
              delay: 0,
              target: selfAddress,
              description:
                'upgrading the 0x0000000000000000000000000000000000001234 contract gives access to all funds',
              condition: undefined,
            },
            {
              type: 'interact',
              condition: 'condition C1 is met',
              delay: 0,
              target: selfAddress,
              description:
                'configuring the 0x0000000000000000000000000000000000001234 contract allows freeze funds',
            },
          ],
          severity: 'HIGH',
          types: new Set(['EXTERNAL', 'L2']),
          references: undefined,
        },
        '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf': {
          canActIndependently: undefined,
          displayName: undefined,
          description: undefined,
          permissions: [
            {
              type: 'upgrade',
              delay: 0,
              target: selfAddress,
              description:
                'upgrading the 0x0000000000000000000000000000000000001234 contract gives access to all funds',
              condition: undefined,
            },
            {
              type: 'interact',
              condition: 'condition C1 is met',
              delay: 0,
              target: selfAddress,
              description:
                'configuring the 0x0000000000000000000000000000000000001234 contract allows freeze funds',
            },
          ],
          severity: 'HIGH',
          types: new Set(['EXTERNAL', 'L2']),
          references: undefined,
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
            description: 'Important contract',
            permissions: [
              {
                type: 'interact',
                delay: 0,
                target: EthereumAddress.from('0x1234'),
              },
            ],
            severity: 'LOW',
            types: new Set(['CODE_CHANGE']),
          },
          '0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf': {
            displayName: undefined,
            description: 'The resource config of the contract',
            permissions: [
              {
                type: 'interact',
                delay: 0,
                target: EthereumAddress.from('0x1234'),
              },
              {
                type: 'upgrade',
                delay: 0,
                target: EthereumAddress.from('0x1234'),
              },
            ],
            severity: 'HIGH',
            types: new Set(['EXTERNAL', 'L2']),
          },
        },
        {
          // for merge:
          '0xC72aE5c7cc9a332699305E29F68Be66c73b60542': {
            displayName: undefined,
            description: 'Very important contract',
            permissions: [
              {
                type: 'interact',
                delay: 0,
                target: EthereumAddress.from('0xbeef'),
              },
            ],
            severity: 'MEDIUM',
            types: new Set(['EXTERNAL', 'L2']),
          },
          '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf': {
            displayName: undefined,
            description: 'The resource config of the contract',
            permissions: [
              {
                type: 'interact',
                delay: 0,
                target: EthereumAddress.from('0xbeef'),
              },
              {
                type: 'upgrade',
                delay: 0,
                target: EthereumAddress.from('0xbeef'),
              },
            ],
            severity: 'HIGH',
            types: new Set(['EXTERNAL', 'L2']),
          },
        },
      ]

      const result = invertMeta(targetsMeta)

      expect(result).toEqual({
        // merged:
        '0xC72aE5c7cc9a332699305E29F68Be66c73b60542': {
          canActIndependently: undefined,
          displayName: undefined,
          description: 'Important contract',
          permissions: [
            {
              type: 'interact',
              delay: 0,
              target: EthereumAddress.from('0x1234'),
            },
            {
              type: 'interact',
              delay: 0,
              target: EthereumAddress.from('0xbeef'),
            },
          ],
          types: new Set(['CODE_CHANGE', 'EXTERNAL', 'L2']),
          severity: 'MEDIUM',
          references: undefined,
        },
        '0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf': {
          canActIndependently: undefined,
          displayName: undefined,
          description: 'The resource config of the contract',
          permissions: [
            {
              type: 'interact',
              delay: 0,
              target: EthereumAddress.from('0x1234'),
            },
            {
              type: 'upgrade',
              delay: 0,
              target: EthereumAddress.from('0x1234'),
            },
          ],
          types: new Set(['EXTERNAL', 'L2']),
          severity: 'HIGH',
          references: undefined,
        },
        '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf': {
          canActIndependently: undefined,
          displayName: undefined,
          description: 'The resource config of the contract',
          permissions: [
            {
              type: 'interact',
              delay: 0,
              target: EthereumAddress.from('0xbeef'),
            },
            {
              type: 'upgrade',
              delay: 0,
              target: EthereumAddress.from('0xbeef'),
            },
          ],
          types: new Set(['EXTERNAL', 'L2']),
          severity: 'HIGH',
          references: undefined,
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
          description: undefined,
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

      const result = interpolateString(description, analysis)

      expect(result).toEqual(
        'Contract with address 0x1234567890123456789012345678901234567890 and value 42',
      )
    })

    it('should throw an error if a variable is not found in the analysis', () => {
      const description = 'Contract with missing {{ missingValue }}'
      const analysis = generateFakeAnalysis(
        EthereumAddress.from('0x1234567890123456789012345678901234567890'),
      )

      expect(() => interpolateString(description, analysis)).toThrow(
        'Value for variable "{{ missingValue }}" in contract field not found in contract analysis',
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
