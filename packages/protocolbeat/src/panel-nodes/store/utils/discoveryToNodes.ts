import type { ApiAddressType } from '../../../api/types'
import type { Field, Node } from '../State'
import type { DiscoveryContract, DiscoveryOutput } from './parseDiscovery'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const IGNORED_FIELDS = ['$pastUpgrades']

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

  const contractNodes = discovery.entries
    .filter((e) => e.type === 'Contract')
    .map((contract): Node => {
      const implementations = getAsStringArray(contract.values?.$implementation)
      const { addressType, name } = getDisplay(contract, implementations)
      return {
        id: encodeChainAddress(chain, contract.address),
        address: contract.address,
        isInitial: false,
        hasTemplate: false,
        addressType,
        name,
        box: { x: 0, y: 0, width: 0, height: 0 },
        color: 0,
        hueShift: 0,
        fields: mapFields(contract.values, chain, implementations),
        hiddenFields: [],
        data: contract,
      }
    })

  const eoaNodes = discovery.entries
    .filter((e) => e.type === 'EOA')
    .map(
      (eoa): Node => ({
        id: encodeChainAddress(chain, eoa.address),
        address: eoa.address,
        isInitial: false,
        hasTemplate: false,
        addressType: 'EOA',
        name: `EOA ${eoa.address.slice(0, 6)}…${eoa.address.slice(-4)}`,
        box: { x: 0, y: 0, width: 0, height: 0 },
        color: 0,
        hueShift: 0,
        fields: [],
        hiddenFields: [],
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
      if (IGNORED_FIELDS.includes(key)) {
        return []
      }

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
      }
      if (typeof value === 'object' && value !== null) {
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
  if (isMultisigLike(contract)) {
    const threshold = contract.values?.['$threshold'] as number
    const members = (contract.values?.['$members'] as string[]).length
    const percentage = ((threshold / members) * 100).toFixed(0)

    const nodeName = [
      `${threshold}/${members}`,
      ...(threshold === members ? [] : [`${percentage}%`]),
      name,
    ].join(' ')

    return {
      addressType: 'Multisig',
      name: nodeName,
    }
  }
  return { addressType: 'Contract', name }
}

function getAsStringArray(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value]
  }
  if (Array.isArray(value)) {
    return value.filter((x) => typeof x === 'string')
  }
  return []
}

// TODO(radomski): Duplicated from config/ProjectDiscovery.ts
// We should come up with a way to distinguish contract properties
function isMultisigLike(contract: DiscoveryContract | undefined): boolean {
  if (contract === undefined) {
    return false
  }

  const hasMembers = contract.values?.['$members'] !== undefined
  const hasThreshold = contract.values?.['$threshold'] !== undefined

  return hasMembers && hasThreshold
}
