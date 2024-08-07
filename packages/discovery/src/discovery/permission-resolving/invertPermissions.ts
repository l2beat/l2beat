import { GrantedPermission } from './resolvePermissions'

export type AssignedPermission = GrantedPermission

export function invertGrantedPermissions(
  input: GrantedPermission[],
): AssignedPermission[] {
  return input.map((entry) => {
    return {
      type: entry.type,
      path: entry.path.reverse(),
    }
  })
}
