/**
 * Authors a V1 template for a contract no template matches, from inside
 * the analyzer, so a local run with `--ai` comes out fully templatized.
 *
 * Three things here are about the engine rather than about templates:
 * - the engine analyses every address of one depth concurrently, so two
 *   addresses with the same code would both author; requests are deduped
 *   by shape hash, and the second waits for the first's result;
 * - model turns are serialised process-wide (one at a time), because the
 *   CLIs behind them are rate-limited accounts, not a pool; RPC dry runs
 *   of different contracts may still overlap;
 * - a contract it was asked about and could not templatize stops the run
 *   with a `TemplatizationFailedError`, rather than leaving the contract
 *   untemplatized where nobody can tell a failure from a decision.
 *
 * The backend never constructs this class; it is built by
 * `getDiscoveryEngine` only when a CLI run passes templatizer settings.
 */
import type { Logger } from '@l2beat/backend-tools'
import type { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { getHashForMatchingFromSources } from '../../flatten/utils'
import { getErrorMessage } from '../../utils/getErrorMessage'
import type { TemplateService } from '../analysis/TemplateService'
import type { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { ContractValue } from '../output/types'
import type { IProvider } from '../provider/IProvider'
import type { ContractSources } from '../source/SourceCodeService'
import { FileArtifactSink, trailDirectory } from './artifacts'
import { buildBaseline } from './baseline'
import { dryRunDraft } from './draft/dryRun'
import { advisoriesOf, fieldPath } from './draft/Finding'
import { isFieldPath } from './draft/ruleContext'
import type { ContractFacts } from './facts'
import { flattenSources } from './flattenSources'
import {
  analyzeFreeze,
  type FreezeAnalysis,
  lockedFields,
  nothingBroke,
  remainingWorklist,
} from './freeze'
import { authorDraft, DEFAULT_MAX_ROUNDS, type LoopResult } from './loop'
import { describeModel } from './model/createModelClient'
import { type ModelClient, ModelUnavailableError } from './model/ModelClient'
import { SerialModelClient } from './model/SerialModelClient'
import { buildPrompt } from './prompt/buildPrompt'
import {
  TemplatizationFailedError,
  type TemplatizationTask,
} from './TemplatizationFailedError'
import { buildWorklist, isEmptyWorklist, type Worklist } from './worklist'
import { deriveIgnoreMethods } from './write/ignoreMethods'
import { readFieldEntries, readTopLevelEntries } from './write/jsoncEntries'
import { renderTemplateFile, schemaPathFor } from './write/templateFile'
import {
  addShape,
  chooseTemplateId,
  replaceTemplateText,
  rewriteTemplate,
  writeNewTemplate,
} from './write/writeTemplate'

export interface TemplatizerSettings {
  project: string
  model: ModelClient
  /** How the model is named in the provenance header when the client cannot say. */
  modelLabel: string
  /** The reasoning effort the client runs at, for the header and the trail. */
  effort?: string
  /** Model turns per contract, the first included. */
  maxRounds?: number
  /** Where the per-contract trail goes: `<artifactsRoot>/<project>/<address>/`. */
  artifactsRoot: string
  /** Address → template id in the committed discovered.json, for the freeze path. */
  previousTemplates: Record<string, string>
  /** `--ai-revisit`: also extend templates that already match, see `revisit`. */
  revisit?: boolean
  /**
   * `stop` (the default) ends discovery on any failure; the benchmark sets
   * `leave-untemplatized`, because a contract the model cannot author is a
   * measurement there. A model that does not answer stops both.
   */
  onFailure?: 'stop' | 'leave-untemplatized'
  now?: () => Date
}

export interface TemplatizeRequest {
  provider: IProvider
  address: ChainSpecificAddress
  sources: ContractSources
  proxyType?: string
  proxyValues: Record<string, ContractValue | undefined>
  implementationNames: Record<string, string>
  /** What the untemplatized handler run produced: the baseline. */
  values: Record<string, ContractValue | undefined>
  errors: Record<string, string>
  ignoreMethods: string[]
}

export class Templatizer {
  private readonly inFlight = new Map<string, Promise<string | undefined>>()
  private readonly revisits = new Map<string, Promise<void>>()
  /** Templates this run wrote, which a revisit must not ask about again. */
  private readonly touched = new Set<string>()
  private readonly model: SerialModelClient

  constructor(
    private readonly templateService: TemplateService,
    private readonly handlerExecutor: HandlerExecutor,
    private readonly settings: TemplatizerSettings,
    private readonly logger: Logger,
  ) {
    this.model = new SerialModelClient(settings.model)
  }

  /**
   * Unverified code has no shape to key a template on, and EIP-2535
   * diamonds, whose facets change independently, are not templatized by V1
   * either. Two-implementation proxies (Arbitrum's RollupProxy) are: V1
   * matches them on the implementations' combined hash.
   */
  canTemplatize(sources: ContractSources, proxyType: string | undefined) {
    return (
      sources.isVerified &&
      !isDiamond(proxyType) &&
      getHashForMatchingFromSources(sources.sources) !== undefined
    )
  }

  templateFor(request: TemplatizeRequest): Promise<string | undefined> {
    const hash = getHashForMatchingFromSources(request.sources.sources)
    if (hash === undefined) {
      return Promise.resolve(undefined)
    }
    const key = hash.toString()
    const pending = this.inFlight.get(key)
    if (pending !== undefined) {
      return pending
    }
    const authored = this.templatizeOrStop(request, hash)
    this.inFlight.set(key, authored)
    return authored
  }

  private async templatizeOrStop(
    request: TemplatizeRequest,
    hash: Hash256,
  ): Promise<string | undefined> {
    const task = authoringTask(request)
    try {
      return await this.templatize(request, hash, task)
    } catch (error) {
      return this.stopOrLeave(error, task)
    }
  }

  /**
   * Discovery stops on any failure (see `TemplatizationFailedError`), and
   * the queue is closed so no other contract's turn starts meanwhile. The
   * benchmark instead records a contract the model could not author as a
   * miss, which is what it measures; a model that does not answer stops it
   * too.
   */
  private stopOrLeave(error: unknown, task: TemplatizationTask): undefined {
    const failed =
      error instanceof TemplatizationFailedError
        ? error
        : new TemplatizationFailedError(
            'internal',
            task,
            getErrorMessage(error),
            undefined,
            { cause: error },
          )
    if (
      this.settings.onFailure === 'leave-untemplatized' &&
      failed.failure !== 'model-unavailable'
    ) {
      this.logger.warn(failed.message)
      return undefined
    }
    this.model.close(failed)
    throw failed
  }

  private async templatize(
    request: TemplatizeRequest,
    hash: Hash256,
    task: TemplatizationTask,
  ): Promise<string> {
    const facts = this.buildFacts(request, hash)
    const worklist = buildWorklist(facts.abi)
    const previous = this.previousTemplateOf(request.address)
    if (previous !== undefined) {
      return await this.extendPrevious(request, facts, worklist, previous, task)
    }
    if (isEmptyWorklist(worklist)) {
      return this.writeWithoutModel(request, facts)
    }
    return await this.authorNew(request, facts, worklist, task)
  }

  private buildFacts(request: TemplatizeRequest, hash: Hash256): ContractFacts {
    const { provider, sources } = request
    return {
      project: this.settings.project,
      chain: provider.chain,
      address: request.address,
      blockNumber: provider.blockNumber,
      name: sources.name,
      proxyType: request.proxyType,
      proxyValues: request.proxyValues,
      implementationNames: request.implementationNames,
      abi: sources.abi,
      bundles: sources.sources,
      sources: flattenSources(sources.sources, this.logger),
      shapeHash: hash,
      baseline: buildBaseline(
        sources.abi,
        request.ignoreMethods,
        request.values,
        request.errors,
      ),
    }
  }

  /** Only a template that still exists can be extended; a deleted one means starting over. */
  private previousTemplateOf(address: ChainSpecificAddress) {
    const previous = this.settings.previousTemplates[address.toString()]
    return previous !== undefined && this.templateService.exists(previous)
      ? previous
      : undefined
  }

  private writeWithoutModel(
    request: TemplatizeRequest,
    facts: ContractFacts,
  ): string {
    const templateId = chooseTemplateId(this.templateService, facts)
    const text = renderTemplateFile({
      schema: schemaPathFor(templateId),
      header: `Authored by l2b discover --ai on ${this.today()} without a model call: the contract has no view functions with arguments and no events. Review before committing.`,
      ignoreMethods: [],
      fields: [],
    })
    this.touched.add(templateId)
    writeNewTemplate(this.templateService, templateId, text, {
      facts,
      sources: request.sources,
    })
    this.logger.info(
      `Templatizer wrote ${templateId} for ${subjectOf(facts)} without a model call`,
    )
    return templateId
  }

  private async authorNew(
    request: TemplatizeRequest,
    facts: ContractFacts,
    worklist: Worklist,
    task: TemplatizationTask,
  ): Promise<string> {
    const result = await this.runLoop(request, facts, worklist, task)
    const templateId = chooseTemplateId(this.templateService, facts)
    const text = renderTemplateFile({
      schema: schemaPathFor(templateId),
      header: this.header(result),
      notes: templateNotes(result),
      ignoreMethods: deriveIgnoreMethods(worklist, result.draft, facts.abi),
      fields: draftFields(result),
    })
    this.touched.add(templateId)
    writeNewTemplate(this.templateService, templateId, text, {
      facts,
      sources: request.sources,
    })
    this.logger.info(
      `Templatizer wrote ${templateId} for ${subjectOf(facts)}`,
      {
        fields: Object.keys(result.draft.fields).length,
        rounds: result.rounds.length,
      },
    )
    return templateId
  }

  /**
   * A contract whose code changed: the old template's fields that still
   * execute on the new code are kept verbatim, the model rules only on
   * what they leave undecided, and the new shape joins the old template.
   * When nothing broke there is nothing to ask.
   */
  private async extendPrevious(
    request: TemplatizeRequest,
    facts: ContractFacts,
    worklist: Worklist,
    templateId: string,
    task: TemplatizationTask,
  ): Promise<string> {
    const freeze = await this.freeze(request, facts, templateId)
    const target = { facts, sources: request.sources }
    if (nothingBroke(freeze)) {
      addShape(this.templateService, templateId, target)
      this.logger.info(
        `Templatizer added the shape of ${subjectOf(facts)} to ${templateId}, whose fields all still execute`,
      )
      return templateId
    }
    const remaining = remainingWorklist(worklist, freeze, facts)
    const result = await this.runLoop(request, facts, remaining, task, freeze)
    const text = this.extendedTemplateText(freeze, remaining, result, facts, {
      header: `${this.header(result)} ${keptAndRemoved(freeze, 'broke on the new shape')}`,
    })
    this.touched.add(templateId)
    rewriteTemplate(this.templateService, templateId, text, target)
    this.logExtended('extended', facts, freeze, result)
    return templateId
  }

  /**
   * `--ai-revisit` for a contract its template still matches: the path of
   * changed code, as if this code were new, except that the model is asked
   * even when every field executes, because finding what the template
   * misses is the point, and the shape, already there, is not added again.
   * A template is revisited once per run, on the first contract that
   * matches it; contracts that share it wait for that and then use the
   * result. A template this run authored or extended is not revisited.
   * A failed revisit stops the run, as a failed authoring does.
   */
  revisit(request: TemplatizeRequest, templateId: string): Promise<void> {
    if (this.touched.has(templateId)) {
      return Promise.resolve()
    }
    const pending = this.revisits.get(templateId)
    if (pending !== undefined) {
      return pending
    }
    const revisited = this.revisitOrStop(request, templateId)
    this.revisits.set(templateId, revisited)
    return revisited
  }

  get revisitsMatchedTemplates(): boolean {
    return this.settings.revisit === true
  }

  private async revisitOrStop(
    request: TemplatizeRequest,
    templateId: string,
  ): Promise<void> {
    const task = revisitTask(request, templateId)
    try {
      const hash = getHashForMatchingFromSources(request.sources.sources)
      if (hash !== undefined) {
        const facts = this.buildFacts(request, hash)
        const worklist = buildWorklist(facts.abi)
        await this.revisitTemplate(request, facts, worklist, templateId, task)
      }
    } catch (error) {
      this.stopOrLeave(error, task)
    }
  }

  private async revisitTemplate(
    request: TemplatizeRequest,
    facts: ContractFacts,
    worklist: Worklist,
    templateId: string,
    task: TemplatizationTask,
  ): Promise<void> {
    const freeze = await this.freeze(request, facts, templateId)
    const remaining = remainingWorklist(worklist, freeze, facts)
    if (nothingBroke(freeze) && isEmptyWorklist(remaining)) {
      this.logger.info(
        `Templatizer revisit: ${templateId} already decides every item of ${subjectOf(facts)}`,
      )
      return
    }
    const result = await this.runLoop(request, facts, remaining, task, freeze)
    if (nothingBroke(freeze) && addsNothing(freeze, remaining, result, facts)) {
      this.logger.info(
        `Templatizer revisit found nothing to add to ${templateId} from ${subjectOf(facts)}`,
      )
      return
    }
    const text = this.extendedTemplateText(freeze, remaining, result, facts, {
      header: `${this.header(result, 'Revisited', '--ai-revisit')} ${keptAndRemoved(freeze, `failed at block ${facts.blockNumber}`)}`,
    })
    this.touched.add(templateId)
    replaceTemplateText(this.templateService, templateId, text)
    this.logExtended('revisited', facts, freeze, result)
  }

  private freeze(
    request: TemplatizeRequest,
    facts: ContractFacts,
    templateId: string,
  ): Promise<FreezeAnalysis> {
    return analyzeFreeze(
      request.provider,
      this.handlerExecutor,
      this.templateService,
      facts,
      templateId,
    )
  }

  private logExtended(
    verb: 'extended' | 'revisited',
    facts: ContractFacts,
    freeze: FreezeAnalysis,
    result: Accepted,
  ): void {
    this.logger.info(
      `Templatizer ${verb} ${freeze.templateId} for ${subjectOf(facts)}`,
      {
        kept: freeze.locked.length,
        removed: freeze.broken.map((field) => field.name).join(', '),
        added: Object.keys(result.draft.fields).length,
      },
    )
  }

  /**
   * The old file's entries travel as text, so comments, descriptions,
   * severities and permissions of locked fields survive exactly as the
   * researcher wrote them; only broken fields are left out.
   */
  private extendedTemplateText(
    freeze: FreezeAnalysis,
    worklist: Worklist,
    result: Accepted,
    facts: ContractFacts,
    { header }: { header: string },
  ): string {
    const oldText = this.templateService.readTemplateFile(freeze.templateId)
    if (oldText === undefined) {
      throw new Error(`Template ${freeze.templateId} has no template.jsonc`)
    }
    const locked = new Set(freeze.locked)
    const added = addedIgnoreMethods(freeze, worklist, result, facts)
    const keepsOldIgnoreMethods = added.length === 0
    return renderTemplateFile({
      schema: schemaPathFor(freeze.templateId),
      header,
      notes: templateNotes(result),
      preserved: readTopLevelEntries(oldText).filter(
        (entry) =>
          entry.key !== '$schema' &&
          entry.key !== 'fields' &&
          (keepsOldIgnoreMethods || entry.key !== 'ignoreMethods'),
      ),
      ignoreMethods: keepsOldIgnoreMethods
        ? []
        : [...freeze.template.ignoreMethods, ...added],
      lockedFields: readFieldEntries(oldText).filter((entry) =>
        locked.has(entry.name),
      ),
      fields: draftFields(result),
    })
  }

  /** Throws `TemplatizationFailedError` unless a draft is accepted. */
  private async runLoop(
    request: TemplatizeRequest,
    facts: ContractFacts,
    worklist: Worklist,
    task: TemplatizationTask,
    freeze?: FreezeAnalysis,
  ): Promise<Accepted> {
    const artifacts = new FileArtifactSink(
      trailDirectory(this.settings.artifactsRoot, facts.project, facts.address),
    )
    const locked = freeze === undefined ? undefined : this.lockedTexts(freeze)
    const { prompt, truncated } = buildPrompt({ facts, worklist, locked })
    const subject = subjectOf(facts)
    if (truncated) {
      this.logger.warn(`Templatizer cut the source of ${subject} to fit`)
    }
    // Logged when the contract joins the queue; the turn itself may start
    // much later, which the line below reports.
    this.logger.info(`Templatizer queued ${subject} for the model`, {
      functions: worklist.items.length,
      events: worklist.events.length,
      lockedFields: freeze?.locked.length ?? 0,
    })
    const maxRounds = Math.max(1, this.settings.maxRounds ?? DEFAULT_MAX_ROUNDS)
    const model = this.model.reporting(({ turn, waiting }) =>
      this.logger.info(
        `Templatizer asking the model about ${subject}, round ${turn} of ${maxRounds}`,
        { waiting },
      ),
    )
    const result = await authorDraft(
      {
        model,
        artifacts,
        logger: this.logger,
        dryRun: (draft) =>
          dryRunDraft(request.provider, this.handlerExecutor, facts, draft, {
            locked: freeze === undefined ? undefined : lockedFields(freeze),
            ignoreMethods: freeze?.template.ignoreMethods,
          }),
      },
      {
        prompt,
        subject,
        validation: { facts, worklist, lockedFieldNames: freeze?.locked },
        trail: {
          address: facts.address,
          name: facts.name,
          shapeHash: facts.shapeHash,
          blockNumber: facts.blockNumber,
          effort: this.settings.effort,
          promptTruncated: truncated,
          previousTemplate: freeze?.templateId,
          lockedFields: freeze?.locked,
          brokenFields: freeze?.broken,
        },
      },
      { maxRounds: this.settings.maxRounds },
    ).catch((error: unknown) => {
      throw error instanceof ModelUnavailableError
        ? new TemplatizationFailedError(
            'model-unavailable',
            task,
            error.message,
            artifacts.directory,
            { cause: error },
          )
        : error
    })
    if (result.status === 'failed') {
      throw new TemplatizationFailedError(
        'no-acceptable-draft',
        task,
        result.failure,
        artifacts.directory,
      )
    }
    return result
  }

  private lockedTexts(freeze: FreezeAnalysis) {
    const text = this.templateService.readTemplateFile(freeze.templateId) ?? ''
    const locked = new Set(freeze.locked)
    return readFieldEntries(text).filter((entry) => locked.has(entry.name))
  }

  private header(result: Accepted, verb = 'Authored', flag = '--ai') {
    const model =
      result.model === undefined
        ? this.settings.modelLabel
        : describeModel(result.model, this.settings.effort)
    return `${verb} by ${model} via l2b discover ${flag} on ${this.today()}, ${result.rounds.length} round(s). Review before committing.`
  }

  private today(): string {
    return (this.settings.now ?? (() => new Date()))()
      .toISOString()
      .slice(0, 10)
  }
}

type Accepted = Extract<LoopResult, { status: 'accepted' }>

/** The accepted draft's fields, each with what the reviewer should check. */
function draftFields(result: Accepted) {
  const runs = result.acceptedRound.dryRun?.fields ?? []
  const advisories = advisoriesOf(result.acceptedRound.findings)
  return Object.entries(result.draft.fields).map(([name, field]) => {
    const dryRunNote = runs.find((run) => run.name === name)?.note
    const kept = advisories.filter((advisory) =>
      isFieldPath(advisory.path, fieldPath(name)),
    )
    return {
      name,
      reason: field.reason,
      covers: field.covers,
      notes: [
        ...(dryRunNote === undefined ? [] : [dryRunNote]),
        ...kept.map((advisory) => reviewNote(advisory.message)),
      ],
      handler: field.handler,
      edit: field.edit,
    }
  })
}

/** Advisories the model kept that are about no single field, e.g. a skip. */
function templateNotes(result: Accepted): string[] {
  return advisoriesOf(result.acceptedRound.findings)
    .filter((advisory) => !advisory.path.startsWith('fields'))
    .map((advisory) => reviewNote(advisory.message))
}

/** How every log line names the contract: the logs of contracts in one depth interleave. */
function subjectOf(facts: ContractFacts): string {
  return `${facts.name} (${facts.address})`
}

function requestSubject(request: TemplatizeRequest): string {
  return `${request.sources.name} (${request.address})`
}

function authoringTask(request: TemplatizeRequest): TemplatizationTask {
  return {
    failedTo: `--ai could not templatize ${requestSubject(request)}`,
    bypass:
      'rerun without --ai to leave this contract untemplatized on purpose',
  }
}

function revisitTask(
  request: TemplatizeRequest,
  templateId: string,
): TemplatizationTask {
  return {
    failedTo: `--ai-revisit could not revisit ${templateId} on ${requestSubject(request)}`,
    bypass: `rerun without --ai-revisit to keep ${templateId} as it is`,
  }
}

function reviewNote(message: string): string {
  return `review: ${message}`
}

function keptAndRemoved(freeze: FreezeAnalysis, failure: string): string {
  const kept = `Kept ${freeze.locked.length} field(s) that still execute`
  if (freeze.broken.length === 0) {
    return `${kept}.`
  }
  const names = freeze.broken.map((field) => field.name).join(', ')
  return `${kept}, removed ${freeze.broken.length} that ${failure} (${names}).`
}

/** Skipped probed getters the old template did not ignore yet. */
function addedIgnoreMethods(
  freeze: FreezeAnalysis,
  worklist: Worklist,
  result: Accepted,
  facts: ContractFacts,
): string[] {
  return deriveIgnoreMethods(worklist, result.draft, facts.abi).filter(
    (name) => !freeze.template.ignoreMethods.includes(name),
  )
}

/** A draft of skips only, none of which hides a probed getter, would rewrite the file for a new header alone. */
function addsNothing(
  freeze: FreezeAnalysis,
  worklist: Worklist,
  result: Accepted,
  facts: ContractFacts,
): boolean {
  return (
    Object.keys(result.draft.fields).length === 0 &&
    addedIgnoreMethods(freeze, worklist, result, facts).length === 0
  )
}

function isDiamond(proxyType: string | undefined): boolean {
  return proxyType?.includes('EIP2535') ?? false
}
