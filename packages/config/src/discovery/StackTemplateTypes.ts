export type StackPermissionsTag = 'admin' | 'owner'

export interface StackPermissionsTagDescription {
  direct: string
  referenced?: string
}

export const StackPermissionsTagDescriptions: Record<
  StackPermissionsTag,
  StackPermissionsTagDescription
> = {
  admin: { direct: 'Admin of {0}.' },
  owner: { direct: 'Owner of {0}.', referenced: 'Owned by {0}.' },
}

export interface StackPermissionTemplate {
  role: { value: string; contract: string }
  description?: string
  tags?: StackPermissionsTag[]
}
