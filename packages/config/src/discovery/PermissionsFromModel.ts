import { readFileSync } from 'fs'
import { join } from 'path'
import {
  type ClingoFact,
  type EntryParameters,
  KnowledgeBase,
  ModelIdRegistry,
  type Permission,
  parseExportedFacts,
} from '@l2beat/discovery'
import { EthereumAddress, formatSeconds } from '@l2beat/shared-pure'
import { BulletListBuilder } from './BulletListBuilder'
import type { PermissionRegistry } from './PermissionRegistry'
import type { ProjectDiscovery } from './ProjectDiscovery'
import {
  DirectPermissionToPrefix,
  UltimatePermissionToPrefix,
} from './descriptions'
import { formatPermissionDelay, trimTrailingDots } from './utils'

type ParsedTransitivePermissionFact = ReturnType<
  typeof parseTransitivePermissionFact
>

function orUndefined<V, C>(
  caster: (value: V) => C,
  value: V | undefined,
): C | undefined {
  return value === undefined ? undefined : caster(value)
}

export function parseTransitivePermissionFact(fact: ClingoFact) {
  return {
    receiver: String(fact.params[0]),
    permission: String(fact.params[1]) as Permission,
    giver: String(fact.params[2]),
    delay: Number(fact.params[3]),
    description: orUndefined(String, fact.params[4]),
    totalDelay: Number(fact.params[5]),
    viaList:
      fact.params[6] === undefined
        ? undefined
        : ((fact.params[6] as ClingoFact[]).map(parseTransitivePermissionVia) ??
          undefined),
    isFinal: fact.params[7] === 'isFinal',
  }
}

interface TransitivePermissionVia {
  atom: 'tuple'
  params: [string, string, number]
}

type ParsedTransitivePermissionVia = ReturnType<
  typeof parseTransitivePermissionVia
>

export function parseTransitivePermissionVia(via: ClingoFact) {
  return {
    contract: String(via.params[0]),
    permission: String(via.params[1]),
    delay: Number(via.params[2]),
  }
}

export interface GroupedTransitivePermissionFact {
  atom: 'transitivePermission'
  params: [
    string,
    string,
    string[],
    number,
    string | undefined,
    number,
    TransitivePermissionVia[] | undefined,
    'isFinal' | 'nonFinal',
  ]
}

export const PermissionsRequiringTarget: Permission[] = [
  'interact',
  'upgrade',
  'act',
]

export class PermissionsFromModel implements PermissionRegistry {
  private knowledgeBase: KnowledgeBase
  private modelIdRegistry: ModelIdRegistry

  constructor(private readonly projectDiscovery: ProjectDiscovery) {
    const projectPath = this.projectDiscovery.configReader.getProjectPath(
      this.projectDiscovery.projectName,
    )
    const projectPageFactsPath = join(projectPath, 'projectPageFacts.json')
    const factsFile = readFileSync(projectPageFactsPath, 'utf8')
    this.knowledgeBase = new KnowledgeBase(parseExportedFacts(factsFile).facts)
    this.modelIdRegistry = new ModelIdRegistry(this.knowledgeBase)
  }

  getPermissionedContracts(): EthereumAddress[] {
    const chain = this.projectDiscovery.chain
    return this.knowledgeBase
      .getFacts('showContractInPermissionsSection')
      .map((fact) =>
        this.modelIdRegistry.getAddressData(fact.params[0] as string),
      )
      .filter((data) => data.chain === chain)
      .map((data) => EthereumAddress.from(data.address))
  }

  getPermissionedEoas(): EthereumAddress[] {
    const chain = this.projectDiscovery.chain
    return this.knowledgeBase
      .getFacts('showEoaInPermissionsSection')
      .map((fact) =>
        this.modelIdRegistry.getAddressData(fact.params[0] as string),
      )
      .filter((data) => data.chain === chain)
      .map((data) => EthereumAddress.from(data.address))
  }

