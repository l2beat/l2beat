import { merge } from 'lodash'
import type { TemplateService } from '../analysis/TemplateService'
import type { PermissionConfig } from '../config/PermissionConfig'
import type {
  IssuedPermission,
  PermissionOutput,
  StructureOutput,
} from '../output/types'
import { toAddressArray } from '../utils/extractors'

export function modelPermissions(
  config: PermissionConfig,
  structure: StructureOutput,
  templateService: TemplateService,
): PermissionOutput {
  const resultEntries: Record<string, IssuedPermission[]> = {}

  structure.entries.forEach((e) => {
    const permissionTemplate = e.template
      ? templateService.loadContractPermissionTemplate(e.template)
      : undefined
    const mergedConfig = merge(
      {},
      permissionTemplate,
      config.overrides?.[e.address.toString()],
    )

    const issuedPermissions = Object.entries(mergedConfig.fields ?? {}).flatMap(
      ([field, values]) => {
        return (
          values?.permissions?.flatMap((p) => {
            return toAddressArray(e.values?.[field]).map((to) => {
              return {
                to,
                permission: p.type,
                delay: Number(p.delay),
                description: p.description,
                condition: p.condition,
              }
            })
          }) ?? []
        )
      },
    )
    if (issuedPermissions.length > 0) {
      resultEntries[e.address.toString()] = issuedPermissions
    }
  })

  return { entries: resultEntries }
}
