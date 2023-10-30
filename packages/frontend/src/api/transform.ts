import {
  ContractParameters,
  ContractValue,
  DiscoveryOutput,
} from '@l2beat/discovery-types'

import { ContractNode, EOANode, SimpleNode } from './SimpleNode'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function transformContracts(discovery: DiscoveryOutput): SimpleNode[] {
  const contractNodes: ContractNode[] = discovery.contracts.map((contract) => {
    const { proxyFields, implementations } = getProxyDetails(contract)
    return {
      type: 'Contract',
      id: contract.address.toString(),
      name: emojifyContractName(contract),
      discovered: true,
      fields: [...proxyFields, ...mapFields(contract.values)].filter(
        (x) => !x.connection || !implementations.includes(x.connection),
      ),
      data: contract,
    }
  })

  const eoaNodes: EOANode[] = discovery.eoas.map((address) => ({
    type: 'EOA',
    id: address.toString(),
    name: `🧍 EOA ${address.toString()}`,
    discovered: true,
    fields: [],
    data: {
      address: address.toString(),
    },
  }))

  return [...contractNodes, ...eoaNodes]
}

interface FieldProps {
  name: string
  value?: string
  connection?: string
}

function mapFields(
  values: Record<string, ContractValue> | ContractValue | undefined,
  prefix = '',
): FieldProps[] {
  if (values === undefined) {
    return []
  }
  return Object.entries(values).flatMap(
    ([key, value]: [string, ContractValue]): FieldProps[] => {
      if (typeof value === 'string' && isAddress(value)) {
        if (value === ZERO_ADDRESS) {
          return []
        }

        return [
          {
            name: concatKey(prefix, key),
            value,
            connection: value,
          },
        ]
      } else if (typeof value === 'object') {
        return mapFields(value, concatKey(prefix, key))
      }
      return []
    },
  )
}

function concatKey(prefix: string, key: string): string {
  return prefix
    ? /^\d+$/.test(key)
      ? `${prefix}[${key}]`
      : `${prefix}.${key}`
    : key
}

function isAddress(value: string): boolean {
  return (
    typeof value === 'string' && value.startsWith('0x') && value.length === 42
  )
}

function emojifyContractName(contract: ContractParameters): string {
  if (contract.name === 'GnosisSafe') {
    return '🔐 Gnosis Safe'
  }

  if (contract.upgradeability.type !== 'immutable') {
    return '🔗 ' + contract.name
  }

  return contract.name
}

function getProxyDetails(contract: ContractParameters): {
  proxyFields: FieldProps[]
  implementations: string[]
} {
  const proxyFields: FieldProps[] = []
  const implementations: string[] =
    contract.implementations?.map((a) => a.toString()) ?? []
  switch (contract.upgradeability.type) {
    case 'immutable':
      break
    case 'EIP1967 proxy':
      proxyFields.push({
        name: 'admin',
        value: contract.upgradeability.admin.toString(),
      })
      break
    case 'ZeppelinOS proxy':
      if (contract.upgradeability.admin) {
        proxyFields.push({
          name: 'admin',
          value: contract.upgradeability.admin.toString(),
        })
      }
      break
    case 'Arbitrum proxy':
    case 'new Arbitrum proxy':
      proxyFields.push({
        name: 'admin',
        value: contract.upgradeability.admin.toString(),
      })
      break
    case 'resolved delegate proxy':
      proxyFields.push({
        name: 'addressManager',
        value: contract.upgradeability.addressManager.toString(),
      })
      break
  }

  return {
    proxyFields: proxyFields.map((x) => ({
      ...x,
      name: `#️⃣ ${x.name}`,
      connection: x.value,
    })),
    implementations,
  }
}
