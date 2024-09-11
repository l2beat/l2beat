import { oklch2rgb } from '../utils/oklch'
import { stringHash } from '../utils/stringHash'
import type { ContractNode, EOANode, SimpleNode } from './SimpleNode'
import type { DiscoveryContract, DiscoveryOutput } from './paseDiscovery'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function transformContracts(discovery: DiscoveryOutput): SimpleNode[] {
  const color = oklch2rgb(0.75, 0.12, stringHash(discovery.chain) % 360)

  const contractNodes: ContractNode[] = discovery.contracts.map((contract) => {
    const implementations = getAsStringArray(contract.values?.$implementation)
    return {
      type: 'Contract',
      id: contract.address,
      color,
      name: emojifyContractName(contract),
      proxyType: contract.proxyType,
      discovered: true,
      fields: mapFields(contract.values).filter(
        (x) => !x.connection || !implementations.includes(x.connection),
      ),
      data: contract,
    }
  })

  const eoaNodes: EOANode[] = discovery.eoas.map((eoa) => ({
    type: 'EOA',
    id: eoa.address,
    color,
    name: `🧍 EOA ${eoa.address}`,
    discovered: true,
    fields: [],
    data: eoa,
  }))

  return [...contractNodes, ...eoaNodes]
}

interface FieldProps {
  name: string
  value?: string
  connection?: string
}

function mapFields(
  values: Record<string, unknown> | undefined,
  prefix = '',
): FieldProps[] {
  if (values === undefined) {
    return []
  }
  return Object.entries(values).flatMap(
    ([key, value]: [string, unknown]): FieldProps[] => {
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
      } else if (typeof value === 'object' && value !== null) {
        return mapFields(
          value as Record<string, unknown>,
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

function emojifyContractName(contract: DiscoveryContract): string {
  if (contract.proxyType === 'gnosis safe') {
    const threshold = contract.values?.['$threshold'] as number
    const members = (contract.values?.['$members'] as string[]).length
    const percentage = ((threshold / members) * 100).toFixed(0)

    return `🔐 ${contract.name} [${threshold}/${members} @ ${percentage}%]`
  }

  if (contract.values?.$immutable !== true) {
    return '🔗 ' + contract.name
  }

  return contract.name
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
