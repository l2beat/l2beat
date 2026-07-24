import { ChainSpecificAddress } from '@l2beat/shared-pure'
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
  when: (c) => c.type === 'Contract' || c.targetType === 'Contract',
}
const addressTypeEOATemplate: InlineTemplate = {
  content: `
addressType(
  @self,
  eoa).`,
  when: (c) => c.type === 'EOA' || c.targetType === 'EOA',
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
const permissionGroupTemplate: InlineTemplate = {
  content: `
permissionGroup(
  &permission.from,
  &permission.to,
  &permission.group.id|quote,
  &permission.group.name|quote,
  &permission.group.memberName|quote,
  &permission.group.threshold,
  &permission.group.admin|orNil,
  "&permission.type",
  &permission.description|quote|orNil,
  &permission.role|quote|orNil,
  &permission.group.isProjectScoped).`,
  when: (_c, _cp, p) => p?.group !== undefined,
}

export function contractValuesForInterpolation(
  structureEntry: StructureEntry,
  contractPermission: ContractPermission | undefined,
): Record<string, ContractValue | undefined> {
  const values = structureEntry.values
  return {
    '$.chain': ChainSpecificAddress.chain(structureEntry.address),
    '$.address': structureEntry.address.toLowerCase(),
    '$.canActIndependently': contractPermission?.canActIndependently,
    ...values,
  }
}

export function buildPermissionsModel(
  contractPermission: ContractPermission,
  structureEntry: StructureEntry,
  addressToNameMap: Record<string, string>,
): string | undefined {
  if (structureEntry.type === 'Reference') {
    return
  }

  const relationsModel: string[] = []

  const contractValues = contractValuesForInterpolation(
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
  assertPermissionGroupsValid(
    issuedPermissions,
    structureEntry,
    addressToNameMap,
  )

  for (const permission of issuedPermissions) {
    const groupThreshold = resolveGroupThreshold(permission, structureEntry)
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
      'permission.group.id': permission.id,
      'permission.group.name': permission.group?.name,
      'permission.group.memberName': permission.group?.memberName,
      'permission.group.threshold': groupThreshold,
      'permission.group.admin': resolveGroupAdmin(permission, structureEntry),
      'permission.group.isProjectScoped': permission.effects !== undefined,
    }

    for (const template of [
      permissionTemplate,
      permissionConditionTemplate,
      permissionGroupTemplate,
    ]) {
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

function assertPermissionGroupsValid(
  issuedPermissions: ReturnType<typeof getPermissionsDefinedOnFields>,
  structureEntry: StructureEntry,
  addressToNameMap: Record<string, string>,
) {
  const grouped = issuedPermissions.filter(
    (permission) => permission.group !== undefined,
  )
  for (const permission of grouped) {
    const group = permission.group
    if (group === undefined) {
      continue
    }
    if (permission.type !== 'interact') {
      throw new Error(
        `Permission group "${group.name}" on ${structureEntry.name ?? structureEntry.address} must use an interact permission`,
      )
    }
    if (permission.id === undefined) {
      throw new Error(
        `Permission group "${group.name}" on ${structureEntry.name ?? structureEntry.address} must define a permission id`,
      )
    }
    if (addressToNameMap[permission.to.toLowerCase()] === undefined) {
      throw new Error(
        `Permission group "${group.name}" on ${structureEntry.name ?? structureEntry.address} contains undiscovered member ${permission.to}`,
      )
    }
    const admin = resolveGroupAdmin(permission, structureEntry)
    if (
      admin !== undefined &&
      (!ChainSpecificAddress.check(admin) ||
        addressToNameMap[admin.toLowerCase()] === undefined)
    ) {
      throw new Error(
        `Permission group "${group.name}" on ${structureEntry.name ?? structureEntry.address} has undiscovered administrator ${admin}`,
      )
    }
    const threshold = resolveGroupThreshold(permission, structureEntry)
    if (threshold === undefined) {
      throw new Error(
        `Permission group "${group.name}" on ${structureEntry.name ?? structureEntry.address} must define a threshold`,
      )
    }
    const memberCount = grouped.filter(
      (candidate) => candidate.id === permission.id,
    ).length
    if (threshold < 1 || threshold > memberCount) {
      throw new Error(
        `Permission group "${group.name}" on ${structureEntry.name ?? structureEntry.address} has invalid ${threshold}/${memberCount} threshold`,
      )
    }
  }
}

function resolveGroupAdmin(
  permission: RawPermissionConfiguration,
  structureEntry: StructureEntry,
): string | undefined {
  return interpolateString(permission.group?.admin, structureEntry)
}

function resolveGroupThreshold(
  permission: RawPermissionConfiguration,
  structureEntry: StructureEntry,
): number | undefined {
  if (permission.group === undefined) {
    return undefined
  }
  const raw = permission.group.threshold
  const interpolated =
    typeof raw === 'string' ? interpolateString(raw, structureEntry) : raw
  const threshold = Number(interpolated)
  if (!Number.isInteger(threshold)) {
    throw new Error(
      `Permission group "${permission.group.name}" on ${structureEntry.name ?? structureEntry.address} must have an integer threshold`,
    )
  }
  return threshold
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
