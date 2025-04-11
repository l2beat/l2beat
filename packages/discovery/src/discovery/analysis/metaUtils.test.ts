import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type {
  PermissionConfiguration,
  StructureContractField,
} from '../config/StructureConfig'
import type { ContractValue } from '../output/types'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import type { AnalyzedContract, ExtendedTemplate } from './AddressAnalyzer'
import {
  type ContractMeta,
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
      }
      const b: ContractMeta = {
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
      }

      const result = mergeContractMeta(a, b)

      expect(result).toEqual({
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

    it('keeps only entries with the shortest delay', () => {
      const a: PermissionConfiguration[] = [
        { type: 'interact', delay: 5, target: EthereumAddress.from('0x1234') },
        { type: 'interact', delay: 0, target: EthereumAddress.from('0x1234') },
      ]
      const b: PermissionConfiguration[] = [
        {
          type: 'interact',
          delay: 5,
          target: EthereumAddress.from('0x1234'),
        },
      ]
      expect(mergePermissions(a, b)).toEqual([
        {
          type: 'interact',
          delay: 0,
          target: EthereumAddress.from('0x1234'),
        },
      ])
    })

    it('prefers entries with a description at the same shortest delay', () => {
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

    it('retains multiple described entries if they share the same shorest delay', () => {
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
      const fields: { [address: string]: StructureContractField } = {
        overhead: { permissions: [{ type: 'interact', delay: 0 }] },
        owner: {
          permissions: [
            {
              type: 'interact',
              delay: 0,
              description:
                'configuring the {{ $.address }} allows to change this number: {{ numberField }}',
            },
          ],
        },
        resourceConfig: {
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
        scalar: { permissions: [{ type: 'interact', delay: 0 }] },
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
          permissions: [
            {
              type: 'interact',
              delay: 0,
              target: selfAddress,
              description:
                'configuring the 0x0000000000000000000000000000000000001234 allows to change this number: 1122',
              condition: undefined,
            },
            { type: 'upgrade', delay: 0, target: selfAddress },
          ],
        },
        '0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf': {
          canActIndependently: undefined,
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
        },
        '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf': {
          canActIndependently: undefined,
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
        },
      })
    })

    it('should not override existing upgrade permission with default', () => {
      const selfAddress = EthereumAddress.from('0x1234')
      const existingUpgradeAddress = EthereumAddress.from('0x456')

      const handlerResults = [
        {
          field: 'configuredUpgrade',
          value: existingUpgradeAddress.toString(),
        },
        {
          field: '$admin',
          value: existingUpgradeAddress.toString(),
        },
      ]

      const fields: { [field: string]: StructureContractField } = {
        configuredUpgrade: {
          permissions: [
            {
              type: 'upgrade',
              delay: 100,
              description: 'Existing configured upgrade permission',
            },
          ],
        },
      }

      const mergedValues = {
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

      expect(result?.[existingUpgradeAddress.toString()]).toEqual({
        canActIndependently: undefined,
        permissions: [
          {
            condition: undefined,
            type: 'upgrade',
            delay: 100,
            target: selfAddress,
            description: 'Existing configured upgrade permission',
          },
        ],
      })
    })
  })

  describe('invertMeta', () => {
    it('should properly invert meta', () => {
      const targetsMeta: AnalyzedContract['targetsMeta'][] = [
        {
          // for merge:
          '0xC72aE5c7cc9a332699305E29F68Be66c73b60542': {
            permissions: [
              {
                type: 'interact',
                delay: 0,
                target: EthereumAddress.from('0x1234'),
              },
            ],
          },
          '0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf': {
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
          },
        },
        {
          // for merge:
          '0xC72aE5c7cc9a332699305E29F68Be66c73b60542': {
            permissions: [
              {
                type: 'interact',
                delay: 0,
                target: EthereumAddress.from('0xbeef'),
              },
            ],
          },
          '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf': {
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
          },
        },
      ]

      const result = invertMeta(targetsMeta)

      expect(result).toEqual({
        // merged:
        '0xC72aE5c7cc9a332699305E29F68Be66c73b60542': {
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
              target: EthereumAddress.from('0xbeef'),
            },
          ],
        },
        '0xc52BC7344e24e39dF1bf026fe05C4e6E23CfBcFf': {
          canActIndependently: undefined,
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
        },
        '0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf': {
          canActIndependently: undefined,
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
