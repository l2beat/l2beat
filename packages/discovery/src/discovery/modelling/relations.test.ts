import { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type {
  ContractParameters,
  DiscoveryOutput,
  ReceivedPermission,
} from '../output/types'
import { buildAddressToNameMap } from './build'
import {
  buildRelationsModels,
  findAllDirectlyReceivedPermissions,
} from './relations'

describe(findAllDirectlyReceivedPermissions.name, () => {
  it('finds all directly received permissions', () => {
    const permission1: ReceivedPermission = {
      permission: 'act',
      from: EthereumAddress.from('0x123'),
    }
    const permission2: ReceivedPermission = {
      permission: 'act',
      from: EthereumAddress.from('0x456'),
    }
    const permission3: ReceivedPermission = {
      permission: 'act',
      from: EthereumAddress.from('0x789'),
      via: [],
    }
    const contract: ContractParameters = {
      address: EthereumAddress.from('0xdeadbeef'),
      name: 'ContactMsigA',
      directlyReceivedPermissions: [permission1],
      receivedPermissions: [
        permission2,
        permission3,
        {
          permission: 'act',
          from: EthereumAddress.from('0xabc'),
          via: [{ address: EthereumAddress.from('0xdef') }],
        },
      ],
    }
    const permissions = findAllDirectlyReceivedPermissions(contract)
    expect(permissions).toEqual([permission1, permission2, permission3])
  })
})

describe(buildRelationsModels.name, () => {
  it('builds the relations model', () => {
    const discoveryOutput: DiscoveryOutput = {
      name: 'zora',
      chain: 'ethereum',
      blockNumber: 21829679,
      configHash: Hash256.random(),
      contracts: [
        {
          address: EthereumAddress.from('0xccc1'),
          name: 'ContractA',
          description: 'Description of ContractA',
          values: {},
          receivedPermissions: [
            {
              permission: 'upgrade',
              from: EthereumAddress.from('0xaaa1'),
              description: 'Description of Permission 1',
            },
          ],
          directlyReceivedPermissions: [
            {
              permission: 'act',
              from: EthereumAddress.from('0xaaa2'),
              description: 'Description of Permission 2',
              delay: 3600,
            },
          ],
        },
        {
          address: EthereumAddress.from('0xccc2'),
          name: 'ContractB',
          description: 'Description of ContractB',
          values: {},
        },
      ],
      eoas: [
        {
          address: EthereumAddress.from('0xeee1'),
          name: 'EoaA',
          receivedPermissions: [
            {
              permission: 'act',
              from: EthereumAddress.from('0xccc1'),
              description: 'Description of Permission 3',
            },
          ],
          directlyReceivedPermissions: [
            {
              permission: 'interact',
              from: EthereumAddress.from('0xccc2'),
              description: 'Description of Permission 4',
              delay: 1000,
            },
          ],
        },
      ],
      abis: {},
      usedTemplates: {},
    }
    const addressToNameMap = buildAddressToNameMap(
      discoveryOutput.chain,
      discoveryOutput.contracts,
      discoveryOutput.eoas,
    )
    const relationsModel = buildRelationsModels(
      discoveryOutput,
      addressToNameMap,
    )
    expect(relationsModel).toEqual({
      'relations.lp': [
        `
contract(
  contractA_ethereum_0x000000000000000000000000000000000000ccc1,
  "ethereum",
  "0x000000000000000000000000000000000000ccc1",
  "ContractA").`,
        `
contractDescription(
  contractA_ethereum_0x000000000000000000000000000000000000ccc1,
  "Description of ContractA").`,
        `
permission(
  contractA_ethereum_0x000000000000000000000000000000000000ccc1,
  "act",
  0x000000000000000000000000000000000000aAA2).`,
        `
permissionDescription(
  contractA_ethereum_0x000000000000000000000000000000000000ccc1,
  "act",
  0x000000000000000000000000000000000000aAA2,
  "Description of Permission 2").`,
        `
permissionDelay(
  contractA_ethereum_0x000000000000000000000000000000000000ccc1,
  "act",
  0x000000000000000000000000000000000000aAA2,
  3600).`,
        `
permission(
  contractA_ethereum_0x000000000000000000000000000000000000ccc1,
  "upgrade",
  0x000000000000000000000000000000000000AaA1).`,
        `
permissionDescription(
  contractA_ethereum_0x000000000000000000000000000000000000ccc1,
  "upgrade",
  0x000000000000000000000000000000000000AaA1,
  "Description of Permission 1").`,
        `
contract(
  contractB_ethereum_0x000000000000000000000000000000000000ccc2,
  "ethereum",
  "0x000000000000000000000000000000000000ccc2",
  "ContractB").`,
        `
contractDescription(
  contractB_ethereum_0x000000000000000000000000000000000000ccc2,
  "Description of ContractB").`,
        `
eoa(
  eoaA_ethereum_0x000000000000000000000000000000000000eee1,
  "ethereum",
  "0x000000000000000000000000000000000000eee1",
  "EoaA").`,
        `
permission(
  eoaA_ethereum_0x000000000000000000000000000000000000eee1,
  "interact",
  contractB_ethereum_0x000000000000000000000000000000000000ccc2).`,
        `
permissionDescription(
  eoaA_ethereum_0x000000000000000000000000000000000000eee1,
  "interact",
  contractB_ethereum_0x000000000000000000000000000000000000ccc2,
  "Description of Permission 4").`,
        `
permissionDelay(
  eoaA_ethereum_0x000000000000000000000000000000000000eee1,
  "interact",
  contractB_ethereum_0x000000000000000000000000000000000000ccc2,
  1000).`,
        `
permission(
  eoaA_ethereum_0x000000000000000000000000000000000000eee1,
  "act",
  contractA_ethereum_0x000000000000000000000000000000000000ccc1).`,
        `
permissionDescription(
  eoaA_ethereum_0x000000000000000000000000000000000000eee1,
  "act",
  contractA_ethereum_0x000000000000000000000000000000000000ccc1,
  "Description of Permission 3").`,
      ],
    })
  })
})
