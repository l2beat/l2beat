import type {
  ContractParameters,
  ContractValue,
  DiscoveryOutput,
  EoaParameters,
  ReceivedPermission,
} from '@l2beat/discovery-types'
import {
  contractValuesForInterpolation,
  interpolateModelTemplate,
  isContract,
} from './interpolate'

const RELATIONS_FILENAME = 'relations.lp'
interface InlineTemplate {
  content: string
  when: (
    c: ContractParameters | EoaParameters,
    p?: ReceivedPermission,
  ) => boolean
}

const contractTemplate: InlineTemplate = {
  content: `
contract(
  @self,
  "#$.address:raw",
  "#$.name").`,
  when: (c) => isContract(c),
}
const contractDescriptionTemplate: InlineTemplate = {
  content: `
contractDescription(
  @self,
  "#$.description").`,
  when: (c) => isContract(c) && c.description !== undefined,
}
const eoaTemplate: InlineTemplate = {
  content: `
eoa(
  @self,
  "#$.address:raw",
  "#$.name").`,
  when: (c) => !isContract(c),
}
const permissionTemplate: InlineTemplate = {
  content: `
permission(
  @self,
  "#permission.type",
  #permission.giver).`,
  when: () => true,
}
const permissionDescriptionTemplate: InlineTemplate = {
  content: `
permissionDescription(
  @self,
  "#permission.type",
  #permission.giver,
  "#permission.description").`,
  when: (_, p) => p?.description !== undefined,
}
const permissionDelayTemplate: InlineTemplate = {
  content: `
permissionDelay(
  @self,
  "#permission.type",
  #permission.giver,
  #permission.delay).`,
  when: (_, p) => p?.delay !== undefined && p.delay !== 0,
}

export function buildRelationsModels(
  discoveryOutput: DiscoveryOutput,
  addressToNameMap: Record<string, string>,
): Record<string, string[]> {
  const relationsModel: string[] = []
  for (const contractOrEoa of [
    ...discoveryOutput.contracts,
    ...discoveryOutput.eoas,
  ]) {
    const contractValues = contractValuesForInterpolation(contractOrEoa)
    
    for (const template of [
      contractTemplate,
      contractDescriptionTemplate,
      eoaTemplate,
    ]) {
      if (template.when(contractOrEoa)) {
        const interpolated = interpolateModelTemplate(
          template.content,
          contractValues,
          addressToNameMap,
        )
        relationsModel.push(interpolated)
      }
    }

    const directlyReceivedPermissions =
      findAllDirectlyReceivedPermissions(contractOrEoa)

    for (const permission of directlyReceivedPermissions) {
      const valuesWithPermission: Record<string, ContractValue | undefined> = {
        ...contractValues,
        'permission.type': permission.permission,
        'permission.giver': permission.from,
        'permission.description': permission.description,
        'permission.delay': permission.delay,
      }
      
      for (const template of [
        permissionTemplate,
        permissionDescriptionTemplate,
        permissionDelayTemplate,
      ]) {
        if (template.when(contractOrEoa, permission)) {
          const interpolated = interpolateModelTemplate(
            template.content,
            valuesWithPermission,
            addressToNameMap,
          )
          relationsModel.push(interpolated)
        }
      }
    }
  }
  return { [RELATIONS_FILENAME]: relationsModel }
}

export function findAllDirectlyReceivedPermissions(
  contractOrEoa: ContractParameters | EoaParameters,
) {
  return [
    ...(contractOrEoa.directlyReceivedPermissions ?? []),
    ...(contractOrEoa.receivedPermissions?.filter(
      (p) => (p.via ?? []).length === 0,
    ) ?? []),
  ]
}
