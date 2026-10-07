/**
 * Puts an authored template where a researcher would have put it and makes
 * V1 match it: `template.jsonc` in `_templates/<project>/<ContractName>/`,
 * the shape in `shapes.json` through `TemplateService.addToShape`, then a
 * reload and a match check.
 *
 * The match check is the point of the whole step: V1 matches by the hash of
 * one specific bundle (or of the implementations combined), and a shape
 * recorded from the wrong bundle would be written, committed and never
 * match. So the id is returned only after `findMatchingTemplates` found it.
 */
import { ChainSpecificAddress, type Hash256 } from '@l2beat/shared-pure'
import { getSourcesToBeMatched } from '../../../flatten/utils'
import type { TemplateService } from '../../analysis/TemplateService'
import type { ContractSources } from '../../source/SourceCodeService'
import type { ContractFacts } from '../facts'

export interface ShapeTarget {
  facts: ContractFacts
  sources: ContractSources
}

/** `<project>/<ContractName>`, or with the shape hash when that name is taken by another shape. */
export function chooseTemplateId(
  templateService: TemplateService,
  facts: Pick<ContractFacts, 'project' | 'name' | 'shapeHash'>,
): string {
  const base = `${facts.project}/${facts.name}`
  if (!templateService.exists(base)) {
    return base
  }
  const suffixed = `${base}-${shortHash(facts.shapeHash)}`
  if (templateService.exists(suffixed)) {
    throw new Error(
      `Template ids ${base} and ${suffixed} both exist and neither matches this shape`,
    )
  }
  return suffixed
}

/**
 * The file `ensureTemplateExists` creates, holding only its `$schema`, with
 * `render` filling it in; then the shape.
 */
export function writeNewTemplate(
  templateService: TemplateService,
  templateId: string,
  render: (text: string) => string,
  target: ShapeTarget,
): void {
  templateService.ensureTemplateExists(templateId)
  const text = templateService.readTemplateFile(templateId) ?? ''
  templateService.writeTemplateFile(templateId, render(text))
  addShape(templateService, templateId, target)
}

/** A template whose shapes stay as they are; the reload drops the parsed copy V1 caches. */
export function replaceTemplateText(
  templateService: TemplateService,
  templateId: string,
  text: string,
): void {
  templateService.writeTemplateFile(templateId, text)
  templateService.reload()
}

export function addShape(
  templateService: TemplateService,
  templateId: string,
  { facts, sources }: ShapeTarget,
): void {
  const bundles = getSourcesToBeMatched(sources.sources)
  templateService.addToShape(
    templateId,
    facts.chain,
    bundles.map((bundle) => ChainSpecificAddress.address(bundle.address)),
    shapeFileName(templateService, templateId, facts),
    facts.blockNumber,
    bundles.map((bundle) => bundle.source),
  )
  templateService.reload()
  assertMatches(templateService, templateId, facts, sources)
}

/** `<ContractName>.sol` by the existing convention, `<ContractName>_<hash8>` when a shape already has that key. */
function shapeFileName(
  templateService: TemplateService,
  templateId: string,
  facts: Pick<ContractFacts, 'name' | 'shapeHash'>,
): string {
  const existing = templateService.readShapeFile(templateId)
  const keys = new Set(
    existing === undefined ? [] : Object.keys(JSON.parse(existing)),
  )
  const conventional = `${facts.name}.sol`
  return keys.has(conventional)
    ? `${facts.name}_${shortHash(facts.shapeHash)}`
    : conventional
}

function assertMatches(
  templateService: TemplateService,
  templateId: string,
  facts: Pick<ContractFacts, 'address'>,
  sources: ContractSources,
): void {
  const matching = templateService.findMatchingTemplates(sources, facts.address)
  if (!matching.includes(templateId)) {
    throw new Error(
      `Template ${templateId} was written but V1 does not match it for ${facts.address} (matches: ${matching.join(', ') || 'none'})`,
    )
  }
}

function shortHash(hash: Hash256): string {
  return hash.toString().slice(2, 10)
}
