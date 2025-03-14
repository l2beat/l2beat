import type { EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'

import type { ContractConfig } from '../config/ContractConfig'
import type {
  DiscoveryCategory,
  DiscoveryCustomType,
  ExternalReference,
} from '../config/RawDiscoveryConfig'
import type { HandlerResult } from '../handlers/Handler'
import type { HandlerExecutor } from '../handlers/HandlerExecutor'
import type { FieldMeta } from '../output/types'
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
import { resolveCategory } from './category'
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
  fieldsMeta: Record<string, FieldMeta>
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
  references?: ExternalReference[]
  category?: DiscoveryCategory
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
    config: ContractConfig,
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

    const ignoredAddresses = [
      ...implementations,
      ...beacons,
      ...pastUpgrades.flatMap((e) => e[2]),
    ]
    const relatives = getRelativesWithSuggestedTemplates(
      results.concat(proxyResults),
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
      derivedName:
        config.name !== undefined && config.name !== sources.name
          ? sources.name
          : undefined,
      isVerified: sources.isVerified,
      address,
      deploymentTimestamp: deployment?.timestamp,
      deploymentBlockNumber: deployment?.blockNumber,
      implementations: implementations,
      proxyType: proxy?.type,
      values: mergedValues,
      fieldsMeta: this.getFieldsMeta(config),
      errors: { ...templateErrors, ...errors },
      abis: sources.abis,
      sourceBundles: sources.sources,
      extendedTemplate,
      ignoreInWatchMode: config.ignoreInWatchMode,
      references: config.references,
      relatives,
      usedTypes,
      category: resolveCategory(config),
    }

    const analysis: Analysis = {
      ...analysisWithoutMeta,
      selfMeta: getSelfMeta(config, analysisWithoutMeta),
      targetsMeta: getTargetsMeta(
        address,
        mergedValues,
        config.fields,
        analysisWithoutMeta,
      ),
    } as Analysis

    return analysis
  }

  getFieldsMeta(config: ContractConfig): Record<string, FieldMeta> {
    const result: Record<string, FieldMeta> = {}

    for (const [key, value] of Object.entries(config.fields)) {
      if (value.severity === undefined && value.description === undefined) {
        continue
      }

      result[key] = {
        severity: value.severity,
        description: value.description,
        type: value.type,
      }
    }

    return result
  }
}