  describePermissions(
    contractOrEoa: EntryParameters,
    includeDirectPermissions: boolean = true,
  ) {
    const id = this.modelIdRegistry.getModelId(
      this.projectDiscovery.chain,
      contractOrEoa.address,
    )
    const permissionFacts = this.knowledgeBase
      .getFacts('filteredTransitivePermission', [id, 'upgrade'])
      .map(parseTransitivePermissionFact)

    type ContractGroups = Record<string, ParsedTransitivePermissionFact[]>
    type DelayVias = Record<string, ParsedTransitivePermissionVia[][]> // { [delay]: via[] }
    interface ConfigGroupEntry {
      contract: string
      delayVias: DelayVias
    }
    type ConfigGroups = Record<string, ConfigGroupEntry[]>

    // 1. Group by contract
    const contractGroups: ContractGroups = {}
    for (const fact of permissionFacts) {
      if (!contractGroups[fact.receiver]) {
        contractGroups[fact.receiver] = []
      }
      contractGroups[fact.receiver].push(fact)
    }

    // 2. Process each contract group
    const configGroups: ConfigGroups = {}

    for (const [contract, records] of Object.entries(contractGroups)) {
      // Collect all delays and their vias for this contract
      const delayVias: DelayVias = {}

      for (const record of records) {
        if (!delayVias[record.totalDelay]) {
          delayVias[record.totalDelay] = []
        }
        delayVias[record.totalDelay].push(record.viaList ?? [])
      }

      // 3. Create configuration group key (sorted delays)
      const delays = Object.keys(delayVias).sort()
      const configKey = delays.join(',')

      // Add to configuration groups
      if (!configGroups[configKey]) {
        configGroups[configKey] = []
      }

      configGroups[configKey].push({
        contract,
        delayVias,
      })
    }

    return [JSON.stringify(configGroups, null, 2)]
  }

  describePermissions2(
    contractOrEoa: EntryParameters,
    includeDirectPermissions: boolean = true,
  ) {
    const id = this.modelIdRegistry.getModelId(
      this.projectDiscovery.chain,
      contractOrEoa.address,
    )
    const permissionFacts = this.knowledgeBase
      .getFacts('filteredTransitivePermission', [id])
      .map(parseTransitivePermissionFact)
    // .filter((fact) => fact.permission !== 'act')

    const nonInteractDescribed = this.renderNonInteractPermission(
      permissionFacts.filter((fact) => fact.permission !== 'interact'),
      includeDirectPermissions,
    )
    const interactDescribed = this.renderInteractPermission(
      permissionFacts.filter((fact) => fact.permission === 'interact'),
      includeDirectPermissions,
    )
    const result = [
      this.modelIdRegistry.replaceIdsWithNames(nonInteractDescribed),
      this.modelIdRegistry.replaceIdsWithNames(interactDescribed),
    ].join('\n')
    return result.trim() === '' ? [] : [result]
  }

