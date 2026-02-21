import rolePermissionsConfig from '../../config/role-permissions.json'

export type SessionRole = 'owner' | 'client_admin' | 'customer' | null

export type AppPermission =
  | 'changes.create'
  | 'changes.view_own'
  | 'changes.view_all'
  | 'changes.review'
  | 'content.manage'
  | 'docs.view'
  | 'work_items.view'
  | 'work_items.manage'
  | 'reports.view'
  | 'settings.manage'

type RolePermissionMap = Record<'owner' | 'client_admin' | 'customer', AppPermission[]>

export const ROLE_PERMISSIONS = rolePermissionsConfig.permissions as RolePermissionMap

export function getRolePermissions(role: SessionRole): Set<AppPermission> {
  if (!role) return new Set<AppPermission>()
  return new Set<AppPermission>(ROLE_PERMISSIONS[role] || [])
}

export function can(role: SessionRole, permission: AppPermission): boolean {
  return getRolePermissions(role).has(permission)
}
