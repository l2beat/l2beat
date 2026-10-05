/**
 * Authors a V1 template for a contract no template matches, and adds to
 * templates that do. It runs after discovery, over what discovery found:
 * every contract left without a template is asked about, one at a time,
 * and discovery then runs again with what was written, which applies the
 * new templates and reaches the contracts their address fields point to.
 * `templatizeDiscovered` is one such pass; the caller repeats discovery and
 * passes until a pass writes nothing.
 *
 * A contract it was asked about and could not templatize stops the run
 * with a `TemplatizationFailedError`, rather than leaving the contract
 * untemplatized where nobody can tell a failure from a decision.
 *
 * An existing template is only ever added to (`appendToTemplate`): its
 * text is never rebuilt, its fields never removed, its `ignoreMethods`
 * never changed. And nothing here predicts what V1 would do: the baseline
 * is what V1 read, the dry run runs V1 with the address's own config, and
 * what V1 did is written down for the reviewer.
 *
 * The backend never constructs this class; only a CLI run with `--ai` and
 * the benchmark do.
 */
import type { Logger } from '@l2beat/backend-tools'
import type { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { getHashForMatchingFromSources } from '../../flatten/utils'
import { getErrorMessage } from '../../utils/getErrorMessage'
import type { Analysis } from '../analysis/AddressAnalyzer'
import type { TemplateService } from '../analysis/TemplateService'
import { StructureContract } from '../config/StructureConfig'
import {
  type StructureContractConfig,
  withTemplate,
} from '../config/structureUtils'
import { getHandlers } from '../handlers/getHandlers'
import type { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { ContractValue } from '../output/types'
import type { IProvider } from '../provider/IProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'
import { getImplementationNames } from '../source/getDerivedName'
import {
  type ContractSources,
  SourceCodeService,
} from '../source/SourceCodeService'
import { FileArtifactSink, trailDirectory } from './artifacts'
import { buildBaseline, withoutTemplateValues } from './baseline'
import { dryRunDraft } from './draft/dryRun'
import {
  analyzeExistingTemplate,
  type ExistingTemplate,
  failureNote,
  misfitOf,
  type PreviousTemplate,
  remainingWorklist,
} from './existingTemplate'
import type { ContractFacts } from './facts'
import { flattenSources } from './flattenSources'
import { authorDraft, DEFAULT_MAX_ROUNDS, type LoopResult } from './loop'
import { describeModel } from './model/createModelClient'
import { type ModelClient, ModelUnavailableError } from './model/ModelClient'
import { buildPrompt, type ExistingFieldText } from './prompt/buildPrompt'
import {
  TemplatizationFailedError,
  type TemplatizationTask,
} from './TemplatizationFailedError'
import { buildWorklist, isEmptyWorklist, type Worklist } from './worklist'
import {
  appendToTemplate,
  type TemplateAdditions,
} from './write/appendToTemplate'
import { deriveIgnoreMethods } from './write/ignoreMethods'
import { readFieldEntries } from './write/jsoncEntries'
import {
  renderTemplateFile,
  schemaPathFor,
  type TemplateFileField,
} from './write/templateFile'
import {
  addShape,
  admitsAddress,
  chooseTemplateId,
  matchedBundles,
  replaceTemplateText,
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
  /** Address → its template in the committed discovered.json, for contracts whose code changed. */
  previousTemplates: Record<string, PreviousTemplate>
  /** `--ai-revisit`: also add to templates that already match, see `revisit`. */
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
  /**
   * The address's config before any template: the global and project
   * `types`, the override from `config.jsonc`. Dry runs push the template
   * onto a copy of it, as the analyzer does.
   */
  config: StructureContractConfig
  sources: ContractSources
  proxyType?: string
  proxyValues: Record<string, ContractValue | undefined>
  implementationNames: Record<string, string>
}

export class Templatizer {
  /** Addresses asked about in this run, each once however many passes see it. */
  private readonly asked = new Set<string>()
  /** Templates this run wrote or revisited, which a revisit does not ask about again. */
  private readonly settled = new Set<string>()

  constructor(
    private readonly templateService: TemplateService,
    private readonly handlerExecutor: HandlerExecutor,
    private readonly settings: TemplatizerSettings,
    private readonly logger: Logger,
  ) {}

  /**
   * One pass over the analyses of a finished discovery, one contract at a
   * time, in address order: every contract left without a template, and
   * with `--ai-revisit` every contract a template matched by its shape.
   * Returns whether anything was written, which is when discovery must run
   * again.
   */
  async templatizeDiscovered(
    analyses: readonly Analysis[],
    requestFor: (address: ChainSpecificAddress) => Promise<TemplatizeRequest>,
  ): Promise<boolean> {
    let wrote = false
    const contracts = analyses
      .filter((analysis) => analysis.type === 'Contract')
      .sort((a, b) => a.address.localeCompare(b.address))
    for (const contract of contracts) {
      const matched = contract.extendedTemplate
      const revisit =
        this.settings.revisit === true && matched?.reason === 'byShapeMatch'
          ? matched.template
          : undefined
      if (
        this.asked.has(contract.address) ||
        (matched !== undefined && revisit === undefined) ||
        (revisit !== undefined && this.settled.has(revisit))
      ) {
        continue
      }
      this.asked.add(contract.address)
      const request = await requestFor(contract.address)
      if (!this.canTemplatize(request.sources, request.proxyType)) {
        continue
      }
      const wroteNow =
        revisit === undefined
          ? (await this.templateFor(request)) !== undefined
          : await this.revisit(request, revisit)
      wrote ||= wroteNow
    }
    return wrote
  }

  /**
   * Unverified code has no shape to key a template on, and EIP-2535
   * diamonds, whose facets change independently, are not templatized by V1
   * either. Two-implementation proxies (Arbitrum's RollupProxy) are: V1
   * matches them on the implementations' combined hash.
   *
   * A `manualSourcePaths` link counts as verified for the analysis and
   * gives its bundle a hash V1 matches on, but the explorer holds no code
   * behind it: there is nothing to show the model, and
   * `TemplateService.addToShape` hashes the explorer's source, so no shape
   * could be recorded. The bundles V1 matches on must carry that source.
   */
  canTemplatize(sources: ContractSources, proxyType: string | undefined) {
    return (
      sources.isVerified &&
      !isDiamond(proxyType) &&
      getHashForMatchingFromSources(sources.sources) !== undefined &&
      matchedBundles(sources.sources).every(
        (bundle) => bundle.source.isVerified,
      )
    )
  }

  /**
   * The id of the template written or extended for the contract, or
   * undefined when a template written earlier in the pass already matches
   * it (a contract of the same shape) or the benchmark left it
   * untemplatized.
   */
  async templateFor(request: TemplatizeRequest): Promise<string | undefined> {
    const hash = getHashForMatchingFromSources(request.sources.sources)
    if (
      hash === undefined ||
      this.templateService.findMatchingTemplates(
        request.sources,
        request.address,
      ).length > 0
    ) {
      return undefined
    }
    const task = authoringTask(request)
    try {
      const templateId = await this.templatize(request, hash, task)
      this.settled.add(templateId)
      return templateId
    } catch (error) {
      return this.stopOrLeave(error, task)
    }
  }

  /**
   * Discovery stops on any failure (see `TemplatizationFailedError`). The
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
    throw failed
  }

  /**
   * A contract whose code changed since the committed discovered.json
   * keeps its old template only while that template fits the new code
   * (`misfitOf`); it is then added to, and the new shape joins it.
   * Otherwise the contract gets a template of its own, as one that never
   * had a template does, and the old one is left as it is. So does a
   * contract whose old template holds its shape and still did not match:
   * the template's criteria exclude it. Either way a worklist with nothing
   * on it is not sent to the model.
   */
  private async templatize(
    request: TemplatizeRequest,
    hash: Hash256,
    task: TemplatizationTask,
  ): Promise<string> {
    const previous = this.previousTemplateOf(request.address)
    const notes: string[] = []
    if (previous !== undefined) {
      const misfit = await this.extendIfFits(request, hash, task, previous)
      if (misfit === undefined) {
        return previous.templateId
      }
      this.logger.info(
        `Templatizer: ${previous.templateId} no longer fits ${requestSubject(request)}; authoring a template of its own`,
        { misfit },
      )
      notes.push(
        reviewNote(
          `${request.address} had ${previous.templateId}, which no longer fits: ${misfit}. ${previous.templateId} is left as it is.`,
        ),
      )
    }
    const { facts, worklist } = await this.prepare(request, hash)
    if (isEmptyWorklist(worklist)) {
      return this.writeWithoutModel(request, facts, notes)
    }
    return await this.authorNew(request, facts, worklist, task, notes)
  }

  /**
   * The old template fits: the model is asked what it leaves undecided on
   * the new code, as for `--ai-revisit`, and the new shape is added so the
   * template matches again. When it does not fit, nothing is written and
   * the reason is returned.
   */
  private async extendIfFits(
    request: TemplatizeRequest,
    hash: Hash256,
    task: TemplatizationTask,
    previous: PreviousTemplate,
  ): Promise<string | undefined> {
    const { templateId } = previous
    if (!admitsAddress(this.templateService, templateId, request.address)) {
      // V1 matches a template that lists addresses for those alone. The
      // new shape would not change that, and `addShape` would throw after
      // the fields were appended.
      return 'its criteria.json does not list the contract'
    }
    if (
      this.templateService.findShapeByTemplateAndHash(templateId, hash) !==
      undefined
    ) {
      // V1 matched nothing although the template holds this very shape and
      // its criteria admit the contract. Nothing written here would change
      // that, and the shape must not be added a second time.
      return 'it holds this shape and still V1 does not match it'
    }
    const existing = await this.analyzeExisting(request, templateId)
    const names = matchedBundles(request.sources.sources).map((b) => b.name)
    const misfit = misfitOf(existing, previous, names)
    if (misfit !== undefined) {
      return misfit
    }
    const { facts, worklist } = await this.prepare(request, hash, templateId)
    await this.addToExisting(request, facts, worklist, existing, task)
    addShape(this.templateService, templateId, {
      facts,
      sources: request.sources,
    })
    this.logger.info(
      `Templatizer added the shape of ${subjectOf(facts)} to ${templateId}`,
    )
    return undefined
  }

  /**
   * The facts and the worklist, from what the request gathered. V1's own
   * handler list for the address says which baseline name is a getter, a
   * probe or an override field, and so which worklist items are probed.
   * With `templateId`, the template is pushed onto the address's config
   * for the baseline, as the analyzer will push it (see `baseline.ts`);
   * the request's config stays as it is for the dry runs.
   */
  private async prepare(
    request: TemplatizeRequest,
    hash: Hash256,
    templateId?: string,
  ): Promise<{ facts: ContractFacts; worklist: Worklist }> {
    const { provider, sources } = request
    const template =
      templateId === undefined
        ? undefined
        : this.templateService.loadContractTemplate(templateId)
    const config =
      template === undefined
        ? request.config
        : withTemplate(request.config, template)
    const { values, errors } = await this.handlerExecutor.execute(
      provider,
      request.address,
      sources.abi,
      config,
    )
    const baseline = buildBaseline(
      values ?? {},
      errors,
      getHandlers(sources.abi, config),
    )
    const facts: ContractFacts = {
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
      baseline:
        template === undefined
          ? baseline
          : withoutTemplateValues(baseline, template, request.config),
    }
    return { facts, worklist: buildWorklist(facts.abi, facts.baseline) }
  }

  /** Only a template that still exists can be extended; a deleted one means starting over. */
  private previousTemplateOf(
    address: ChainSpecificAddress,
  ): PreviousTemplate | undefined {
    const previous = this.settings.previousTemplates[address.toString()]
    return previous !== undefined &&
      this.templateService.exists(previous.templateId)
      ? previous
      : undefined
  }

  private writeWithoutModel(
    request: TemplatizeRequest,
    facts: ContractFacts,
    notes: string[],
  ): string {
    const templateId = chooseTemplateId(this.templateService, facts)
    const text = renderTemplateFile({
      schema: schemaPathFor(templateId),
      header: `Authored by l2b discover --ai on ${this.today()} without a model call: the contract has no view functions with arguments, no constructor parameters and no events. Review before committing.`,
      headerNotes: notes,
      ignoreMethods: [],
      fields: [],
    })
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
    notes: string[],
  ): Promise<string> {
    const result = await this.runLoop(request, facts, worklist, task)
    const templateId = chooseTemplateId(this.templateService, facts)
    const text = renderTemplateFile({
      schema: schemaPathFor(templateId),
      header: this.header(result),
      headerNotes: notes,
      ignoreMethods: deriveIgnoreMethods(worklist, result.draft),
      fields: draftFields(result),
    })
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
   * `--ai-revisit` for a contract its template still matches: the model is
   * asked what the template misses for this contract, and its fields are
   * appended. A template is revisited once per run, on the first contract
   * in a pass that matches it; one this run authored or extended is not
   * revisited. A failed revisit stops the run, as a failed authoring does.
   * Returns whether it wrote.
   */
  async revisit(
    request: TemplatizeRequest,
    templateId: string,
  ): Promise<boolean> {
    this.settled.add(templateId)
    const task = revisitTask(request, templateId)
    try {
      const hash = getHashForMatchingFromSources(request.sources.sources)
      if (hash === undefined) {
        return false
      }
      const existing = await this.analyzeExisting(request, templateId)
      const { facts, worklist } = await this.prepare(request, hash, templateId)
      return await this.addToExisting(request, facts, worklist, existing, task)
    } catch (error) {
      this.stopOrLeave(error, task)
      return false
    }
  }

  /**
   * The model is asked about what the template leaves undecided for this
   * contract, and its fields are appended; failing fields get their notes
   * either way. Nothing is asked when the template decides every item.
   * Returns whether it wrote.
   */
  private async addToExisting(
    request: TemplatizeRequest,
    facts: ContractFacts,
    worklist: Worklist,
    existing: ExistingTemplate,
    task: TemplatizationTask,
  ): Promise<boolean> {
    const { templateId } = existing
    const remaining = remainingWorklist(worklist, existing)
    if (isEmptyWorklist(remaining)) {
      this.logger.info(
        `Templatizer: ${templateId} already decides every item of ${subjectOf(facts)}`,
      )
      return this.writeAdditions(existing, facts, {})
    }
    const result = await this.runLoop(request, facts, remaining, task, existing)
    const fields = draftFields(result)
    const wrote = this.writeAdditions(existing, facts, {
      provenance: this.header(result, 'Added'),
      fields,
    })
    if (!wrote) {
      this.logger.info(
        `Templatizer found nothing to add to ${templateId} from ${subjectOf(facts)}`,
      )
      return false
    }
    this.logger.info(
      `Templatizer added to ${templateId} for ${subjectOf(facts)}`,
      {
        existing: existing.fields.length,
        failing: existing.failing.map((field) => field.name).join(', '),
        added: fields.map((field) => field.name).join(', '),
      },
    )
    return true
  }

  private analyzeExisting(
    request: TemplatizeRequest,
    templateId: string,
  ): Promise<ExistingTemplate> {
    return analyzeExistingTemplate(
      request.provider,
      this.handlerExecutor,
      this.templateService,
      request.config,
      request.sources.abi,
      templateId,
    )
  }

  /**
   * Appends the model's fields and the notes about failing fields to the
   * template's text. Nothing is written when there is nothing new: no
   * fields, and every note already there. Returns whether it wrote.
   */
  private writeAdditions(
    existing: ExistingTemplate,
    facts: ContractFacts,
    additions: Pick<TemplateAdditions, 'provenance' | 'fields'>,
  ): boolean {
    const oldText = this.templateService.readTemplateFile(existing.templateId)
    if (oldText === undefined) {
      throw new Error(`Template ${existing.templateId} has no template.jsonc`)
    }
    const { text, insertions } = appendToTemplate(oldText, {
      ...additions,
      fieldNotes: Object.fromEntries(
        existing.failing.map((field) => [
          field.name,
          [failureNote(facts.blockNumber, field)],
        ]),
      ),
    })
    if (insertions.length === 0) {
      return false
    }
    replaceTemplateText(this.templateService, existing.templateId, text)
    return true
  }

  /** Throws `TemplatizationFailedError` unless a draft is accepted. */
  private async runLoop(
    request: TemplatizeRequest,
    facts: ContractFacts,
    worklist: Worklist,
    task: TemplatizationTask,
    existing?: ExistingTemplate,
  ): Promise<Accepted> {
    const artifacts = FileArtifactSink.fresh(
      trailDirectory(this.settings.artifactsRoot, facts.project, facts.address),
    )
    const { prompt, truncated } = buildPrompt({
      facts,
      worklist,
      existing:
        existing === undefined ? undefined : this.existingTexts(existing),
    })
    const subject = subjectOf(facts)
    if (truncated) {
      this.logger.warn(`Templatizer cut the source of ${subject} to fit`)
    }
    this.logger.info(`Templatizer asking the model about ${subject}`, {
      functions: worklist.items.length,
      events: worklist.events.length,
      existingFields: existing?.fields.length ?? 0,
      maxRounds: Math.max(1, this.settings.maxRounds ?? DEFAULT_MAX_ROUNDS),
    })
    const result = await authorDraft(
      {
        model: this.settings.model,
        artifacts,
        logger: this.logger,
        // The dry run sees the template the file will hold: the existing
        // one as it is, or a new one with the ignoreMethods this draft gets.
        dryRun: (draft) =>
          dryRunDraft(request.provider, this.handlerExecutor, facts, draft, {
            config: request.config,
            base:
              existing?.template ??
              StructureContract.parse({
                ignoreMethods: deriveIgnoreMethods(worklist, draft),
              }),
          }),
      },
      {
        prompt,
        subject,
        validation: { facts, worklist, existingFieldNames: existing?.fields },
        trail: {
          address: facts.address,
          name: facts.name,
          shapeHash: facts.shapeHash,
          blockNumber: facts.blockNumber,
          effort: this.settings.effort,
          promptTruncated: truncated,
          existingTemplate: existing?.templateId,
          existingFields: existing?.fields,
          failingFields: existing?.failing,
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

  /** The existing fields as the researcher wrote them, each marked when it fails here. */
  private existingTexts(existing: ExistingTemplate): ExistingFieldText[] {
    const text =
      this.templateService.readTemplateFile(existing.templateId) ?? ''
    const failing = new Map(
      existing.failing.map((field) => [field.name, field.error]),
    )
    return readFieldEntries(text).map(({ name, text }) => {
      const field = existing.template.fields[name]
      return {
        name,
        text,
        ...(failing.has(name) ? { error: failing.get(name) } : {}),
        ...(field?.handler === undefined ? {} : { handler: field.handler }),
        ...(field?.edit === undefined ? {} : { edit: field.edit }),
      }
    })
  }

  private header(result: Accepted, verb = 'Authored') {
    // The flag names the run that wrote the line, so a reviewer knows how to
    // reproduce it: a template authored during a revisit run came from --ai-revisit.
    const flag = this.settings.revisit === true ? '--ai-revisit' : '--ai'
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

/** The accepted draft's fields, each with what the dry run saw that the reviewer should check. */
function draftFields(result: Accepted): TemplateFileField[] {
  const runs = result.acceptedRound.dryRun?.fields ?? []
  return Object.entries(result.draft.fields).map(([name, field]) => ({
    name,
    reason: field.reason,
    covers: field.covers,
    notes: (runs.find((run) => run.name === name)?.notes ?? []).map(reviewNote),
    handler: field.handler,
    edit: field.edit,
  }))
}

/**
 * What the analyzer gathered for the address before applying a template,
 * gathered again through V1's own detector and source service; the
 * provider serves it from its cache. `config` is the address's config
 * before any template.
 */
export async function gatherRequest(
  provider: IProvider,
  address: ChainSpecificAddress,
  config: StructureContractConfig,
): Promise<TemplatizeRequest> {
  const proxy = await new ProxyDetector().detectProxy(
    provider,
    address,
    config.proxyType,
  )
  const sources = await new SourceCodeService().getSources(
    provider,
    proxy.addresses,
    config.manualSourcePaths,
  )
  return {
    provider,
    address,
    config,
    sources,
    proxyType: proxy.type,
    proxyValues: proxy.values,
    implementationNames: getImplementationNames(address, sources) ?? {},
  }
}

/** How every log line names the contract. */
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

/** Every line the templatizer writes for the reviewer starts the same way. */
function reviewNote(message: string): string {
  return `review: ${message}`
}

function isDiamond(proxyType: string | undefined): boolean {
  return proxyType?.includes('EIP2535') ?? false
}
