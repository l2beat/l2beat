import {
  getHashForMatchingFromSources,
  getHashToBeMatched,
} from '../../flatten/utils.js'
import type { EntryParameters } from '../output/types.js'
import type { AnalyzedContract } from './AddressAnalyzer.js'
import type { TemplateService } from './TemplateService.js'

export function getShapeFromAnalyzedContract(
  templateService: TemplateService,
  entry: AnalyzedContract,
) {
  const { extendedTemplate } = entry

  if (!extendedTemplate) {
    return
  }

  const sourceHash = getHashForMatchingFromSources(entry.sourceBundles)

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

  if (!sourceHashes || !template || entry.unverified) {
    return
  }

  const hashToBeMatched = getHashToBeMatched(sourceHashes)

  if (!hashToBeMatched) {
    return
  }

  return templateService.findShapeByTemplateAndHash(template, hashToBeMatched)
}