  /**
   *  Non-interact permissions (like upgrade) are rendered as following:
   *
   *  Actor
   *    * can upgrade
   *      * with no delay
   *        * Contract A [via]
   *        * Contract B [via]
   *      * with 10d delay
   *        * Contract C [via]
   *
   * ...but with single subpoints merged into parent.
   */
  renderNonInteractPermission(
    facts: ParsedTransitivePermissionFact[],
    includeDirectPermissions: boolean = true,
  ): string {
    // sort by permission, then by total delay
    facts.sort((a, b) => {
      if (a.permission !== b.permission) {
        return a.permission.localeCompare(b.permission)
      }
      return a.totalDelay - b.totalDelay
    })
    const result = new BulletListBuilder()
    let currentPermission: Permission | undefined
    let currentDelay: number | undefined

    for (const fact of facts) {
      if (!includeDirectPermissions && fact.permission === 'act') {
        continue
      }
      // Check if we have a new permission type
      if (fact.permission !== currentPermission) {
        currentPermission = fact.permission
        currentDelay = undefined
        const prefixMap = fact.isFinal
          ? UltimatePermissionToPrefix
          : DirectPermissionToPrefix
        result.resetIndent(0)
        result.addItem(
          prefixMap[currentPermission] ?? `has ${currentPermission} permission`,
        )
        result.indent()
      }

      // Check if we have a new delay
      if (fact.totalDelay !== currentDelay) {
        currentDelay = fact.totalDelay
        result.resetIndent(1)
        const delayText =
          currentDelay === 0
            ? '**with no delay**'
            : `**${formatPermissionDelay(currentDelay).trim()}**`
        result.addItem(delayText, `(${delayText})`) // if merging with parent, use brackets
        result.indent()
      }

      let value = `@@${fact.giver}`
      if (fact.description !== undefined) {
        value += ' ' + trimTrailingDots(fact.description)
      }
      if (fact.viaList !== undefined && fact.viaList?.length > 0) {
        value += ` [via: - acting via ${fact.viaList.map(renderTransitivePermissionVia).join(', ')}]`
      }
      result.addItem(value)
    }

    return result.renderMd({ mergeSingleSubpoints: true })
  }

  /**
   *  Interact permissions are rendered as following:
   *
   *  Actor
   *    * can interact with Contract A
   *      * add transactions with XX delay [via]
   *      * cancel transactions with XX delay [via]
   *      * execute transactions with YY delay [via]
   *
   * ...but with single subpoints merged into parent.
   */
  renderInteractPermission(
    facts: ParsedTransitivePermissionFact[],
    includeDirectPermissions: boolean = true,
  ): string {
    // sort by giver, then totalDelay
    facts.sort((a, b) => {
      if (a.giver !== b.giver) {
        return a.giver.localeCompare(b.giver)
      }
      return a.totalDelay - b.totalDelay
    })
    const result = new BulletListBuilder()
    let currentGiver: string | undefined

    for (const fact of facts) {
      // Check if we have a new permission type
      if (!includeDirectPermissions && fact.permission === 'act') {
        continue
      }
      if (fact.giver !== currentGiver) {
        currentGiver = fact.giver
        result.resetIndent(0)
        result.addItem(`Can interact with @@${fact.giver} to`)
        result.indent()
      }

      if (fact.description === undefined) {
        throw new Error(
          `Missing description for interact permission of fact ${JSON.stringify(fact)}`,
        )
      }
      let value = trimTrailingDots(fact.description)
      if (fact.totalDelay !== 0) {
        value += ` **${formatPermissionDelay(fact.totalDelay).trim()}**`
      }
      if (fact.viaList !== undefined && fact.viaList?.length > 0) {
        value += ` [via: - acting via ${fact.viaList.map(renderTransitivePermissionVia).join(', ')}]`
      }
      result.addItem(value)
    }

    return result.renderMd({ mergeSingleSubpoints: true })
  }

  getUpgradableBy(
    contract: EntryParameters,
  ): { name: string; delay: string }[] {
    const id = this.modelIdRegistry.getModelId(
      this.projectDiscovery.chain,
      contract.address,
    )
    const facts = this.knowledgeBase.getFacts('filteredTransitivePermission', [
      undefined,
      'upgrade',
      id,
    ])
    if (facts.length === 0) {
      return []
    }
    const upgradersWithDelay = facts
      .filter((fact) => fact.params[7] === 'isFinal')
      .map((fact) => {
        const name = this.modelIdRegistry.getAddressData(
          fact.params[0] as string,
        ).name as string
        const totalDelay = fact.params[5] as number
        return {
          name,
          delay: totalDelay === 0 ? 'no' : formatSeconds(totalDelay),
        }
      })
    return upgradersWithDelay
  }
}

function renderTransitivePermissionVia(
  via: ParsedTransitivePermissionVia,
): string {
  if (via.delay === 0) {
    return `@@${via.contract}`
  }
  return `@@${via.contract} ${formatPermissionDelay(via.delay)}`
}
