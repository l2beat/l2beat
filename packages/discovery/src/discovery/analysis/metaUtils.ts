import type { Analysis } from './AddressAnalyzer'

export function interpolateString(
  description: string,
  analysis: Omit<Analysis, 'selfMeta' | 'targetsMeta'>,
): string {
  return description.replace(/\{\{\s*((\$\.?)?\w+)\s*\}\}/g, (_match, key) => {
    const value = key === '$.address' ? analysis.address : analysis.values[key]
    if (value === undefined) {
      throw new Error(
        `Value for variable "{{ ${key} }}" in contract field not found in contract analysis`,
      )
    }
    return String(value)
  })
}

export function getSelfMeta(
  config: StructureContractConfig,
): ContractMeta | undefined {
  const result = {
    canActIndependently: config.canActIndependently,
    permissions: undefined,
  }

  return isEmptyObject(result) ? undefined : result
}

export function getTargetsMeta(
  self: EthereumAddress,
  values: Record<string, ContractValue | undefined> = {},
  fields: { [address: string]: StructureContractField } = {},
  analysis: Omit<Analysis, 'selfMeta' | 'targetsMeta'>,
): AddressToMetaMap | undefined {
  const result: AddressToMetaMap = {}

  for (const [fieldName, value] of Object.entries(values)) {
    const field = fields[fieldName]
    const target = field?.permissions
    if (target) {
      for (const address of toAddressArray(value)) {
        const meta = mergeContractMeta(
          result[address.toString()],
          targetConfigToMeta(self, field, analysis),
        )
        if (meta) {
          result[address.toString()] = meta
        }
      }
    }
  }

  // NOTE(radomski): Only add an upgrade permission if it hasn't been
  // configured previously. This is necessary because if a template configures
  // the upgrade permission with a delay, we shouldn't override it with the
  // default zero-delay permission. We always search for the smallest delay, so
  // a zero delay would always take precedence.
  for (const upgradeabilityAdmin of get$Admins(values)) {
    const permissions =
      result[upgradeabilityAdmin.toString()]?.permissions ?? []

    if (!permissions.some((p) => p.type === 'upgrade')) {
      const meta = mergeContractMeta(result[upgradeabilityAdmin.toString()], {
        permissions: [{ type: 'upgrade', target: self, delay: 0 }],
      })

      if (meta) {
        result[upgradeabilityAdmin.toString()] = meta
      }
    }
  }

  return isEmptyObject(result) ? undefined : result
}

function targetConfigToMeta(
  self: EthereumAddress,
  field: StructureContractField,
  analysis: Omit<Analysis, 'selfMeta' | 'targetsMeta'>,
): ContractMeta | undefined {
  if (field.permissions === undefined) {
    return undefined
  }

  const result: ContractMeta = {
    permissions: field.permissions?.map((p) =>
      linkPermission(p, self, analysis.values, analysis),
    ),
  }
  return isEmptyObject(result) ? undefined : result
}

function linkPermission(
  rawPermission: RawPermissionConfiguration,
  self: EthereumAddress,
  values: Analysis['values'],
  analysis: Omit<Analysis, 'selfMeta' | 'targetsMeta'>,
): PermissionConfiguration {
  let delay = rawPermission.delay
  if (typeof delay === 'string') {
    delay = valueToNumber(resolveReferenceFromValues(delay, values))
  }

  return {
    type: rawPermission.type,
    delay,
    description: rawPermission.description
      ? interpolateString(rawPermission.description, analysis)
      : undefined,
    condition: rawPermission.condition
      ? interpolateString(rawPermission.condition, analysis)
      : undefined,
    target: self,
  }
}

export function invertMeta(
  targetsMeta: Analysis['targetsMeta'][],
): AddressToMetaMap {
  const result: AddressToMetaMap = {}

  targetsMeta
    .filter(isDefined)
    .flatMap((v) => Object.entries(v))
    .forEach(([targetAddress, targetMeta]) => {
      const merged = mergeContractMeta(result[targetAddress], targetMeta)
      if (merged) {
        result[targetAddress] = merged
      }
    })

  return result
}

function isEmptyObject(obj: object): boolean {
  return (
    Object.keys(obj).length === 0 ||
    Object.values(obj).every((value) => value === undefined || value === false)
  )
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined
}
