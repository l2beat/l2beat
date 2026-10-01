/**
 * "Never change what works", enforced by code rather than asked of the
 * model.
 *
 * When an address that had a template shows new code, the old template is
 * first run against the new code. Fields that still execute are locked:
 * the model never sees them as its own, they are copied into the new file
 * byte for byte, and the items they answer leave the worklist. Only the
 * broken fields and the items nobody answers are the model's to rule on.
 * When nothing broke, the new shape joins the old template and no model is
 * asked at all.
 */
import type { TemplateService } from '../analysis/TemplateService'
import type {
  StructureContract,
  StructureContractField,
} from '../config/StructureConfig'
import type { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { IProvider } from '../provider/IProvider'
import type { DraftHandler } from './draft/Draft'
import { runTemplateFields } from './draft/dryRun'
import { naturalCovers } from './draft/validateDraft'
import type { ContractFacts } from './facts'
import type { Worklist } from './worklist'

export interface FreezeAnalysis {
  templateId: string
  template: StructureContract
  /** Fields that still execute on the new code, in the old file's order. */
  locked: string[]
  broken: { name: string; error: string }[]
}

export async function analyzeFreeze(
  provider: IProvider,
  handlerExecutor: HandlerExecutor,
  templateService: TemplateService,
  facts: ContractFacts,
  templateId: string,
): Promise<FreezeAnalysis> {
  const template = templateService.loadContractTemplate(templateId)
  const { errors } = await runTemplateFields(
    provider,
    handlerExecutor,
    facts,
    template,
  )
  const names = Object.keys(template.fields)
  const isBroken = (name: string) =>
    computesValue(template.fields[name]) && errors[name] !== undefined
  return {
    templateId,
    template,
    locked: names.filter((name) => !isBroken(name)),
    broken: names
      .filter(isBroken)
      .map((name) => ({ name, error: errors[name] as string })),
  }
}

/**
 * Only a field that produces its own value can break. One that merely
 * annotates a getter (`severity`, `description`) stays whatever the getter
 * does, so its annotations are never lost to a revert.
 */
function computesValue(field: StructureContractField | undefined): boolean {
  return (
    field?.handler !== undefined ||
    field?.copy !== undefined ||
    field?.edit !== undefined
  )
}

export function nothingBroke(freeze: FreezeAnalysis): boolean {
  return freeze.broken.length === 0
}

/**
 * The worklist minus what the old template already decided: items its
 * locked fields answer, and methods it chose to ignore. A researcher's
 * `ignoreMethods` is a verdict, so the model is not asked to repeat it.
 */
export function remainingWorklist(
  worklist: Worklist,
  freeze: FreezeAnalysis,
  facts: Pick<ContractFacts, 'abi'>,
): Worklist {
  const answered = answeredByLockedFields(freeze, facts)
  const ignored = new Set(freeze.template.ignoreMethods)
  return {
    items: worklist.items.filter(
      (item) => !answered.has(item.signature) && !ignored.has(item.name),
    ),
    events: worklist.events.filter((event) => !answered.has(event.name)),
  }
}

function answeredByLockedFields(
  freeze: FreezeAnalysis,
  facts: Pick<ContractFacts, 'abi'>,
): Set<string> {
  const answered = new Set<string>()
  for (const name of freeze.locked) {
    const handler = freeze.template.fields[name]?.handler
    if (handler === undefined) {
      continue
    }
    const covers = naturalCovers(name, handler as DraftHandler, facts)
    for (const token of [...covers.functions, ...covers.events]) {
      answered.add(token)
    }
  }
  return answered
}

/** The locked fields' definitions, for the dry run of a draft that may reference them. */
export function lockedFields(
  freeze: FreezeAnalysis,
): StructureContract['fields'] {
  return Object.fromEntries(
    freeze.locked.map((name) => [name, freeze.template.fields[name] ?? {}]),
  )
}
