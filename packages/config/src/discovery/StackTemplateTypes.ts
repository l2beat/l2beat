export type StackPermissionsTag = 'admin' | 'owner' | 'owned'

export const StackPermissionsTagDescription: Record<StackPermissionsTag, string> = {
  admin: 'Admin of {0}.',
  owner: 'Owner of {0}.',
  owned: 'Owned by {0}.',
}

export interface StackPermissionTemplate {
  role: { value: string; contract: string }
  description?: string
  tags?: StackPermissionsTag[]
}
