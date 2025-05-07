import { undefinedIfEmpty } from '@l2beat/shared-pure'
import { getFirstSourceHash, hashFirstSource } from '../../flatten/utils'
import type { EntryParameters } from '../output/types'
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

export function getShapeFromOutputEntry(
  templateService: TemplateService,
  entry: EntryParameters,
) {
  const { sourceHashes, template } = entry

  if (!sourceHashes || !template) {
    return
  }

  const isVerified = !entry.unverified

  const sourceHash = getFirstSourceHash(isVerified, sourceHashes)

  if (!sourceHash) {
    return
  }

  return templateService.findShapeByTemplateAndHash(template, sourceHash)
}
