import type { ChainSpecificAddress } from '@l2beat/shared-pure'
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
  constructor(private readonly configReader: ConfigReader) {}

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
