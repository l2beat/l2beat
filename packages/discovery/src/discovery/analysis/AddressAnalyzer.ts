import type {
  ChainSpecificAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'

import type { DiscoveryCustomType } from '../config/StructureConfig'
import type { StructureContractConfig } from '../config/structureUtils'
import type { HandlerResult } from '../handlers/Handler'
import type { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { ContractValue } from '../output/types'
import type { IProvider } from '../provider/IProvider'
import type { ProxyDetector } from '../proxies/ProxyDetector'
import type { ProxyResult } from '../proxies/types'
import { getImplementationNames } from '../source/getDerivedName'
import { getLibraries } from '../source/getLibraries'
import type {
  ContractSources,
  PerContractSource,
  SourceCodeService,
} from '../source/SourceCodeService'
import type { TemplatizeRequest, Templatizer } from '../templatizer/Templatizer'
import {
  get$Beacons,
  get$Implementations,
  get$PastUpgrades,
} from '../utils/extractors'
import { codeIsEOA } from './bytecode'
import { getRelativesWithSuggestedTemplates } from './getRelativesWithSuggestedTemplates'
import type { TemplateService } from './TemplateService'

export type Analysis = AnalyzedContract | AnalyzedEOA | Reference

interface AnalyzedCommon {
  address: ChainSpecificAddress
  deployerAddress?: ChainSpecificAddress
  deploymentTimestamp?: UnixTime
  deploymentBlockNumber?: number
  implementationNames?: Record<ChainSpecificAddress, string>
  isVerified: boolean
  proxyType?: string
  implementations: ChainSpecificAddress[]
  values: Record<string, ContractValue | undefined>
  errors: Record<string, string>
  abis: Record<string, string[]>
  sourceBundles: PerContractSource[]
  extendedTemplate?: ExtendedTemplate
  ignoreInWatchMode?: string[]
  relatives: AddressesWithTemplates
  usedTypes?: DiscoveryCustomType[]
}

export type AnalyzedContract = {
  type: 'Contract'
  name: string
} & AnalyzedCommon

export type Reference = {
  name: string | undefined
  address: ChainSpecificAddress
  type: 'Reference'
  targetType: Analysis['type']
  targetProject: string
}

export interface ExtendedTemplate {
  template: string
  reason: 'byExtends' | 'byReferrer' | 'byShapeMatch'
  templateHash: Hash256
}

export type AnalyzedEOA = {
  type: 'EOA'
  name: string | undefined
} & AnalyzedCommon

export type AddressesWithTemplates = Record<string, Set<string>>

export class AddressAnalyzer {
  constructor(
    private readonly proxyDetector: ProxyDetector,
    private readonly sourceCodeService: SourceCodeService,
    private readonly handlerExecutor: HandlerExecutor,
    private readonly templateService: TemplateService,
    private readonly templatizer?: Templatizer,
  ) {}

  async analyze(
    provider: IProvider,
    address: ChainSpecificAddress,
    config: StructureContractConfig,
    suggestedTemplates?: Set<string>,
  ): Promise<Analysis> {
    const code = await provider.getBytecode(address)
    const isEOA = codeIsEOA(code)

    const templateErrors: Record<string, string> = {}
    let extendedTemplate: ExtendedTemplate | undefined = undefined

    if (suggestedTemplates !== undefined) {
      const template = Array.from(suggestedTemplates)[0]
      if (template !== undefined) {
        // With --ai another contract may be adding to this template; apply
        // it as that leaves it, as for a shape match below.
        await this.templatizer?.settledFor(template, address)
        // extend template even on error to make sure pruning works
        const templateValues =
          this.templateService.loadContractTemplate(template)
        config.pushValues(templateValues)
        extendedTemplate = {
          template,
          reason: 'byReferrer',
          templateHash: this.templateService.getTemplateHash(template),
        }
      }
      if (suggestedTemplates.size > 1) {
        templateErrors['@template'] =
          `Multiple templates suggested (${Array.from(suggestedTemplates).join(
            ', ',
          )})`
      }
    }

    const proxy = await this.proxyDetector.detectProxy(
      provider,
      address,
      config.proxyType,
    )
    const implementations = get$Implementations(proxy.values)
    const beacons = get$Beacons(proxy.values)
    const pastUpgrades = get$PastUpgrades(proxy.values)

    const sources = await this.sourceCodeService.getSources(
      provider,
      proxy.addresses,
      config.manualSourcePaths,
    )
    const libraries =
      config.discoverLibraries === true
        ? getLibraries(provider.chain, sources)
        : []

    if (extendedTemplate === undefined) {
      const matchingTemplates = this.templateService.findMatchingTemplates(
        sources,
        address,
      )
      if (matchingTemplates.length === 0 && !isEOA) {
        const authored = await this.authorTemplate(
          provider,
          address,
          config,
          sources,
          proxy,
        )
        if (authored !== undefined) {
          matchingTemplates.push(authored)
        }
      } else if (matchingTemplates.length === 1 && !isEOA) {
        await this.revisitTemplate(
          provider,
          address,
          config,
          sources,
          proxy,
          matchingTemplates[0] as string,
        )
      }
      const template = matchingTemplates[0]
      if (template !== undefined) {
        // With --ai another contract may be adding to this template; apply
        // it as that leaves it.
        await this.templatizer?.settledFor(template, address)
        // extend template even on error to make sure pruning works
        const templateValues =
          this.templateService.loadContractTemplate(template)
        config.pushValues(templateValues)
        extendedTemplate = {
          template,
          reason: 'byShapeMatch',
          templateHash: this.templateService.getTemplateHash(template),
        }
      }
      if (matchingTemplates.length > 1) {
        templateErrors['@template'] =
          `Multiple shapes matched (${matchingTemplates.join(', ')})`
      }
    }

    const { results, values, errors, usedTypes } =
      await this.handlerExecutor.execute(provider, address, sources.abi, config)

    const proxyResults = Object.entries(proxy.values).map(
      ([field, value]): HandlerResult => ({ field, value }),
    )

    const libraryResults: HandlerResult[] =
      libraries.length > 0 ? [{ field: '$libraries', value: libraries }] : []

    const handlerResults = results.map(
      (result): HandlerResult => ({ ...result, value: values?.[result.field] }),
    )

    const ignoredAddresses = [
      ...implementations,
      ...beacons,
      ...pastUpgrades.flatMap((e) => e[2]),
    ]
    const relatives = getRelativesWithSuggestedTemplates(
      handlerResults.concat(proxyResults).concat(libraryResults),
      config.ignoreRelatives,
      ignoredAddresses,
      config.fields,
    )

    const mergedValues = {
      ...proxy.values,
      ...values,
    }

    if (libraries.length > 0) {
      mergedValues.$libraries = libraries
    }

    const deployment = proxy.deployment
    const analysis = {
      type: isEOA ? 'EOA' : 'Contract',
      name: isEOA ? undefined : sources.name,
      isVerified: sources.isVerified,
      address,
      deployerAddress: deployment?.deployer,
      deploymentTimestamp: deployment?.timestamp,
      deploymentBlockNumber: deployment?.blockNumber,
      implementations: implementations,
      implementationNames: isEOA
        ? undefined
        : getImplementationNames(address, sources),
      proxyType: proxy?.type,
      values: mergedValues,
      errors: { ...templateErrors, ...errors },
      abis: sources.abis,
      sourceBundles: sources.sources,
      extendedTemplate,
      ignoreInWatchMode: config.ignoreInWatchMode,
      relatives,
      usedTypes,
    } as Analysis

    return analysis
  }

  /**
   * Runs only with `--ai`, for a contract no template matches: one never
   * templatized, or one whose code changed. The templatizer reads the
   * baseline itself, with the handler executor this analyzer uses; the
   * analyzer then runs the handlers with the template, from the provider's
   * cache.
   */
  private async authorTemplate(
    provider: IProvider,
    address: ChainSpecificAddress,
    config: StructureContractConfig,
    sources: ContractSources,
    proxy: ProxyResult,
  ): Promise<string | undefined> {
    if (
      this.templatizer === undefined ||
      !this.templatizer.canTemplatize(sources, proxy.type)
    ) {
      return undefined
    }
    return await this.templatizer.templateFor(
      this.templatizeRequest(provider, address, config, sources, proxy),
    )
  }

  /** `--ai-revisit`: the model may extend the matched template before it is applied. */
  private async revisitTemplate(
    provider: IProvider,
    address: ChainSpecificAddress,
    config: StructureContractConfig,
    sources: ContractSources,
    proxy: ProxyResult,
    templateId: string,
  ): Promise<void> {
    if (
      this.templatizer?.revisitsMatchedTemplates !== true ||
      !this.templatizer.canTemplatize(sources, proxy.type)
    ) {
      return
    }
    await this.templatizer.revisit(
      this.templatizeRequest(provider, address, config, sources, proxy),
      templateId,
    )
  }

  /**
   * Runs before the template is pushed, so `config` is the address's own
   * config: the templatizer reads the baseline and dry runs drafts through
   * it, with the same `types` and override this run applies them with.
   */
  private templatizeRequest(
    provider: IProvider,
    address: ChainSpecificAddress,
    config: StructureContractConfig,
    sources: ContractSources,
    proxy: ProxyResult,
  ): TemplatizeRequest {
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
}
