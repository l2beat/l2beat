import { merge } from 'lodash'
import type { TemplateService } from '../analysis/TemplateService'
import type { PermissionsConfig } from '../config/PermissionConfig'
import type { StructureEntry } from '../output/types'
import { interpolateModelTemplate } from './interpolate'
import {
  buildPermissionsModel,
  contractValuesForInterpolation,
} from './relations'

export function generateClingoFromPermissionsConfig(
  entry: StructureEntry,
  chain: string,
  permissionsConfig: PermissionsConfig,
  templateService: TemplateService,
  addressToNameMap: Record<string, string>,
) {
  const permissionTemplate = entry.template
    ? templateService.loadContractPermissionTemplate(entry.template)
    : undefined
  const mergedPermissionsConfig = merge(
    {},
    permissionTemplate,
    permissionsConfig.overrides?.[entry.address.toString()],
  )

  return buildPermissionsModel(
    chain,
    mergedPermissionsConfig,
    entry,
    addressToNameMap,
  )
}

export function generateClingoFromModelLp(
  entry: StructureEntry,
  chain: string,
  templateService: TemplateService,
  addressToNameMap: Record<string, string>,
): string {
  const modelTemplate = entry.template
    ? templateService.loadClingoModelTemplate(entry.template)
    : undefined
  if (modelTemplate) {
    const values = contractValuesForInterpolation(chain, entry, undefined)
    const interpolated = interpolateModelTemplate(
      modelTemplate,
      values,
      addressToNameMap,
    )
    return interpolated
  }
  return ''
}
