import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type {
  ContractPermission,
  RawPermissionConfiguration,
} from '../config/PermissionConfig'
import type { ContractValue, StructureEntry } from '../output/types'
import { get$Admins, toAddressArray } from '../utils/extractors'
import { interpolateString } from '../utils/interpolateString'
import { interpolateModelTemplate } from './interpolate'

interface InlineTemplate {
  content: string
  when: (
    c: StructureEntry,
    cp: ContractPermission,
    p?: RawPermissionConfiguration,
  ) => boolean
}

const addressTemplate: InlineTemplate = {
  content: `
address(
  @self,
  "&$.chain",
  "&$.address:raw").`,
  when: () => true,
}
const addressTypeContractTemplate: InlineTemplate = {
  content: `
addressType(
  @self,
  contract).`,
  when: (c) => c.type === 'Contract',
}
const addressTypeEOATemplate: InlineTemplate = {
  content: `
addressType(
  @self,
  eoa).`,
  when: (c) => c.type === 'EOA',
}
const canActIndependentlyTemplate: InlineTemplate = {
  content: `
canActIndependently(
  @self).`,
  when: (_, cp) => cp.canActIndependently === true,
}
const preventActingIndependentlyTemplate: InlineTemplate = {
  content: `
preventActingIndependently(
  @self).`,
  when: (_, cp) => cp.canActIndependently === false,
}
const permissionTemplate: InlineTemplate = {
  content: `
permission(
  &permission.to,
  "&permission.type",
  &permission.from,
  &permission.delay,
  &permission.description|quote|orNil,
  &permission.role|quote|orNil).`,
  when: () => true,
}
const permissionConditionTemplate: InlineTemplate = {
  content: `
permissionCondition(
  &permission.to,
  "&permission.type",
  &permission.from,
  &permission.delay,
  &permission.description|quote|orNil,
  &permission.role|quote|orNil,
  "&permission.condition").`,
  when: (_c, _cp, p) => p?.condition !== undefined,
}

export function contractValuesForInterpolation(
  chain: string,
  structureEntry: StructureEntry,
  contractPermission: ContractPermission | undefined,
): Record<string, ContractValue | undefined> {
  const values = structureEntry.values
  return {
    '$.chain': chain,
    '$.address': structureEntry.address.toLowerCase(),
    '$.canActIndependently': contractPermission?.canActIndependently,
    ...values,
  }
}

export function buildPermissionsModel(
  chain: string,
  contractPermission: ContractPermission,
  structureEntry: StructureEntry,
  addressToNameMap: Record<string, string>,
): string {
  const relationsModel: string[] = []

  const contractValues = contractValuesForInterpolation(
    chain,
    structureEntry,
    contractPermission,
  )

  for (const template of [
    addressTemplate,
    addressTypeContractTemplate,
    addressTypeEOATemplate,
    canActIndependentlyTemplate,
    preventActingIndependentlyTemplate,
  ]) {
    if (template.when(structureEntry, contractPermission)) {
      const interpolated = interpolateModelTemplate(
        template.content,
        contractValues,
        addressToNameMap,
      )
      relationsModel.push(interpolated)
    }
  }

  const issuedPermissions = getPermissionsDefinedOnFields(
    contractPermission,
    structureEntry,
  )

  for (const permission of issuedPermissions) {
    const valuesWithPermission: Record<string, ContractValue | undefined> = {
      ...contractValues,
      'permission.from': structureEntry.address,
      'permission.to': permission.to,
      'permission.type': permission.type,
      'permission.delay':
        typeof permission.delay === 'string'
          ? interpolateString(permission.delay, structureEntry)
          : permission.delay,
      'permission.description': interpolateString(
        permission.description,
        structureEntry,
      ),
      'permission.condition': interpolateString(
        permission.condition,
        structureEntry,
      ),
      'permission.role': permission.role ?? '.' + permission.field,
    }

    for (const template of [permissionTemplate, permissionConditionTemplate]) {
      const to = String(valuesWithPermission['permission.to']).toLowerCase()
      if (addressToNameMap[to] === undefined) {
        continue
      }
      if (template.when(structureEntry, contractPermission, permission)) {
        const interpolated = interpolateModelTemplate(
          template.content,
          valuesWithPermission,
          addressToNameMap,
        )
        relationsModel.push(interpolated)
      }
    }
  }
  return relationsModel.join('\n')
}

export function getPermissionsDefinedOnFields(
  contractPermission: ContractPermission,
  structureEntry: StructureEntry,
): (RawPermissionConfiguration & {
  to: ChainSpecificAddress
  field: string
})[] {
  const issuedPermissions = Object.entries(
    contractPermission.fields ?? {},
  ).flatMap(([field, values]) => {
    return (
      values?.permissions?.flatMap((permission) => {
        return toAddressArray(structureEntry.values?.[field]).map((to) => {
          return {
            ...permission,
            to,
            field,
          }
        })
      }) ?? []
    )
  })
  const adminPermissions = getPermissionsForAdmins(structureEntry)
  adminPermissions.forEach((ap) => {
    // add admin permission only if there's no existing upgrade permission for that address
    if (
      issuedPermissions.find((p) => p.type === 'upgrade' && p.to === ap.to) ===
      undefined
    ) {
      issuedPermissions.push(ap)
    }
  })
  return issuedPermissions
}

export function getPermissionsForAdmins(
  structureEntry: StructureEntry,
): (RawPermissionConfiguration & {
  to: ChainSpecificAddress
  field: string
})[] {
  const admins = get$Admins(structureEntry.values)
  return admins.map((admin) => {
    return {
      to: admin,
      type: 'upgrade',
      delay: 0,
      role: 'admin',
      field: '$admin',
    }
  })
}
