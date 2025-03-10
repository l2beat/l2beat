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
              from: EthereumAddress.from('0xccc2'),
              description: 'Description of Permission 1',
            },
          ],
          directlyReceivedPermissions: [
            {
              permission: 'act',
              from: EthereumAddress.from('0xeee1'),
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
        '\n' +
          'address(\n' +
          '  contractA_ethereum_0x000000000000000000000000000000000000ccc1,\n' +
          '  "ethereum",\n' +
          '  "0x000000000000000000000000000000000000ccc1").',
        '\n' +
          'addressName(\n' +
          '  contractA_ethereum_0x000000000000000000000000000000000000ccc1,\n' +
          '  "ContractA").',
        '\n' +
          'addressType(\n' +
          '  contractA_ethereum_0x000000000000000000000000000000000000ccc1,\n' +
          '  contract).',
        '\n' +
          'addressDescription(\n' +
          '  contractA_ethereum_0x000000000000000000000000000000000000ccc1,\n' +
          '  "Description of ContractA").',
        '\n' +
          'permission(\n' +
          '  contractA_ethereum_0x000000000000000000000000000000000000ccc1,\n' +
          '  "act",\n' +
          '  eoaA_ethereum_0x000000000000000000000000000000000000eee1).',
        '\n' +
          'permissionDescription(\n' +
          '  contractA_ethereum_0x000000000000000000000000000000000000ccc1,\n' +
          '  "act",\n' +
          '  eoaA_ethereum_0x000000000000000000000000000000000000eee1,\n' +
          '  "Description of Permission 2").',
        '\n' +
          'permissionDelay(\n' +
          '  contractA_ethereum_0x000000000000000000000000000000000000ccc1,\n' +
          '  "act",\n' +
          '  eoaA_ethereum_0x000000000000000000000000000000000000eee1,\n' +
          '  3600).',
        '\n' +
          'permission(\n' +
          '  contractA_ethereum_0x000000000000000000000000000000000000ccc1,\n' +
          '  "upgrade",\n' +
          '  contractB_ethereum_0x000000000000000000000000000000000000ccc2).',
        '\n' +
          'permissionDescription(\n' +
          '  contractA_ethereum_0x000000000000000000000000000000000000ccc1,\n' +
          '  "upgrade",\n' +
          '  contractB_ethereum_0x000000000000000000000000000000000000ccc2,\n' +
          '  "Description of Permission 1").',
        '\n' +
          'address(\n' +
          '  contractB_ethereum_0x000000000000000000000000000000000000ccc2,\n' +
          '  "ethereum",\n' +
          '  "0x000000000000000000000000000000000000ccc2").',
        '\n' +
          'addressName(\n' +
          '  contractB_ethereum_0x000000000000000000000000000000000000ccc2,\n' +
          '  "ContractB").',
        '\n' +
          'addressType(\n' +
          '  contractB_ethereum_0x000000000000000000000000000000000000ccc2,\n' +
          '  contract).',
        '\n' +
          'addressDescription(\n' +
          '  contractB_ethereum_0x000000000000000000000000000000000000ccc2,\n' +
          '  "Description of ContractB").',
        '\n' +
          'address(\n' +
          '  eoaA_ethereum_0x000000000000000000000000000000000000eee1,\n' +
          '  "ethereum",\n' +
          '  "0x000000000000000000000000000000000000eee1").',
        '\n' +
          'addressName(\n' +
          '  eoaA_ethereum_0x000000000000000000000000000000000000eee1,\n' +
          '  "EoaA").',
        '\n' +
          'addressType(\n' +
          '  eoaA_ethereum_0x000000000000000000000000000000000000eee1,\n' +
          '  eoa).',
        '\n' +
          'permission(\n' +
          '  eoaA_ethereum_0x000000000000000000000000000000000000eee1,\n' +
          '  "interact",\n' +
          '  contractB_ethereum_0x000000000000000000000000000000000000ccc2).',
        '\n' +
          'permissionDescription(\n' +
          '  eoaA_ethereum_0x000000000000000000000000000000000000eee1,\n' +
          '  "interact",\n' +
          '  contractB_ethereum_0x000000000000000000000000000000000000ccc2,\n' +
          '  "Description of Permission 4").',
        '\n' +
          'permissionDelay(\n' +
          '  eoaA_ethereum_0x000000000000000000000000000000000000eee1,\n' +
          '  "interact",\n' +
          '  contractB_ethereum_0x000000000000000000000000000000000000ccc2,\n' +
          '  1000).',
        '\n' +
          'permission(\n' +
          '  eoaA_ethereum_0x000000000000000000000000000000000000eee1,\n' +
          '  "act",\n' +
          '  contractA_ethereum_0x000000000000000000000000000000000000ccc1).',
        '\n' +
          'permissionDescription(\n' +
          '  eoaA_ethereum_0x000000000000000000000000000000000000eee1,\n' +
          '  "act",\n' +
          '  contractA_ethereum_0x000000000000000000000000000000000000ccc1,\n' +
          '  "Description of Permission 3").',
      ],
    })
  })
})
