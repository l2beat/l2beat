import { AddressDetails, Role } from '@l2beat/discovery'

import { OPStackPermissionTemplate } from '../OpStackTypes'

export function stringFormat(str: string, ...val: string[]) {
  for (let index = 0; index < val.length; index++) {
    str = str.replaceAll(`{${index}}`, val[index])
  }
  return str
}

export function findRoleMatchingTemplate(
  contract: AddressDetails,
  template: OPStackPermissionTemplate,
  contractOverrides?: Record<string, string>,
): Role | undefined {
  return contract.roles.find(
    (r) =>
      r.name === template.role.value &&
      r.atName ===
        (contractOverrides?.[template.role.contract] ?? template.role.contract),
  )
}
