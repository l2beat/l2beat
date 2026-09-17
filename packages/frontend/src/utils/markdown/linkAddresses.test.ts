import type {
  ProjectContract,
  ProjectContracts,
  ProjectPermission,
  ProjectPermissionedAccount,
  ProjectPermissions,
} from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { describe, expect, it } from 'vitest'
import { linkAddresses } from './linkAddresses'

describe(linkAddresses.name, () => {
  const mockContractAddress = ChainSpecificAddress(
    'eth:0xB272B188855128c10a933Edb62CC64c22B1f3754',
  )
  const mockPermissionAddress = ChainSpecificAddress(
    'eth:0x1234567890123456789012345678901234567890',
  )
  const unknownAddress = ChainSpecificAddress(
    'eth:0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD',
  )

  describe('contracts', () => {
    const contracts = {
      addresses: {
        ethereum: [
          {
            address: mockContractAddress,
            name: 'TestContract',
            chain: 'ethereum',
          } as unknown as ProjectContract,
        ],
      },
    } as unknown as ProjectContracts

    it('should replace known contract address with link', () => {
      const input = `The contract at ${mockContractAddress.toString()} is important.`
      const output = linkAddresses(input, contracts, undefined)
      expect(output).toBe(
        'The contract at [TestContract](#TestContract) is important.',
      )
    })

    it('should not replace unknown address', () => {
      const input = `The contract at ${unknownAddress.toString()} is unknown.`
      const output = linkAddresses(input, contracts, undefined)
      expect(output).toEqual(input)
    })

    it('should replace multiple occurrences of the same address', () => {
      const input = `See ${mockContractAddress.toString()} and also ${mockContractAddress.toString()}.`
      const output = linkAddresses(input, contracts, undefined)
      expect(output).toBe(
        'See [TestContract](#TestContract) and also [TestContract](#TestContract).',
      )
    })

    it('should handle multiple different addresses', () => {
      const secondAddress = ChainSpecificAddress.from(
        'eth',
        '0x9876543210987654321098765432109876543210',
      )

      const contractsWithMultiple = {
        addresses: {
          ethereum: [
            {
              address: mockContractAddress,
              name: 'Contract1',
              chain: 'ethereum',
            } as unknown as ProjectContract,
            {
              address: secondAddress,
              name: 'Contract2',
              chain: 'ethereum',
            } as unknown as ProjectContract,
          ],
        },
      } as unknown as ProjectContracts

      const input = `First: ${mockContractAddress.toString()}, Second: ${secondAddress.toString()}.`
      const output = linkAddresses(input, contractsWithMultiple, undefined)
      expect(output).toBe(
        'First: [Contract1](#Contract1), Second: [Contract2](#Contract2).',
      )
    })

    it('should handle contract name with spaces in ID', () => {
      const contractsWithSpaces = {
        addresses: {
          ethereum: [
            {
              address: mockContractAddress,
              name: 'My Contract Name',
              chain: 'ethereum',
            } as unknown as ProjectContract,
          ],
        },
      } as unknown as ProjectContracts

      const input = `See ${mockContractAddress.toString()}.`
      const output = linkAddresses(input, contractsWithSpaces, undefined)
      expect(output).toEqual(
        `See [My Contract Name](#${encodeURIComponent('My Contract Name')}).`,
      )
    })
  })

  describe('permissions', () => {
    const permissions = {
      ethereum: {
        roles: [
          {
            id: 'ADI Multisig 2',
            name: 'ADI Multisig 2',
            chain: 'ethereum',
            accounts: [
              {
                address: mockPermissionAddress,
                name: 'Account Name',
              } as unknown as ProjectPermissionedAccount,
            ],
          } as unknown as ProjectPermission,
        ],
      },
    } as unknown as Record<string, ProjectPermissions>

    it('should replace known permission address with link', () => {
      const input = `The permission at ${mockPermissionAddress.toString()} is important.`
      const output = linkAddresses(input, undefined, permissions)
      expect(output).toEqual(
        `The permission at [ADI Multisig 2](#${encodeURIComponent('ADI Multisig 2')}) is important.`,
      )
    })

    it('should handle permission ID with spaces', () => {
      const input = `See ${mockPermissionAddress.toString()}.`
      const output = linkAddresses(input, undefined, permissions)
      expect(output).toEqual(
        `See [ADI Multisig 2](#${encodeURIComponent('ADI Multisig 2')}).`,
      )
      expect(output).toContain('ADI%20Multisig%202')
    })

    it('should handle actors as well as roles', () => {
      const permissionsWithActors = {
        ethereum: {
          actors: [
            {
              id: 'actor-id',
              name: 'Test Actor',
              chain: 'ethereum',
              accounts: [
                {
                  address: mockPermissionAddress,
                  name: 'Account Name',
                } as unknown as ProjectPermissionedAccount,
              ],
            } as unknown as ProjectPermission,
          ],
        },
      } as unknown as Record<string, ProjectPermissions>

      const input = `See ${mockPermissionAddress.toString()}.`
      const output = linkAddresses(input, undefined, permissionsWithActors)
      expect(output).toBe('See [Test Actor](#actor-id).')
    })
  })

  describe('edge cases', () => {
    it('should return original content when contracts and permissions are empty', () => {
      const emptyContracts: ProjectContracts = {
        addresses: {},
        risks: [],
      }
      const input = 'See eth:0x1234567890123456789012345678901234567890.'
      const output = linkAddresses(input, emptyContracts, undefined)
      expect(output).toEqual(input)
    })

    it('should handle multiple chains', () => {
      const ethAddress = ChainSpecificAddress(
        'eth:0x1111111111111111111111111111111111111111',
      )
      const arbAddress = ChainSpecificAddress(
        'arb1:0x2222222222222222222222222222222222222222',
      )
      const contracts = {
        addresses: {
          ethereum: [
            {
              address: ethAddress,
              name: 'EthereumContract',
              chain: 'ethereum',
            } as unknown as ProjectContract,
          ],
          arbitrum: [
            {
              address: arbAddress,
              name: 'ArbitrumContract',
              chain: 'arbitrum',
            } as unknown as ProjectContract,
          ],
        },
      } as unknown as ProjectContracts

      const input = `ETH: ${ethAddress.toString()}, ARB: ${arbAddress.toString()}.`
      const output = linkAddresses(input, contracts, undefined)
      expect(output).toBe(
        'ETH: [EthereumContract](#EthereumContract), ARB: [ArbitrumContract](#ArbitrumContract).',
      )
    })
  })
})
