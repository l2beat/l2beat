import { assert } from '@l2beat/backend-tools'
import {
  ContractParameters,
  ContractValue,
  UpgradeabilityParameters,
} from '@l2beat/discovery-types'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { isEqual } from 'lodash'

import { DiscoveryLogger } from '../DiscoveryLogger'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import { DiscoveryCustomType } from '../config/RawDiscoveryConfig'
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
  upgradeability: UpgradeabilityParameters
  implementations: EthereumAddress[]
  values: Record<string, ContractValue>
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
}

export interface AnalyzedEOA {
  type: 'EOA'
  address: EthereumAddress
}

export type AddressesWithTemplates = Record<string, Set<string>>

export class AddressAnalyzer {
  constructor(
    private readonly proxyDetector: ProxyDetector,
    private readonly sourceCodeService: SourceCodeService,
    private readonly handlerExecutor: HandlerExecutor,
    private readonly templateService: TemplateService,
    private readonly logger: DiscoveryLogger,
  ) {}

  async analyze(
    provider: IProvider,
    address: EthereumAddress,
    overrides: ContractOverrides | undefined,
    types: Record<string, DiscoveryCustomType> | undefined,
    logger: DiscoveryLogger,
    suggestedTemplates?: Set<string>,
  ): Promise<Analysis> {
    const code = await provider.getBytecode(address)
    if (code.length === 0) {
      logger.logEoa()
      return { type: 'EOA', address }
    }

    const deployment = await provider.getDeployment(address)

    const templateErrors: Record<string, string> = {}
    let extendedTemplate: ExtendedTemplate | undefined = undefined

    if (overrides?.extends !== undefined) {
      extendedTemplate = { template: overrides.extends, reason: 'byExtends' }
    } else if (suggestedTemplates !== undefined) {
      const template = Array.from(suggestedTemplates)[0]
      if (template !== undefined) {
        // extend template even on error to make sure pruning works
        overrides = this.templateService.applyTemplateOnContractOverrides(
          overrides ?? { address },
          template,
        )
        extendedTemplate = { template, reason: 'byReferrer' }
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
      logger,
      overrides?.proxyType,
    )

    const sources = await this.sourceCodeService.getSources(
      provider,
      address,
      proxy?.implementations,
    )
    logger.logName(sources.name)

    // Match templates by shape only if there are no explicitly set
    if (
      overrides?.extends === undefined &&
      (suggestedTemplates === undefined || suggestedTemplates.size === 0)
    ) {
      const matchingTemplatesByShape =
        this.templateService.findMatchingTemplates(sources)
      const matchingTemplates = Object.keys(matchingTemplatesByShape)
      const template = matchingTemplates[0]
      if (template !== undefined) {
        // extend template even on error to make sure pruning works
        overrides = this.templateService.applyTemplateOnContractOverrides(
          overrides ?? { address },
          template,
        )
        extendedTemplate = { template, reason: 'byShapeMatch' }
      }
      if (matchingTemplates.length > 1) {
        templateErrors['@template'] =
          `Multiple shapes matched (${matchingTemplates.join(', ')})`
      }
    }

    const templateLog =
      extendedTemplate !== undefined
        ? `"${extendedTemplate?.template}" (${extendedTemplate?.reason})`
        : 'none'

    logger.log(`  Template: ${templateLog}`)

    const { results, values, errors, usedTypes } =
      await this.handlerExecutor.execute(
        provider,
        address,
        sources.abi,
        overrides,
        types,
        logger,
      )
    const relatives = getRelativesWithSuggestedTemplates(
      results,
      overrides?.ignoreRelatives,
      proxy?.relatives,
      proxy?.implementations,
      overrides?.fields,
    )
    const targetsMeta =
      overrides?.fields !== undefined
        ? getTargetsMeta(address, results, overrides.fields)
        : undefined

    return {
      type: 'Contract',
      name: overrides?.name ?? sources.name,
      derivedName: overrides?.name !== undefined ? sources.name : undefined,
      isVerified: sources.isVerified,
      address,
      deploymentTimestamp: deployment?.timestamp,
      deploymentBlockNumber: deployment?.blockNumber,
      upgradeability: proxy?.upgradeability ?? { type: 'immutable' },
      implementations: proxy?.implementations ?? [],
      values: values ?? {},
      errors: { ...templateErrors, ...(errors ?? {}) },
      abis: sources.abis,
      sourceBundles: sources.sources,
      extendedTemplate,
      ignoreInWatchMode: overrides?.ignoreInWatchMode,
      relatives,
      selfMeta: getSelfMeta(overrides),
      targetsMeta,
      usedTypes,
    }
  }

  async hasContractChanged(
    provider: IProvider,
    contract: ContractParameters,
    overrides: ContractOverrides,
    types: Record<string, DiscoveryCustomType> | undefined,
    abis: Record<string, string[]>,
  ): Promise<boolean> {
    if (contract.unverified) {
      // Check if the contract is verified now
      const { isVerified } = await this.sourceCodeService.getSources(
        provider,
        contract.address,
        contract.implementations,
      )
      return isVerified
    }

    const abi = this.sourceCodeService.getRelevantAbi(
      abis,
      contract.address,
      contract.implementations,
      contract.ignoreInWatchMode,
    )

    const { values: newValues, errors } = await this.handlerExecutor.execute(
      provider,
      contract.address,
      abi,
      overrides,
      types,
      this.logger,
    )

    assert(
      errors === undefined || Object.keys(errors).length === 0,
      'Errors during watch mode',
    )

    const prevRelevantValues = getRelevantValues(
      contract.values ?? {},
      contract.ignoreInWatchMode ?? [],
    )

    if (!isEqual(newValues, prevRelevantValues)) {
      this.logger.log(
        `Some values changed on contract ${
          contract.name
        }(${contract.address.toString()})`,
      )
      return true
    }

    return false
  }

  async hasEoaBecomeContract(
    provider: IProvider,
    address: EthereumAddress,
  ): Promise<boolean> {
    const code = await provider.getBytecode(address)
    if (code.length > 0) {
      this.logger.log(`EOA ${address.toString()} became a contract`)
      return true
    }

    return false
  }
}

function getRelevantValues(
  contractValues: Record<string, ContractValue | undefined>,
  ignoreInWatchMode: string[],
): Record<string, ContractValue | undefined> {
  return Object.keys(contractValues)
    .filter((key) => !ignoreInWatchMode.includes(key))
    .reduce((obj: Record<string, ContractValue | undefined>, key: string) => {
      obj[key] = contractValues[key]
      return obj
    }, {})
}
