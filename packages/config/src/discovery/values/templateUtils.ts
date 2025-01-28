import type { InvertedAddressDetails, Role } from '@l2beat/discovery'

import type { StackPermissionTemplate } from '../StackTemplateTypes'

export function stringFormat(str: string, ...val: string[]) {
  for (let index = 0; index < val.length; index++) {
    str = str.replaceAll(`{${index}}`, val[index])
  }
  return str
}

export function findRoleMatchingTemplate(
  contract: InvertedAddressDetails,
  template: StackPermissionTemplate,
  contractOverrides?: Record<string, string>,
): Role | undefined {
  const roleNameMatches = (templateName: string, roleName: string): boolean => {
    function isNumeric(str: string): boolean {
      if (str === '') return false
      return !isNaN(+str)
    }

    // I really don't want to use regexes
    const matchesExact = templateName === roleName
    if (!matchesExact && roleName.startsWith(templateName)) {
      const suffix = roleName.slice(templateName.length)
      return suffix.startsWith('.') && isNumeric(suffix.slice(1))
    }

    return matchesExact
  }

  return contract.roles.find(
    (r) =>
      roleNameMatches(template.role.value, r.name) &&
      r.atName ===
        (contractOverrides?.[template.role.contract] ?? template.role.contract),
  )
}
