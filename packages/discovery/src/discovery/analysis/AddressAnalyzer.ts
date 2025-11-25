import type {
  ChainSpecificAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'

import type {
  DiscoveryCustomType,
  Entrypoint,
} from '../config/StructureConfig.js'
import type { StructureContractConfig } from '../config/structureUtils.js'
import type { HandlerResult } from '../handlers/Handler.js'
import type { HandlerExecutor } from '../handlers/HandlerExecutor.js'
import type { ContractValue } from '../output/types.js'
import type { IProvider } from '../provider/IProvider.js'
import type { ProxyDetector } from '../proxies/ProxyDetector.js'
import { getImplementationNames } from '../source/getDerivedName.js'
import { getLibraries } from '../source/getLibraries.js'
import type {
  PerContractSource,
  SourceCodeService,
} from '../source/SourceCodeService.js'
import {
  get$Beacons,
  get$Implementations,
  get$PastUpgrades,
} from '../utils/extractors.js'
import { codeIsEOA } from './codeIsEOA.js'
import { getRelativesWithSuggestedTemplates } from './getRelativesWithSuggestedTemplates.js'
import type { TemplateService } from './TemplateService.js'

export type Analysis = AnalyzedContract | AnalyzedEOA | Reference

interface AnalyzedCommon {
  address: ChainSpecificAddress
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
  ) {}

  async analyze(
    provider: IProvider,
    address: ChainSpecificAddress,
    config: StructureContractConfig,
    entrypoints: Record<ChainSpecificAddress, Entrypoint> = {},
    suggestedTemplates?: Set<string>,
  ): Promise<Analysis> {
    const code = await provider.getBytecode(address)
    const isEOA = codeIsEOA(code)

    const templateErrors: Record<string, string> = {}
    let extendedTemplate: ExtendedTemplate | undefined = undefined

    if (suggestedTemplates !== undefined) {
      const template = Array.from(suggestedTemplates)[0]
      if (template !== undefined) {
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
      const template = matchingTemplates[0]
      if (template !== undefined) {
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
      ...(values ?? {}),
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
}
