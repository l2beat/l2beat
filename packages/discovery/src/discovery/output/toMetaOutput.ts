import { assert } from '@l2beat/backend-tools'
import { ContractValue } from '@l2beat/discovery-types'
import { isEmpty, sortBy } from 'lodash'

import { Analysis, AnalyzedContract } from '../analysis/AddressAnalyzer'
import {
  ContractMeta,
  DiscoveryMeta,
  ValueMeta,
  isEmptyValueMeta,
} from '../config/DiscoveryMeta'

export function toMetaOutput(
  results: Analysis[],
  oldMeta: DiscoveryMeta | undefined,
): DiscoveryMeta {
  const contracts = results.filter(
    (r): r is AnalyzedContract => r.type === 'Contract',
  )

  return {
    ['$schema']: getSchemaPath(oldMeta),
    contracts: sortBy(contracts, (c) => c.name).map((c) =>
      toContractMeta(c, getOldContractMeta(c, oldMeta)),
    ),
  }
}

function toContractMeta(
  contract: AnalyzedContract,
  oldContractMeta: ContractMeta,
): ContractMeta {
  const valuesMeta = toValueMeta(contract.values, oldContractMeta)

  if (contract.extendedTemplate !== undefined) {
    // If contract extends a template, keep only non-empty values (overrides)
    for (const [key, value] of Object.entries(valuesMeta)) {
      if (isEmptyValueMeta(value)) {
        delete valuesMeta[key]
      }
    }
  }

  return {
    name: contract.name,
    extends: contract.extendedTemplate,
    description: oldContractMeta.description,
    values: isEmpty(valuesMeta) ? undefined : valuesMeta,
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
    keys
      .sort()
      .map((key) => [
        key,
        (oldContractMeta.values ?? {})[key] ?? DEFAULT_REVIEW,
      ]),
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

  const DEFAULT_CONTRACT_META = {
    name: contract.name,
    values: {},
  }
  if (!oldMeta) {
    return DEFAULT_CONTRACT_META
  }

  const oldContract = oldMeta.contracts.find((m) => m.name === contract.name)
  return oldContract ?? DEFAULT_CONTRACT_META
}
