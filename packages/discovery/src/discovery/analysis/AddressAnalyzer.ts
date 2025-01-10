import {
  ContractValue,
  FieldMeta,
  get$PastUpgrades,
} from '@l2beat/discovery-types'
import { EthereumAddress, Hash256, UnixTime } from '@l2beat/shared-pure'

import { get$Beacons, get$Implementations } from '@l2beat/discovery-types'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import {
  DiscoveryContractField,
  DiscoveryCustomType,
} from '../config/RawDiscoveryConfig'
import { HandlerResult } from '../handlers/Handler'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import { IProvider } from '../provider/IProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'
import {
  PerContractSource,
  SourceCodeService,
} from '../source/SourceCodeService'
import { TemplateService } from './TemplateService'
import { getRelativesWithSuggestedTemplates } from './getRelativesWithSuggestedTemplates'
import { ContractMeta, getSelfMeta, getTargetsMeta } from './metaUtils'

export type Analysis = AnalyzedContract | AnalyzedEOA

export interface AnalyzedContract {
  type: 'Contract'
  address: EthereumAddress
  name: string
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
}

export interface ExtendedTemplate {
  template: string
  reason: 'byExtends' | 'byReferrer' | 'byShapeMatch'
  templateHash: Hash256
}

interface AnalyzedEOA {
  type: 'EOA'
  name?: string
  address: EthereumAddress
  combinedMeta?: ContractMeta
}

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
    overrides: ContractOverrides | undefined,
    types: Record<string, DiscoveryCustomType> | undefined,
    suggestedTemplates?: Set<string>,
  ): Promise<Analysis> {
    const code = await provider.getBytecode(address)
    if (code.length === 0) {
      return { type: 'EOA', name: overrides?.name, address }
    }

    const deployment = await provider.getDeployment(address)

    const templateErrors: Record<string, string> = {}
    let extendedTemplate: ExtendedTemplate | undefined = undefined

    if (overrides?.extends !== undefined) {
      extendedTemplate = {
        template: overrides.extends,
        reason: 'byExtends',
        templateHash: this.templateService.getTemplateHash(overrides.extends),
      }
    } else if (suggestedTemplates !== undefined) {
      const template = Array.from(suggestedTemplates)[0]
      if (template !== undefined) {
        // extend template even on error to make sure pruning works
        overrides = this.templateService.applyTemplateOnContractOverrides(
          overrides ?? { address },
          template,
        )
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
      overrides?.proxyType,
    )
    const implementations = get$Implementations(proxy?.values)
    const beacons = get$Beacons(proxy?.values)
    const pastUpgrades = get$PastUpgrades(proxy?.values)

    const sources = await this.sourceCodeService.getSources(
      provider,
      address,
      implementations,
      overrides?.manualSourcePaths ?? {},
    )

    const name = overrides?.name ?? sources.name
    // Match templates by shape only if there are no explicitly set
    if (
      overrides?.extends === undefined &&
      (suggestedTemplates === undefined || suggestedTemplates.size === 0)
    ) {
      const matchingTemplates = this.templateService.findMatchingTemplates(
        sources,
        address,
      )
      const template = matchingTemplates[0]
      if (template !== undefined) {
        // extend template even on error to make sure pruning works
        overrides = this.templateService.applyTemplateOnContractOverrides(
          overrides ?? { address },
          template,
        )
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
      await this.handlerExecutor.execute(
        provider,
        address,
        sources.abi,
        overrides,
        types,
      )

    const proxyResults = Object.entries(proxy?.values ?? {}).map(
      ([field, value]): HandlerResult => ({ field, value }),
    )

    const ignoredAddresses = [
      ...implementations,
      ...beacons,
      ...pastUpgrades.flatMap((e) => e[2]),
    ]
    const relatives = getRelativesWithSuggestedTemplates(
      results.concat(proxyResults),
      overrides?.ignoreRelatives,
      ignoredAddresses,
      overrides?.fields,
    )

    const mergedValues = {
      ...(!proxy ? { $immutable: true } : {}),
      ...(proxy?.values ?? {}),
      ...(values ?? {}),
    }

    const analysisWithoutMeta: Omit<
      AnalyzedContract,
      'selfMeta' | 'targetsMeta'
    > = {
      type: 'Contract',
      name,
      derivedName: overrides?.name !== undefined ? sources.name : undefined,
      isVerified: sources.isVerified,
      address,
      deploymentTimestamp: deployment?.timestamp,
      deploymentBlockNumber: deployment?.blockNumber,
      implementations: implementations,
      proxyType: proxy?.type,
      values: mergedValues,
      fieldsMeta: this.getFieldsMeta(extendedTemplate, overrides),
      errors: { ...templateErrors, ...(errors ?? {}) },
      abis: sources.abis,
      sourceBundles: sources.sources,
      extendedTemplate,
      ignoreInWatchMode: overrides?.ignoreInWatchMode,
      relatives,
      usedTypes,
    }

    const analysis: AnalyzedContract = {
      ...analysisWithoutMeta,
      selfMeta: getSelfMeta(overrides, analysisWithoutMeta),
      targetsMeta: getTargetsMeta(
        address,
        mergedValues,
        overrides?.fields,
        analysisWithoutMeta,
      ),
    }
    return analysis
  }

  getFieldsMeta(
    template: ExtendedTemplate | undefined,
    overrides: ContractOverrides | undefined,
  ): Record<string, FieldMeta> {
    const result: Record<string, FieldMeta> = {}
    const fieldOverrides: Record<string, DiscoveryContractField>[] = [
      overrides?.fields ?? {},
      template !== undefined
        ? (this.templateService.loadContractTemplate(template.template)
            .fields ?? {})
        : {},
    ]

    for (const override of fieldOverrides) {
      for (const [key, value] of Object.entries(override)) {
        if (value.severity === undefined && value.description === undefined) {
          continue
        }

        result[key] = {
          severity: value.severity,
          description: value.description,
        }
      }
    }

    return result
  }
}
