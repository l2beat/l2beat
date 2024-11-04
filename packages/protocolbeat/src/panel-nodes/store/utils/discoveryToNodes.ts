import { ApiAddressType } from '../../../api/types'
import { Field, Node } from '../State'
import type { DiscoveryContract, DiscoveryOutput } from './paseDiscovery'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

function encodeChainAddress(chain: string, value: string): string {
  if (value.includes(':')) {
    return value
  }

  return `${chain}:${value}`
}

function isChainAddress(value: string): boolean {
  return (
    value.includes(':') &&
    // biome-ignore lint/style/noNonNullAssertion: We know it's there
    isAddress(value.split(':')[1]!)
  )
}

export function discoveryToNodes(discovery: DiscoveryOutput): Node[] {
  const chain = discovery.chain

  const contractNodes = discovery.contracts.map((contract): Node => {
    const implementations = getAsStringArray(contract.values?.$implementation)
    const { addressType, name } = getDisplay(contract, implementations)
    return {
      id: encodeChainAddress(chain, contract.address),
      address: contract.address,
      addressType,
      name,
      box: { x: 0, y: 0, width: 0, height: 0 },
      color: 0,
      fields: mapFields(contract.values, chain, implementations),
      data: contract,
    }
  })

  const eoaNodes = discovery.eoas.map(
    (eoa): Node => ({
      id: encodeChainAddress(chain, eoa.address),
      address: eoa.address,
      addressType: 'EOA',
      name: `EOA ${eoa.address.slice(0, 6)}…${eoa.address.slice(-4)}`,
      box: { x: 0, y: 0, width: 0, height: 0 },
      color: 0,
      fields: [],
      data: eoa,
    }),
  )

  return [...contractNodes, ...eoaNodes]
}

function mapFields(
  values: Record<string, unknown> | undefined,
  chain: string,
  implementations: string[],
  prefix = '',
): Field[] {
  if (values === undefined) {
    return []
  }
  return Object.entries(values).flatMap(
    ([key, value]: [string, unknown]): Field[] => {
      if (
        typeof value === 'string' &&
        (isAddress(value) || isChainAddress(value)) &&
        !implementations.includes(value)
      ) {
        if (value === ZERO_ADDRESS) {
          return []
        }

        return [
          {
            name: concatKey(prefix, key),
            box: { x: 0, y: 0, width: 0, height: 0 },
            target: encodeChainAddress(chain, value),
            connection: {
              from: { direction: 'left', x: 0, y: 0 },
              to: { direction: 'left', x: 0, y: 0 },
            },
          },
        ]
      } else if (typeof value === 'object' && value !== null) {
        return mapFields(
          value as Record<string, unknown>,
          chain,
          implementations,
          concatKey(prefix, key),
        )
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

function getDisplay(
  contract: DiscoveryContract,
  implementations: string[],
): {
  addressType: ApiAddressType
  name: string
} {
  const name =
    contract.name ||
    `${contract.address.slice(0, 6)}…${contract.address.slice(-4)}`
  if (implementations.length > 1) {
    return {
      addressType: 'Diamond',
      name,
    }
  }
  if (contract.proxyType === 'gnosis safe') {
    const threshold = contract.values?.['$threshold'] as number
    const members = (contract.values?.['$members'] as string[]).length
    const percentage = ((threshold / members) * 100).toFixed(0)

    return {
      addressType: 'Multisig',
      name: `${name} [${threshold}/${members} @ ${percentage}%]`,
    }
  }
  return { addressType: 'Contract', name }
}

export function getAsStringArray(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value]
  }
  if (Array.isArray(value)) {
    return value.filter((x) => typeof x === 'string')
  }
  return []
}
