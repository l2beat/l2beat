import type { EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'

import type { StructureContractConfig } from '../config/structureUtils'
import type { DiscoveryCustomType } from '../config/StructureConfig'
import type { HandlerResult } from '../handlers/Handler'
import type { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { ContractValue } from '../output/types'
import type { IProvider } from '../provider/IProvider'
import type { ProxyDetector } from '../proxies/ProxyDetector'
import type {
  PerContractSource,
  SourceCodeService,
} from '../source/SourceCodeService'
import {
  get$Beacons,
  get$Implementations,
  get$PastUpgrades,
} from '../utils/extractors'
import type { TemplateService } from './TemplateService'
import { codeIsEOA } from './codeIsEOA'
import { getRelativesWithSuggestedTemplates } from './getRelativesWithSuggestedTemplates'
import { type ContractMeta, getSelfMeta, getTargetsMeta } from './metaUtils'

export type Analysis = AnalyzedContract | AnalyzedEOA

interface AnalyzedCommon {
  address: EthereumAddress
  deploymentTimestamp?: UnixTime
  deploymentBlockNumber?: number
  derivedName: string | undefined
  isVerified: boolean
  proxyType?: string
  implementations: EthereumAddress[]
  values: Record<string, ContractValue | undefined>
  errors: Record<string, string>
  abis: Record<string, string[]>
  sourceBundles: PerContractSource[]
  extendedTemplate?: ExtendedTemplate
  ignoreInWatchMode?: string[]
  relatives: AddressesWithTemplates
  selfMeta?: ContractMeta
  targetsMeta?: Record<string, ContractMeta>
  combinedMeta?: ContractMeta
  usedTypes?: DiscoveryCustomType[]
}

export type AnalyzedContract = {
  type: 'Contract'
  name: string
} & AnalyzedCommon

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
    address: EthereumAddress,
    config: StructureContractConfig,
    suggestedTemplates?: Set<string>,
  ): Promise<Analysis> {
    const code = await provider.getBytecode(address)
    const isEOA = codeIsEOA(code)

    const templateErrors: Record<string, string> = {}
    let extendedTemplate: ExtendedTemplate | undefined = undefined

    if (config.extends !== undefined) {
      const templateValues = this.templateService.loadContractTemplate(
        config.extends,
      )
      config.pushValues(templateValues)
      extendedTemplate = {
        template: config.extends,
        reason: 'byExtends',
        templateHash: this.templateService.getTemplateHash(config.extends),
      }
    } else if (suggestedTemplates !== undefined) {
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

    const handlerResults = results.map(
      (result): HandlerResult => ({ ...result, value: values?.[result.field] }),
    )

    const ignoredAddresses = [
      ...implementations,
      ...beacons,
      ...pastUpgrades.flatMap((e) => e[2]),
    ]
    const relatives = getRelativesWithSuggestedTemplates(
      handlerResults.concat(proxyResults),
      config.ignoreRelatives,
      ignoredAddresses,
      config.fields,
    )

    const mergedValues = {
      ...proxy.values,
      ...(values ?? {}),
    }

    const deployment = proxy.deployment
    const analysisWithoutMeta: Omit<Analysis, 'selfMeta' | 'targetsMeta'> = {
      type: isEOA ? 'EOA' : 'Contract',
      name: isEOA ? config.name : (config.name ?? sources.name),
      derivedName: isEOA ? undefined : sources.name,
      isVerified: sources.isVerified,
      address,
      deploymentTimestamp: deployment?.timestamp,
      deploymentBlockNumber: deployment?.blockNumber,
      implementations: implementations,
      proxyType: proxy?.type,
      values: mergedValues,
      errors: { ...templateErrors, ...errors },
      abis: sources.abis,
      sourceBundles: sources.sources,
      extendedTemplate,
      ignoreInWatchMode: config.ignoreInWatchMode,
      relatives,
      usedTypes,
    }

    const analysis: Analysis = {
      ...analysisWithoutMeta,
      selfMeta: getSelfMeta(config),
      targetsMeta: getTargetsMeta(
        address,
        mergedValues,
        config.fields,
        analysisWithoutMeta,
      ),
    } as Analysis

    return analysis
  }
}
