import type { EthereumAddress } from '@l2beat/shared-pure'
import type { ContractPermission } from '../config/PermissionConfig'
import type { RawPermissionConfiguration } from '../config/StructureConfig'
import type { StructureEntry } from '../output/types'
import type { ContractValue } from '../output/types'
import { get$Admins, toAddressArray } from '../utils/extractors'
import { interpolateString } from '../utils/interpolateString'
import { interpolateModelTemplate } from './interpolate'

interface InlineTemplate {
  content: string
  when: (c: StructureEntry, p?: RawPermissionConfiguration) => boolean
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
const permissionTemplate: InlineTemplate = {
  content: `
permission(
  &permission.to,
  "&permission.type",
  &permission.from).`,
  when: () => true,
}
const permissionDescriptionTemplate: InlineTemplate = {
  content: `
permissionDescription(
  &permission.to,
  "&permission.type",
  &permission.from,
  "&permission.description").`,
  when: (_, p) => p?.description !== undefined,
}
const permissionDelayTemplate: InlineTemplate = {
  content: `
permissionDelay(
  &permission.to,
  "&permission.type",
  &permission.from,
  &permission.delay).`,
  when: (_, p) => p?.delay !== undefined && p.delay !== 0,
}
const permissionConditionTemplate: InlineTemplate = {
  content: `
permissionCondition(
  &permission.to,
  "&permission.type",
  &permission.from,
  "&permission.condition").`,
  when: (_, p) => p?.condition !== undefined,
}

export function contractValuesForInterpolation(
  chain: string,
  entry: StructureEntry,
): Record<string, ContractValue | undefined> {
  const values = entry.values
  return {
    '$.chain': chain,
    '$.address': entry.address.toLowerCase(),
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

  const contractValues = contractValuesForInterpolation(chain, structureEntry)

  for (const template of [
    addressTemplate,
    addressTypeContractTemplate,
    addressTypeEOATemplate,
  ]) {
    if (template.when(structureEntry)) {
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
    }

    for (const template of [
      permissionTemplate,
      permissionDescriptionTemplate,
      permissionDelayTemplate,
      permissionConditionTemplate,
    ]) {
      if (template.when(structureEntry, permission)) {
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
): (RawPermissionConfiguration & { to: EthereumAddress })[] {
  const issuedPermissions = Object.entries(
    contractPermission.fields ?? {},
  ).flatMap(([field, values]) => {
    return (
      values?.permissions?.flatMap((permission) => {
        return toAddressArray(structureEntry.values?.[field]).map((to) => {
          return {
            ...permission,
            to,
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
): (RawPermissionConfiguration & { to: EthereumAddress })[] {
  const admins = get$Admins(structureEntry.values)
  return admins.map((admin) => {
    return {
      to: admin,
      type: 'upgrade',
      delay: 0,
    }
  })
}
