import { readFileSync } from 'fs'
import { groupBy, mapValues, chain } from 'lodash'
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

    /**
    1. **Group by Contract:**
      ```python
      contract_groups = defaultdict(list)
      for record in permissions:
          contract_groups[record.contract_name].append(record)
      ```

    2. **For Each Contract Group:**
      - Collect all unique total delays
      - For each delay, collect all via paths that lead to it
      ```python
      contract_delays = defaultdict(list)
      for record in contract_group:
          contract_delays[record.total_delay].append(record.via)
      ```

    3. **Create Delay Configuration Groups:**
      Group contracts by their *set* of possible delays (sorted for consistency):
      ```python
      config_groups = defaultdict(list)
      for contract, delays in contract_delays.items():
          # Convert to sorted tuple for hashability
          delay_config = tuple(sorted(delays.keys())) 
          config_groups[delay_config].append({
              'contract': contract,
              'delay_vias': delays
          })
      ```

    **Example Transformation:**

    Given initial records:
    ```
    [
        {contract: "FoochainPortal", delay: "7d", via: "via1"},
        {contract: "FoochainPortal", delay: "0d", via: "via2"},
        {contract: "L1StandardBridge", delay: "7d", via: "via3"},
        {contract: "L1StandardBridge", delay: "0d", via: "via4"},
        {contract: "L1ERC721Bridge", delay: "7d", via: "via5"},
        {contract: "SystemConfig", delay: "0d", via: "via6"}
    ]
    ```

    The algorithm would produce:
    ```python
    {
        # Group 1: Contracts supporting both 7d and 0d delays
        ("0d", "7d"): [
            {
                "contract": "FoochainPortal",
                "delay_vias": {
                    "7d": ["via1"],
                    "0d": ["via2"]
                }
            },
            {
                "contract": "L1StandardBridge",
                "delay_vias": {
                    "7d": ["via3"],
                    "0d": ["via4"]
                }
            }
        ],
        
        # Group 2: Contracts supporting single delay
        ("7d",): [
            {"contract": "L1ERC721Bridge", "delay_vias": {"7d": ["via5"]}}
        ],
        
        ("0d",): [
            {"contract": "SystemConfig", "delay_vias": {"0d": ["via6"]}}
        ]
    }
    ```

    **Key Insights:**
    1. The first grouping level is by contract to collect all its possible delays
    2. The second grouping is by the *set* of delays a contract supports
    3. Via paths are preserved per delay per contract
    4. Delays are sorted to ensure consistent grouping (7d+0d vs 0d+7d)

    This structure allows rendering groups like in your example, showing which contracts share the same set of possible delays while maintaining their individual via paths for each delay option.

     */

    type GroupedRecord = {
      giver: string
      delays: Record<string, ParsedTransitivePermissionFact[]> // delay -> original records
    }
    type Result = Record<string, GroupedRecord[]>

    const result: Result = chain(permissionFacts)
      // 1. Group by contract
      .groupBy('giver')
      // 2. Create contract groups with original records
      .mapValues(
        (records): GroupedRecord => ({
          giver: records[0].giver,
          delays: groupBy(records, 'totalDelay'),
        }),
      )
      // 3. Group by delay configuration
      .values()
      .groupBy((record) => Object.keys(record.delays).sort().join(','))
      // 4. Map to final array format
      .mapValues((group) => group)
      .value()

    return [JSON.stringify(result, null, 2)]
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
