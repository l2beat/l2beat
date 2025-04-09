import { hashFirstSource } from '../../flatten/utils'
import { undefinedIfEmpty } from '../output/toDiscoveryOutput'
import type { AnalyzedContract } from './AddressAnalyzer'
import type { TemplateService } from './TemplateService'

export function getShapeFromAnalyzedContract(
  templateService: TemplateService,
  entry: AnalyzedContract,
) {
  const { extendedTemplate, sourceBundles } = entry

  const sourceHashes = undefinedIfEmpty(
    sourceBundles.map((b) => b.hash as string),
  )

  if (!extendedTemplate || !sourceHashes) {
    return
  }

  const sourceHash = hashFirstSource(entry.isVerified, entry.sourceBundles)

  if (!sourceHash) {
    return
  }

  return templateService.findShapeByTemplateAndHash(
    extendedTemplate.template,
    sourceHash,
  )
}
