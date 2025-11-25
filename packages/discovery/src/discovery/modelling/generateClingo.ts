import { existsSync, readFileSync } from 'fs'
// biome-ignore lint/style/noRestrictedImports: esm
import { merge } from 'lodash'
import { join } from 'path'
import type { TemplateService } from '../analysis/TemplateService.js'
import type { ConfigReader } from '../config/ConfigReader.js'
import type { PermissionsConfig } from '../config/PermissionConfig.js'
import type { StructureEntry } from '../output/types.js'
import { interpolateModelTemplate } from './interpolate.js'
import {
  buildPermissionsModel,
  contractValuesForInterpolation,
} from './relations.js'

export function generateClingoFromPermissionsConfig(
  entry: StructureEntry,
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

  return buildPermissionsModel(mergedPermissionsConfig, entry, addressToNameMap)
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
