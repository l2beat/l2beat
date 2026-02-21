import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { DiscoveryOutput, EntryParameters } from '../output/types'
import { get$Implementations } from '../utils/extractors'
import type { ConfigRegistry } from './ConfigRegistry'
import type { StructureContract } from './StructureConfig'

type ConfigHealthHint = {
  source: 'config'
  target: {
    project: string
    address: ChainSpecificAddress
    name?: string
  }
  excess: {
    ignoreInWatchMode?: string[]
    ignoreMethods?: string[]
    ignoreRelatives?: string[]
  }
}

type TemplateHealthHint = {
  source: 'template'
  target: {
    templateId: string
  }
  excess: {
    ignoreInWatchMode?: string[]
    ignoreMethods?: string[]
    ignoreRelatives?: string[]
  }
}

export type HealthHint = ConfigHealthHint | TemplateHealthHint

export class ConfigHealthService {
  checkConfigHealth(
    config: ConfigRegistry,
    discovery: DiscoveryOutput,
  ): HealthHint[] {
    const hints: HealthHint[] = []

    for (const entry of discovery.entries) {
      const possibleValues = this.getPossibleValuesForEntry(entry, discovery)
      const override = config.structure.overrides?.[entry.address]

      const configuredWatchMode = entry?.ignoreInWatchMode ?? []
      const configuredMethods = override?.ignoreMethods ?? []
      const configuredRelatives = override?.ignoreRelatives ?? []

      const excessWatchMode = this.filterOverspecified(
        configuredWatchMode,
        possibleValues,
      )
      const excessMethods = this.filterOverspecified(
        configuredMethods,
        possibleValues,
      )
      const excessRelatives = this.filterOverspecified(
        configuredRelatives,
        possibleValues,
      )

      if (anyNonEmpty(excessWatchMode, excessMethods, excessRelatives)) {
        hints.push({
          source: 'config',
          target: {
            project: config.name,
            address: entry.address,
            name: entry.name,
          },
          excess: {
            ignoreInWatchMode: excessWatchMode,
            ignoreMethods: excessMethods,
            ignoreRelatives: excessRelatives,
          },
        })
      }
    }

    return hints
  }

  checkTemplateHealth(
    templateConfig: StructureContract,
    discoveries: DiscoveryOutput[],
    templateId: string,
  ): HealthHint[] {
    const hints: HealthHint[] = []
    const allPossibleValues = new Set<string>()

    for (const discovery of discoveries) {
      const possibleValuesForTemplate = this.getPossibleValuesForTemplate(
        discovery,
        templateId,
      )

      for (const value of possibleValuesForTemplate) {
        allPossibleValues.add(value)
      }
    }

    const configuredWatchMode = templateConfig.ignoreInWatchMode ?? []
    const configuredMethods = templateConfig.ignoreMethods ?? []
    const configuredRelatives = templateConfig.ignoreRelatives ?? []

    const excessWatchMode = this.filterOverspecified(
      configuredWatchMode,
      allPossibleValues,
    )
    const excessMethods = this.filterOverspecified(
      configuredMethods,
      allPossibleValues,
    )
    const excessRelatives = this.filterOverspecified(
      configuredRelatives,
      allPossibleValues,
    )

    if (anyNonEmpty(excessWatchMode, excessMethods, excessRelatives)) {
      hints.push({
        source: 'template',
        target: {
          templateId,
        },
        excess: {
          ignoreInWatchMode: excessWatchMode,
          ignoreMethods: excessMethods,
          ignoreRelatives: excessRelatives,
        },
      })
    }
    return hints
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

  private getPossibleValuesForTemplate(
    discovery: DiscoveryOutput,
    templateId: string,
  ): Set<string> {
    const possibleValues = new Set<string>()

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

function anyNonEmpty<T>(...arrays: T[][]): boolean {
  return arrays.some((arr) => arr.length > 0)
}
