import { merge } from 'lodash'
import type { TemplateService } from '../analysis/TemplateService'
import type { PermissionConfig } from '../config/PermissionConfig'
import type { StructureOutput } from '../output/types'
import { buildRelationsModel } from './relations2'

export function modelPermissions(
  config: PermissionConfig,
  structure: StructureOutput,
  templateService: TemplateService,
) {
  structure.entries.forEach((e) => {
    const permissionTemplate = e.template
      ? templateService.loadContractPermissionTemplate(e.template)
      : undefined
    const mergedConfig = merge(
      {},
      permissionTemplate,
      config.overrides?.[e.address.toString()],
    )

    const model = buildRelationsModel(structure.chain, mergedConfig, e, {})
    console.log(model)
  })
}
