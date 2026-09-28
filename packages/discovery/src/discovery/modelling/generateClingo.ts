import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import type { TemplateService } from '../analysis/TemplateService'
import type { ConfigReader } from '../config/ConfigReader'
import {
  ContractPermission,
  type PermissionsConfig,
} from '../config/PermissionConfig'
import { mergePermissionContract } from '../config/permissionUtils'
import type { StructureEntry } from '../output/types'
import type { DescriptionTable } from './DescriptionTable'
import { interpolateModelTemplate } from './interpolate'
import {
  buildPermissionsModel,
  contractValuesForInterpolation,
} from './relations'

export function generateClingoFromPermissionsConfig(
  entry: StructureEntry,
  permissionsConfig: PermissionsConfig,
  templateService: TemplateService,
  addressToNameMap: Record<string, string>,
  descriptions: DescriptionTable,
) {
  const permissionTemplate =
    entry.template !== undefined
      ? templateService.loadContractPermissionTemplate(entry.template)
      : ContractPermission.parse({})
  const permissionOverride =
    permissionsConfig.overrides?.[entry.address.toString()] ??
    ContractPermission.parse({})
  const mergedPermissionsConfig = mergePermissionContract(
    permissionTemplate,
    permissionOverride,
  )

  return buildPermissionsModel(
    mergedPermissionsConfig,
    entry,
    addressToNameMap,
    descriptions,
  )
}

export function generateClingoFromModelLp(
  entry: StructureEntry,
  templateService: TemplateService,
  addressToNameMap: Record<string, string>,
): string {
  const modelTemplate = entry.template
    ? templateService.loadClingoModelTemplate(entry.template)
    : undefined
  if (modelTemplate) {
    const values = contractValuesForInterpolation(entry, undefined)
    const interpolated = interpolateModelTemplate(
      modelTemplate,
      values,
      addressToNameMap,
    )
    return interpolated
  }
  return ''
}

export function getProjectSpecificModelLp(
  project: string,
  configReader: ConfigReader,
): string | undefined {
  const projectPath = configReader.getProjectPath(project)
  const projectModelLpPath = join(projectPath, 'model.lp')
  return existsSync(projectModelLpPath)
    ? readFileSync(projectModelLpPath, 'utf8')
    : undefined
}
