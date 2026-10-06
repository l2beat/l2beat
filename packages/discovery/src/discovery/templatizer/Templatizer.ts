/**
 * Authors a V1 template for a contract no template matches, and adds to
 * templates that do. It runs between the levels of discovery
 * (`BetweenLevels`), over what discovery found so far: every contract left
 * without a template is asked about, one at a time. The engine then
 * analyzes again each contract a written template applies to, and follows
 * the relatives of that analysis into the next level.
 *
 * A contract it was asked about and could not templatize stops the run
 * with a `TemplatizationFailedError`, rather than leaving the contract
 * untemplatized where nobody can tell a failure from a decision.
 *
 * The model replies with the part of `template.jsonc` it adds, and an
 * existing template is only ever added to (`mergeTemplate`): its text is
 * never rebuilt, its fields never removed or changed, nothing is added at
 * its top level. And nothing here predicts what V1 would do: the baseline
 * is what V1 read, the dry run runs V1 with the address's own config, and
 * what V1 did is written down for the reviewer.
 *
 * The backend never constructs this class; only a CLI run with `--ai`
 * does.
 */
import type { Logger } from '@l2beat/backend-tools'
import type { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import {
  getHashForMatchingFromSources,
  getSourcesToBeMatched,
} from '../../flatten/utils'
import { getErrorMessage } from '../../utils/getErrorMessage'
import type { Analysis } from '../analysis/AddressAnalyzer'
import type { TemplateService } from '../analysis/TemplateService'
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
  misfitOf,
  type PreviousTemplate,
} from './existingTemplate'
import type { ContractFacts } from './facts'
import { flattenSources } from './flattenSources'
import { authorDraft, DEFAULT_MAX_ROUNDS, type LoopResult } from './loop'
import { describeModel } from './model/createModelClient'
import { type ModelClient, ModelUnavailableError } from './model/ModelClient'
import { buildPrompt } from './prompt/buildPrompt'
import {
  TemplatizationFailedError,
  type TemplatizationTask,
} from './TemplatizationFailedError'
import { buildWorklist, isEmptyWorklist, type Worklist } from './worklist'
import { type MergeResult, mergeTemplate } from './write/mergeTemplate'
import {
  addShape,
  chooseTemplateId,
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
  /** Addresses asked about in this run, each once however many levels see it. */
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
   * One pass over the analyses discovery has made so far, one contract at a
   * time, in address order: every contract left without a template, and
   * with `--ai-revisit` every contract a template matched by its shape.
   * Contracts asked about in an earlier pass are passed over. Returns
   * whether anything was written.
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
      getSourcesToBeMatched(sources.sources).every(
        (bundle) => bundle.source.isVerified,
      )
    )
  }

  /**
   * The id of the template written or extended for the contract, or
   * undefined when a template written earlier in the run already matches
   * it, as it does a contract of the same shape.
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
      throw failure(error, task)
    }
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
    if (this.templateService.readShapeFile(templateId) === undefined) {
      // A template with no shape is applied only by a referrer's field
      // (`discovered.json` does not say how it was applied); its first
      // shape would make every contract of this code match it.
      return 'it has no shapes, so only a referrer applies it'
    }
    if (!this.templateService.admitsAddress(templateId, request.address)) {
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
    const names = getSourcesToBeMatched(request.sources.sources).map(
      (b) => b.name,
    )
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
    const header = [
      `Authored by l2b discover --ai on ${this.today()} without a model call: the contract has no view functions with arguments, no constructor parameters and no events. Review before committing.`,
      ...notes,
    ]
    writeNewTemplate(
      this.templateService,
      templateId,
      (text) =>
        mergedText(mergeTemplate({ text, isNew: true, additions: {}, header })),
      { facts, sources: request.sources },
    )
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
    writeNewTemplate(
      this.templateService,
      templateId,
      (text) =>
        mergedText(
          mergeTemplate({
            text,
            isNew: true,
            additions: result.draft.additions,
            fieldComments: fieldComments(result),
            header: [this.header(result), ...notes],
          }),
        ),
      { facts, sources: request.sources },
    )
    this.logger.info(
      `Templatizer wrote ${templateId} for ${subjectOf(facts)}`,
      {
        fields: fieldNames(result).join(', '),
        rounds: result.rounds.length,
      },
    )
    return templateId
  }

  /**
   * `--ai-revisit` for a contract its template still matches: the model is
   * asked what the template misses for this contract, and its fields are
   * appended. A template is revisited once per run, on the first contract
   * in address order that matches it when discovery first reaches one; the
   * engine then analyzes again every contract it matches, at whatever
   * level. One this run authored or extended is not
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
      throw failure(error, task)
    }
  }

  /**
   * The model is shown the template as it is and asked what it misses for
   * this contract, and what it adds is merged into the template's text.
   * Nothing is asked when the contract has nothing discovery cannot read by
   * itself. Returns whether it wrote.
   */
  private async addToExisting(
    request: TemplatizeRequest,
    facts: ContractFacts,
    worklist: Worklist,
    existing: ExistingTemplate,
    task: TemplatizationTask,
  ): Promise<boolean> {
    const { templateId } = existing
    if (isEmptyWorklist(worklist)) {
      this.logger.info(
        `Templatizer: ${subjectOf(facts)} has nothing to read beyond what discovery reads; ${templateId} is left as it is`,
      )
      return false
    }
    const result = await this.runLoop(request, facts, worklist, task, existing)
    const oldText = this.templateTextOf(templateId)
    const text = mergedText(
      mergeTemplate({
        text: oldText,
        isNew: false,
        additions: result.draft.additions,
        fieldComments: fieldComments(result),
        header: [this.header(result, 'Added')],
      }),
    )
    if (text === oldText) {
      this.logger.info(
        `Templatizer found nothing to add to ${templateId} from ${subjectOf(facts)}`,
      )
      return false
    }
    replaceTemplateText(this.templateService, templateId, text)
    this.logger.info(
      `Templatizer added to ${templateId} for ${subjectOf(facts)}`,
      {
        failing: existing.failing.map((field) => field.name).join(', '),
        added: fieldNames(result).join(', '),
      },
    )
    return true
  }

  private templateTextOf(templateId: string): string {
    const text = this.templateService.readTemplateFile(templateId)
    if (text === undefined) {
      throw new Error(`Template ${templateId} has no template.jsonc`)
    }
    return text
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
    const templateText =
      existing === undefined ? '{}' : this.templateTextOf(existing.templateId)
    const { prompt, truncated } = buildPrompt({
      facts,
      worklist,
      existing:
        existing === undefined
          ? undefined
          : {
              templateId: existing.templateId,
              text: templateText,
              template: existing.template,
              failing: existing.failing,
            },
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
        dryRun: (checked) =>
          dryRunDraft(
            request.provider,
            this.handlerExecutor,
            facts,
            checked,
            request.config,
          ),
      },
      {
        prompt,
        subject,
        // A new template is validated as a merge into an empty one; its
        // `$schema` is V1's to write.
        validation: { facts, templateText, isNew: existing === undefined },
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

/** Above what is added for each field: the model's reason, then what the dry run saw. */
function fieldComments(result: Accepted): Record<string, string[]> {
  const runs = result.acceptedRound.dryRun?.fields ?? []
  return Object.fromEntries(
    fieldNames(result).map((name) => [
      name,
      [
        ...[result.draft.reasons[name] ?? []].flat(),
        ...(runs.find((run) => run.name === name)?.notes ?? []).map(reviewNote),
      ],
    ]),
  )
}

function fieldNames(result: Accepted): string[] {
  const fields = result.draft.additions.fields
  return typeof fields === 'object' && fields !== null
    ? Object.keys(fields)
    : []
}

/** A draft that passed the checks merges; one that does not is a bug here. */
function mergedText(result: MergeResult): string {
  if ('problems' in result) {
    throw new Error(
      `A checked draft does not merge: ${result.problems.map((p) => `${p.path}: ${p.message}`).join('; ')}`,
    )
  }
  return result.text
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

/** Discovery stops on any failure; see `TemplatizationFailedError`. */
function failure(
  error: unknown,
  task: TemplatizationTask,
): TemplatizationFailedError {
  return error instanceof TemplatizationFailedError
    ? error
    : new TemplatizationFailedError(
        'internal',
        task,
        getErrorMessage(error),
        undefined,
        { cause: error },
      )
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
