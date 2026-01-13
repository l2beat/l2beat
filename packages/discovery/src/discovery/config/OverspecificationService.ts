import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { TemplateService } from '../analysis/TemplateService'
import type { DiscoveryOutput, EntryParameters } from '../output/types'
import { get$Implementations } from '../utils/extractors'
import type { ConfigReader } from './ConfigReader'

export interface OverspecifiedResult {
  ignoreInWatchMode: string[]
  ignoreMethods: string[]
  ignoreRelatives: string[]
}

export interface ConfigOverspecificationResult {
  address: string
  overspecified: OverspecifiedResult
}

export interface TemplateOverspecificationResult {
  templateId: string
  overspecified: OverspecifiedResult
}

export class OverspecificationService {
  constructor(
    private readonly configReader: ConfigReader,
    private readonly templateService: TemplateService,
  ) {}

  checkConfigOverspecification(
    projectName: string,
    address: ChainSpecificAddress,
    providedMethods: {
      ignoreInWatchMode?: string[]
      ignoreMethods?: string[]
      ignoreRelatives?: string[]
    },
  ): OverspecifiedResult {
    const discovery = this.configReader.readDiscovery(projectName)
    const entry = discovery.entries.find((e) => e.address === address)

    if (!entry) {
      throw new Error(
        `Entry with address ${address} not found in discovery for ${projectName}`,
      )
    }

    const possibleValues = this.getPossibleValuesForEntry(entry, discovery)

    return {
      ignoreInWatchMode: this.filterOverspecified(
        providedMethods.ignoreInWatchMode ?? [],
        possibleValues,
      ),
      ignoreMethods: this.filterOverspecified(
        providedMethods.ignoreMethods ?? [],
        possibleValues,
      ),
      ignoreRelatives: this.filterOverspecified(
        providedMethods.ignoreRelatives ?? [],
        possibleValues,
      ),
    }
  }

  checkAllConfigOverrides(
    projectName: string,
  ): ConfigOverspecificationResult[] {
    const config = this.configReader.readConfig(projectName)
    const discovery = this.configReader.readDiscovery(projectName)
    const results: ConfigOverspecificationResult[] = []

    const overrides = config.structure.overrides ?? {}

    for (const [address, override] of Object.entries(overrides)) {
      const entry = discovery.entries.find(
        (e) => e.address.toString() === address,
      )
      if (!entry) continue

      const possibleValues = this.getPossibleValuesForEntry(entry, discovery)

      const overspecified: OverspecifiedResult = {
        ignoreInWatchMode: this.filterOverspecified(
          override.ignoreInWatchMode ?? [],
          possibleValues,
        ),
        ignoreMethods: this.filterOverspecified(
          override.ignoreMethods ?? [],
          possibleValues,
        ),
        ignoreRelatives: this.filterOverspecified(
          override.ignoreRelatives ?? [],
          possibleValues,
        ),
      }

      if (
        overspecified.ignoreInWatchMode.length > 0 ||
        overspecified.ignoreMethods.length > 0 ||
        overspecified.ignoreRelatives.length > 0
      ) {
        results.push({
          address,
          overspecified,
        })
      }
    }

    return results
  }

  checkTemplateOverspecification(
    templateId: string,
    providedMethods: {
      ignoreInWatchMode?: string[]
      ignoreMethods?: string[]
      ignoreRelatives?: string[]
    },
  ): OverspecifiedResult {
    const possibleValues = this.getPossibleValuesForTemplate(templateId)

    return {
      ignoreInWatchMode: this.filterOverspecified(
        providedMethods.ignoreInWatchMode ?? [],
        possibleValues,
      ),
      ignoreMethods: this.filterOverspecified(
        providedMethods.ignoreMethods ?? [],
        possibleValues,
      ),
      ignoreRelatives: this.filterOverspecified(
        providedMethods.ignoreRelatives ?? [],
        possibleValues,
      ),
    }
  }

  checkTemplateFile(templateId: string): TemplateOverspecificationResult {
    const template = this.templateService.loadContractTemplate(templateId)
    const possibleValues = this.getPossibleValuesForTemplate(templateId)

    const overspecified: OverspecifiedResult = {
      ignoreInWatchMode: this.filterOverspecified(
        template.ignoreInWatchMode ?? [],
        possibleValues,
      ),
      ignoreMethods: this.filterOverspecified(
        template.ignoreMethods ?? [],
        possibleValues,
      ),
      ignoreRelatives: this.filterOverspecified(
        template.ignoreRelatives ?? [],
        possibleValues,
      ),
    }

    return {
      templateId,
      overspecified,
    }
  }

  checkAllTemplates(): TemplateOverspecificationResult[] {
    const templates = Object.keys(this.templateService.listAllTemplates())
    const results: TemplateOverspecificationResult[] = []

    for (const templateId of templates) {
      const result = this.checkTemplateFile(templateId)

      if (
        result.overspecified.ignoreInWatchMode.length > 0 ||
        result.overspecified.ignoreMethods.length > 0 ||
        result.overspecified.ignoreRelatives.length > 0
      ) {
        results.push(result)
      }
    }

    return results
  }

  private getPossibleValuesForEntry(
    entry: EntryParameters,
    discovery: DiscoveryOutput,
  ): Set<string> {
    const implementations = get$Implementations(entry.values)
    const abis = implementations
      .map((implementation) => discovery.abis[implementation] ?? [])
      .concat(discovery.abis[entry.address] ?? [])

    const functionNamesFromAbi = this.extractFunctionNamesFromAbi(abis.flat())
    const maybeCustomValues = Object.keys(entry.values ?? {})

    return new Set([...functionNamesFromAbi, ...maybeCustomValues])
  }

  private getPossibleValuesForTemplate(templateId: string): Set<string> {
    const allDiscoveries = this.configReader
      .readAllDiscoveredProjects()
      .map((project) => this.configReader.readDiscovery(project))

    const possibleValues = new Set<string>()

    for (const discovery of allDiscoveries) {
      for (const entry of discovery.entries) {
        if (entry.template === templateId) {
          const implementations = get$Implementations(entry.values)
          const abis = implementations
            .map((implementation) => discovery.abis[implementation] ?? [])
            .concat(discovery.abis[entry.address] ?? [])

          for (const functionName of this.extractFunctionNamesFromAbi(
            abis.flat(),
          )) {
            possibleValues.add(functionName)
          }

          for (const value of Object.keys(entry.values ?? {})) {
            possibleValues.add(value)
          }
        }
      }
    }

    return possibleValues
  }

  private extractFunctionNamesFromAbi(abi: string[]): string[] {
    return abi
      .filter((x) => x.startsWith('function '))
      .map((x) => x.slice('function '.length, x.indexOf('(')))
  }

  private filterOverspecified(
    methods: string[],
    possibleValues: Set<string>,
  ): string[] {
    return methods.filter((method) => !possibleValues.has(method))
  }
}
