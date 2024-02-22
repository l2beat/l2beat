import { assert } from '@l2beat/backend-tools'
import { ContractValue } from '@l2beat/discovery-types'

import { Analysis, AnalyzedContract } from '../analysis/AddressAnalyzer'
import { ContractMeta, DiscoveryMeta, ValueMeta } from '../config/DiscoveryMeta'

export function toMetaOutput(
  results: Analysis[],
  oldMeta: DiscoveryMeta | undefined,
): DiscoveryMeta {
  const contracts = results.filter(
    (r): r is AnalyzedContract => r.type === 'Contract',
  )

  return {
    ['$schema']: getSchemaPath(oldMeta),
    contracts: contracts.map((c) =>
      toContractMeta(c, getOldContractMeta(c, oldMeta)),
    ),
  }
}

function toContractMeta(
  contract: AnalyzedContract,
  oldContractMeta: ContractMeta,
): ContractMeta {
  return {
    name: contract.name,
    values: toValueMeta(contract.values, oldContractMeta),
  }
}

function toValueMeta(
  value: Record<string, ContractValue>,
  oldContractMeta: ContractMeta,
): Record<string, ValueMeta> {
  const keys = Object.keys(value)

  const DEFAULT_REVIEW = {
    description: null,
    severity: null,
    type: null,
  }

  return Object.fromEntries(
    keys.map((key) => [key, oldContractMeta.values[key] ?? DEFAULT_REVIEW]),
  )
}

function getSchemaPath(oldMeta: DiscoveryMeta | undefined): string {
  return (
    oldMeta?.$schema ??
    'https://raw.githubusercontent.com/l2beat/tools/main/schemas/meta.schema.json'
  )
}

function getOldContractMeta(
  contract: Analysis,
  oldMeta: DiscoveryMeta | undefined,
): ContractMeta {
  assert(
    contract.type === 'Contract',
    `Expected a contract, got an ${contract.type}`,
  )

  const DEFAULT_CONTRACT_META = { name: contract.name, values: {} }
  if (!oldMeta) {
    return DEFAULT_CONTRACT_META
  }

  const oldContract = oldMeta.contracts.find((m) => m.name === contract.name)
  return oldContract ?? DEFAULT_CONTRACT_META
}
