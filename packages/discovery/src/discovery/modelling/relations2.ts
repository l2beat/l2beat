import type { EthereumAddress } from '@l2beat/shared-pure'
import type { ContractPermission } from '../config/PermissionConfig'
import type { RawPermissionConfiguration } from '../config/StructureConfig'
import type { StructureEntry } from '../output/types'
import type { ContractValue } from '../output/types'
import { toAddressArray } from '../utils/extractors'
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

export function buildRelationsModel(
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
      'permission.delay': permission.delay,
      'permission.description': permission.description,
      'permission.condition': permission.condition,
    }

    for (const template of [
      permissionTemplate,
      permissionDescriptionTemplate,
      permissionDelayTemplate,
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
      values?.permissions?.flatMap((p) => {
        return toAddressArray(structureEntry.values?.[field]).map((to) => {
          return {
            ...p,
            to,
          }
        })
      }) ?? []
    )
  })
  return issuedPermissions
}
