import type {
  ProjectContract,
  ProjectContracts,
  ProjectPermission,
  ProjectPermissionedAccount,
  ProjectPermissions,
} from '@l2beat/config'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
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
    const contracts = mockObject<ProjectContracts>({
      addresses: {
        ethereum: [
          mockObject<ProjectContract>({
            address: mockContractAddress,
            name: 'TestContract',
            chain: 'ethereum',
          }),
        ],
      },
    })

    it('should replace known contract address with link', () => {
      const input = `The contract at ${mockContractAddress.toString()} is important.`
      const output = linkAddresses(input, contracts, undefined)
      expect(output).toEqual(
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
      expect(output).toEqual(
        'See [TestContract](#TestContract) and also [TestContract](#TestContract).',
      )
    })

    it('should handle multiple different addresses', () => {
      const secondAddress = ChainSpecificAddress.from(
        'eth',
        '0x9876543210987654321098765432109876543210',
      )

      const contractsWithMultiple = mockObject<ProjectContracts>({
        addresses: {
          ethereum: [
            mockObject<ProjectContract>({
              address: mockContractAddress,
              name: 'Contract1',
              chain: 'ethereum',
            }),
            mockObject<ProjectContract>({
              address: secondAddress,
              name: 'Contract2',
              chain: 'ethereum',
            }),
          ],
        },
      })

      const input = `First: ${mockContractAddress.toString()}, Second: ${secondAddress.toString()}.`
      const output = linkAddresses(input, contractsWithMultiple, undefined)
      expect(output).toEqual(
        'First: [Contract1](#Contract1), Second: [Contract2](#Contract2).',
      )
    })

    it('should handle contract name with spaces in ID', () => {
      const contractsWithSpaces = mockObject<ProjectContracts>({
        addresses: {
          ethereum: [
            mockObject<ProjectContract>({
              address: mockContractAddress,
              name: 'My Contract Name',
              chain: 'ethereum',
            }),
          ],
        },
      })

      const input = `See ${mockContractAddress.toString()}.`
      const output = linkAddresses(input, contractsWithSpaces, undefined)
      expect(output).toEqual(
        `See [My Contract Name](#${encodeURIComponent('My Contract Name')}).`,
      )
    })
  })

  describe('permissions', () => {
    const permissions = mockObject<Record<string, ProjectPermissions>>({
      ethereum: {
        roles: [
          mockObject<ProjectPermission>({
            id: 'ADI Multisig 2',
            name: 'ADI Multisig 2',
            chain: 'ethereum',
            accounts: [
              mockObject<ProjectPermissionedAccount>({
                address: mockPermissionAddress,
                name: 'Account Name',
              }),
            ],
          }),
        ],
      },
    })

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
      expect(output).toInclude('ADI%20Multisig%202')
    })

    it('should handle actors as well as roles', () => {
      const permissionsWithActors = mockObject<
        Record<string, ProjectPermissions>
      >({
        ethereum: {
          actors: [
            mockObject<ProjectPermission>({
              id: 'actor-id',
              name: 'Test Actor',
              chain: 'ethereum',
              accounts: [
                mockObject<ProjectPermissionedAccount>({
                  address: mockPermissionAddress,
                  name: 'Account Name',
                }),
              ],
            }),
          ],
        },
      })

      const input = `See ${mockPermissionAddress.toString()}.`
      const output = linkAddresses(input, undefined, permissionsWithActors)
      expect(output).toEqual('See [Test Actor](#actor-id).')
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
      const contracts = mockObject<ProjectContracts>({
        addresses: {
          ethereum: [
            mockObject<ProjectContract>({
              address: ethAddress,
              name: 'EthereumContract',
              chain: 'ethereum',
            }),
          ],
          arbitrum: [
            mockObject<ProjectContract>({
              address: arbAddress,
              name: 'ArbitrumContract',
              chain: 'arbitrum',
            }),
          ],
        },
      })

      const input = `ETH: ${ethAddress.toString()}, ARB: ${arbAddress.toString()}.`
      const output = linkAddresses(input, contracts, undefined)
      expect(output).toEqual(
        'ETH: [EthereumContract](#EthereumContract), ARB: [ArbitrumContract](#ArbitrumContract).',
      )
    })
  })
})
