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
 * - nothing thrown here may reach the analyzer: a failed authoring leaves
 *   the address untemplatized, exactly as a run without `--ai` would.
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
import type { Draft } from './draft/Draft'
import { dryRunDraft } from './draft/dryRun'
import type { ContractFacts } from './facts'
import { flattenSources } from './flattenSources'
import {
  analyzeFreeze,
  type FreezeAnalysis,
  lockedFields,
  nothingBroke,
  remainingWorklist,
} from './freeze'
import { authorDraft, type LoopResult } from './loop'
import type { ModelClient } from './model/ModelClient'
import { SerialModelClient } from './model/SerialModelClient'
import { buildPrompt } from './prompt/buildPrompt'
import { buildWorklist, isEmptyWorklist, type Worklist } from './worklist'
import { deriveIgnoreMethods } from './write/ignoreMethods'
import { readFieldEntries, readTopLevelEntries } from './write/jsoncEntries'
import { renderTemplateFile, schemaPathFor } from './write/templateFile'
import {
  addShape,
  chooseTemplateId,
  rewriteTemplate,
  writeNewTemplate,
} from './write/writeTemplate'

export interface TemplatizerSettings {
  project: string
  model: ModelClient
  /** How the model is named in the provenance header when the client cannot say. */
  modelLabel: string
  /** Model turns per contract, the first included. */
  maxRounds?: number
  /** Where the per-contract trail goes: `<artifactsRoot>/<project>/<address>/`. */
  artifactsRoot: string
  /** Address → template id in the committed discovered.json, for the freeze path. */
  previousTemplates: Record<string, string>
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
  private readonly model: ModelClient

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
    const authored = this.templatizeSafely(request, hash)
    this.inFlight.set(key, authored)
    return authored
  }

  private async templatizeSafely(
    request: TemplatizeRequest,
    hash: Hash256,
  ): Promise<string | undefined> {
    try {
      return await this.templatize(request, hash)
    } catch (error) {
      this.logger.error(
        'Templatizer failed; the contract stays untemplatized',
        {
          address: request.address,
          name: request.sources.name,
          error: getErrorMessage(error),
        },
      )
      return undefined
    }
  }

  private async templatize(
    request: TemplatizeRequest,
    hash: Hash256,
  ): Promise<string | undefined> {
    const facts = this.buildFacts(request, hash)
    const worklist = buildWorklist(facts.abi)
    const previous = this.previousTemplateOf(request.address)
    if (previous !== undefined) {
      return await this.extendPrevious(request, facts, worklist, previous)
    }
    if (isEmptyWorklist(worklist)) {
      return this.writeWithoutModel(request, facts)
    }
    return await this.authorNew(request, facts, worklist)
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
    writeNewTemplate(this.templateService, templateId, text, {
      facts,
      sources: request.sources,
    })
    this.logger.info('Templatizer wrote a template without a model call', {
      template: templateId,
    })
    return templateId
  }

  private async authorNew(
    request: TemplatizeRequest,
    facts: ContractFacts,
    worklist: Worklist,
  ): Promise<string | undefined> {
    const result = await this.runLoop(request, facts, worklist)
    if (result.status === 'failed') {
      return undefined
    }
    const templateId = chooseTemplateId(this.templateService, facts)
    const text = renderTemplateFile({
      schema: schemaPathFor(templateId),
      header: this.header(result),
      ignoreMethods: deriveIgnoreMethods(worklist, result.draft, facts.abi),
      fields: draftFields(result.draft),
    })
    writeNewTemplate(this.templateService, templateId, text, {
      facts,
      sources: request.sources,
    })
    this.logger.info('Templatizer wrote a template', {
      template: templateId,
      fields: Object.keys(result.draft.fields).length,
      rounds: result.rounds.length,
    })
    return templateId
  }

  private async extendPrevious(
    request: TemplatizeRequest,
    facts: ContractFacts,
    worklist: Worklist,
    templateId: string,
  ): Promise<string | undefined> {
    const freeze = await analyzeFreeze(
      request.provider,
      this.handlerExecutor,
      this.templateService,
      facts,
      templateId,
    )
    const target = { facts, sources: request.sources }
    if (nothingBroke(freeze)) {
      addShape(this.templateService, templateId, target)
      this.logger.info('Templatizer added the new shape to the old template', {
        template: templateId,
      })
      return templateId
    }
    const remaining = remainingWorklist(worklist, freeze, facts)
    const result = await this.runLoop(request, facts, remaining, freeze)
    if (result.status === 'failed') {
      return undefined
    }
    const text = this.extendedTemplateText(freeze, remaining, result, facts)
    rewriteTemplate(this.templateService, templateId, text, target)
    this.logger.info('Templatizer extended the old template', {
      template: templateId,
      kept: freeze.locked.length,
      removed: freeze.broken.map((field) => field.name).join(', '),
      added: Object.keys(result.draft.fields).length,
    })
    return templateId
  }

  /**
   * The old file's entries travel as text, so comments, descriptions,
   * severities and permissions of locked fields survive exactly as the
   * researcher wrote them; only broken fields are left out.
   */
  private extendedTemplateText(
    freeze: FreezeAnalysis,
    worklist: Worklist,
    result: Extract<LoopResult, { status: 'accepted' }>,
    facts: ContractFacts,
  ): string {
    const oldText = this.templateService.readTemplateFile(freeze.templateId)
    if (oldText === undefined) {
      throw new Error(`Template ${freeze.templateId} has no template.jsonc`)
    }
    const locked = new Set(freeze.locked)
    const added = deriveIgnoreMethods(worklist, result.draft, facts.abi).filter(
      (name) => !freeze.template.ignoreMethods.includes(name),
    )
    const keepsOldIgnoreMethods = added.length === 0
    return renderTemplateFile({
      schema: schemaPathFor(freeze.templateId),
      header: `${this.header(result)} Kept ${freeze.locked.length} field(s) that still execute, removed ${freeze.broken.length} that broke on the new shape (${freeze.broken.map((field) => field.name).join(', ')}).`,
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
      fields: draftFields(result.draft),
    })
  }

  private async runLoop(
    request: TemplatizeRequest,
    facts: ContractFacts,
    worklist: Worklist,
    freeze?: FreezeAnalysis,
  ): Promise<LoopResult> {
    const artifacts = new FileArtifactSink(
      trailDirectory(this.settings.artifactsRoot, facts.project, facts.address),
    )
    const locked = freeze === undefined ? undefined : this.lockedTexts(freeze)
    const { prompt, truncated } = buildPrompt({ facts, worklist, locked })
    if (truncated) {
      this.logger.warn('Templatizer cut the source to fit the prompt', {
        address: facts.address,
      })
    }
    this.logger.info('Templatizer authoring', {
      address: facts.address,
      name: facts.name,
      items: worklist.items.length,
      events: worklist.events.length,
      locked: freeze?.locked.length ?? 0,
    })
    const result = await authorDraft(
      {
        model: this.model,
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
        validation: { facts, worklist, lockedFieldNames: freeze?.locked },
        trail: {
          address: facts.address,
          name: facts.name,
          shapeHash: facts.shapeHash,
          blockNumber: facts.blockNumber,
          promptTruncated: truncated,
          previousTemplate: freeze?.templateId,
          lockedFields: freeze?.locked,
          brokenFields: freeze?.broken,
        },
      },
      { maxRounds: this.settings.maxRounds },
    )
    if (result.status === 'failed') {
      this.logger.warn(
        'Templatizer gave up; the contract stays untemplatized',
        {
          address: facts.address,
          trail: artifacts.directory,
          failure: result.failure.slice(0, 500),
        },
      )
    }
    return result
  }

  private lockedTexts(freeze: FreezeAnalysis) {
    const text = this.templateService.readTemplateFile(freeze.templateId) ?? ''
    const locked = new Set(freeze.locked)
    return readFieldEntries(text).filter((entry) => locked.has(entry.name))
  }

  private header(result: Extract<LoopResult, { status: 'accepted' }>) {
    const model = result.model ?? this.settings.modelLabel
    return `Authored by ${model} via l2b discover --ai on ${this.today()}, ${result.rounds.length} round(s). Review before committing.`
  }

  private today(): string {
    return (this.settings.now ?? (() => new Date()))()
      .toISOString()
      .slice(0, 10)
  }
}

function draftFields(draft: Draft) {
  return Object.entries(draft.fields).map(([name, field]) => ({
    name,
    reason: field.reason,
    covers: field.covers,
    handler: field.handler,
    edit: field.edit,
  }))
}

function isDiamond(proxyType: string | undefined): boolean {
  return proxyType?.includes('EIP2535') ?? false
}
