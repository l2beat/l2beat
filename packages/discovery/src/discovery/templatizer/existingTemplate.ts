/**
 * What a template that already exists does for this contract, as V1 does
 * it: which of its fields run here, which fail at this block, and which
 * worklist items it already decides.
 *
 * Every field is kept whatever the result. A field that fails on this
 * contract's code may still be right for the other contracts that share
 * the template, and the researcher who wrote it knew something the model
 * does not see; the failure becomes a `review:` note above the field, not
 * a deletion. The model is asked only about the items no field reads and
 * the template does not ignore.
 */
import type { TemplateService } from '../analysis/TemplateService'
import type {
  StructureContract,
  StructureContractField,
} from '../config/StructureConfig'
import type { StructureContractConfig } from '../config/structureUtils'
import type { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { IProvider } from '../provider/IProvider'
import { naturalCovers } from './draft/checkCovers'
import type { DraftHandler } from './draft/Draft'
import { runTemplateFields } from './draft/dryRun'
import type { Worklist } from './worklist'

export interface ExistingTemplate {
  templateId: string
  template: StructureContract
  /** Every field of the template, in the file's order. */
  fields: string[]
  /** The fields that error at this block on this contract. Kept, with a note. */
  failing: FailingField[]
}

export interface FailingField {
  name: string
  error: string
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
 * The worklist minus what the template already decides: items its fields
 * read, and methods it ignores. A researcher's `ignoreMethods` is a
 * verdict, so the model is not asked to repeat it.
 */
export function remainingWorklist(
  worklist: Worklist,
  existing: ExistingTemplate,
): Worklist {
  const read = readByFields(existing, worklist)
  const ignored = new Set(existing.template.ignoreMethods)
  const constructorItem = worklist.constructorItem
  return {
    items: worklist.items.filter(
      (item) => !read.has(item.signature) && !ignored.has(item.name),
    ),
    ...(constructorItem !== undefined &&
      !read.has(constructorItem.signature) && { constructorItem }),
    events: worklist.events.filter((event) => !read.has(event.name)),
  }
}

function readByFields(
  existing: ExistingTemplate,
  worklist: Worklist,
): Set<string> {
  const read = new Set<string>()
  for (const name of existing.fields) {
    const handler = existing.template.fields[name]?.handler
    if (handler === undefined) {
      continue
    }
    const covers = naturalCovers(name, handler as DraftHandler, worklist)
    for (const token of [...covers.functions, ...covers.events]) {
      read.add(token)
    }
  }
  return read
}

/** The `review:` note an existing field gets when it fails at this block. */
export function failureNote(blockNumber: number, field: FailingField): string {
  return `review: fails at block ${blockNumber}: ${field.error}`
}
