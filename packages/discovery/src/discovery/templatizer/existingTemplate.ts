/**
 * What a template that already exists does for this contract, as V1 does
 * it: which of its fields fail at this block.
 *
 * Every field is kept whatever the result. A field that fails on this
 * contract's code may still be right for the other contracts that share
 * the template, and the researcher who wrote it knew something the model
 * does not see; the model is told it fails, and the field stays.
 *
 * For a contract whose code changed, the same run decides whether the old
 * template is kept at all (`misfitOf`).
 */
import type { TemplateService } from '../analysis/TemplateService'
import type {
  StructureContract,
  StructureContractField,
} from '../config/StructureConfig'
import type { StructureContractConfig } from '../config/structureUtils'
import type { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { IProvider } from '../provider/IProvider'
import { runTemplateFields } from './draft/dryRun'

export interface ExistingTemplate {
  templateId: string
  template: StructureContract
  /** Every field of the template, in the file's order. */
  fields: string[]
  /** The fields that error at this block on this contract. Kept. */
  failing: FailingField[]
}

export interface FailingField {
  name: string
  error: string
}

/** What the committed discovered.json says of an address that had a template. */
export interface PreviousTemplate {
  templateId: string
  /**
   * The names of the bundles the shape was taken from (`getSourcesToBeMatched`):
   * the implementations behind a proxy, else the contract itself.
   * Undefined when the entry does not record them.
   */
  names: string[] | undefined
  /** The fields that already failed on the old code. */
  failingFields: string[]
}

export async function analyzeExistingTemplate(
  provider: IProvider,
  handlerExecutor: HandlerExecutor,
  templateService: TemplateService,
  config: StructureContractConfig,
  abi: string[],
  templateId: string,
): Promise<ExistingTemplate> {
  const template = templateService.loadContractTemplate(templateId)
  const { errors } = await runTemplateFields(
    provider,
    handlerExecutor,
    abi,
    config,
    template,
  )
  const fields = Object.keys(template.fields)
  return {
    templateId,
    template,
    fields,
    failing: fields
      .filter(
        (name) =>
          computesValue(template.fields[name]) && errors[name] !== undefined,
      )
      .map((name) => ({ name, error: errors[name] as string })),
  }
}

/**
 * Only a field that produces its own value can fail. One that merely
 * annotates a getter (`severity`, `description`) reports whatever the
 * getter does, and a reverting getter is not the template's failure.
 */
function computesValue(field: StructureContractField | undefined): boolean {
  return (
    field?.handler !== undefined ||
    field?.copy !== undefined ||
    field?.edit !== undefined
  )
}

/**
 * Why the old template no longer fits a contract whose code changed, or
 * undefined when it still does. Both tests are read off V1: the contract
 * kept its name, and every field that computes a value and did not fail on
 * the old code still runs on the new. A field that already failed before
 * says nothing about the new code. A template that
 * does not fit is left as it is, because the contracts it still matches
 * rely on it, and the changed contract gets a template of its own.
 */
export function misfitOf(
  existing: ExistingTemplate,
  previous: PreviousTemplate,
  names: string[],
): string | undefined {
  const reasons: string[] = []
  if (previous.names !== undefined && !sameNames(previous.names, names)) {
    reasons.push(
      `the contract was ${previous.names.join(', ')} and is now ${names.join(', ')}`,
    )
  }
  for (const field of existing.failing) {
    if (!previous.failingFields.includes(field.name)) {
      reasons.push(`${field.name} fails on the new code: ${field.error}`)
    }
  }
  return reasons.length === 0 ? undefined : reasons.join('; ')
}

function sameNames(a: string[], b: string[]): boolean {
  const left = [...a].sort()
  const right = [...b].sort()
  return (
    left.length === right.length && left.every((name, i) => name === right[i])
  )
}
