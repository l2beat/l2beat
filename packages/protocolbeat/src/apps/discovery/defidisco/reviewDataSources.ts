import type {
  AdminDetail,
  AdminDetailWithCapital,
  ApiContractTagsResponse,
  ApiFundsDataResponse,
  ApiFunctionsResponse,
  ApiProjectResponse,
  ApiV2ScoreResponse,
  DataColumnFormat,
  DataTableColumn,
} from '../../../api/types'

// ============================================================================
// Types
// ============================================================================

type SectionKey = 'collaterals' | 'dependencies' | 'actors' | 'codeAndAudits'

export interface ImportDataBundle {
  projectData?: ApiProjectResponse
  functionsData?: ApiFunctionsResponse
  fundsData?: ApiFundsDataResponse
  contractTags?: ApiContractTagsResponse
  v2Score?: ApiV2ScoreResponse
}

export interface DataSourceColumn {
  field: string
  header: string
  format?: DataColumnFormat
  /** Included in default column selection */
  defaultSelected: boolean
}

export interface DataSourceFilter {
  id: string
  label: string
  /** Default value per section (true = filter active) */
  defaultBySection?: Partial<Record<SectionKey, boolean>>
  /** Global default if section not specified */
  default: boolean
}

/** Metric fields available for dataMetric blocks */
export interface DataSourceMetric {
  field: string
  label: string
  format: DataColumnFormat
}

export interface DataSourceDefinition {
  id: string
  label: string
  description: string
  /** Which sections this source is relevant for */
  relevantSections: SectionKey[]
  /** Available columns the researcher can pick from */
  availableColumns: DataSourceColumn[]
  /** Available filter toggles */
  availableFilters: DataSourceFilter[]
  /** Available metric fields (for dataMetric blocks) */
  availableMetrics: DataSourceMetric[]
  /** Which API data is required */
  requires: (keyof ImportDataBundle)[]
  /** Transform raw API data into flat items for table rendering */
  getItems: (
    data: ImportDataBundle,
    filters: Record<string, boolean>,
  ) => Record<string, unknown>[]
  /** Get a metric value */
  getMetricValue?: (
    data: ImportDataBundle,
    field: string,
    filters: Record<string, boolean>,
  ) => unknown
}

// ============================================================================
// Helpers
// ============================================================================

function isExternalContract(
  address: string,
  contractTags?: ApiContractTagsResponse,
): boolean {
  if (!contractTags) return false
  const normalized = address.replace(/^eth:/, '').toLowerCase()
  return contractTags.tags.some(
    (t) =>
      t.contractAddress.replace(/^eth:/, '').toLowerCase() === normalized &&
      t.isExternal,
  )
}

function isTokenContract(
  address: string,
  contractTags?: ApiContractTagsResponse,
): boolean {
  if (!contractTags) return false
  const normalized = address.replace(/^eth:/, '').toLowerCase()
  return contractTags.tags.some(
    (t) =>
      t.contractAddress.replace(/^eth:/, '').toLowerCase() === normalized &&
      t.isToken,
  )
}

function hasCapitalData(admin: AdminDetail): admin is AdminDetailWithCapital {
  return 'functionsWithCapital' in admin
}

function shortenAddress(address: string): string {
  const addr = address.replace(/^eth:/, '')
  if (addr.length <= 12) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function formatUsdValue(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
  return `$${value.toFixed(2)}`
}

// ============================================================================
// Data Source: All Contracts
// ============================================================================

const projectContractsSource: DataSourceDefinition = {
  id: 'project.contracts',
  label: 'All Contracts',
  description: 'All discovered contracts in the project',
  relevantSections: ['codeAndAudits'],
  requires: ['projectData'],
  availableColumns: [
    { field: 'name', header: 'Name', defaultSelected: true },
    {
      field: 'address',
      header: 'Address',
      format: 'address',
      defaultSelected: true,
    },
    { field: 'type', header: 'Type', defaultSelected: false },
    {
      field: 'proxyType',
      header: 'Proxy Type',
      format: 'badge',
      defaultSelected: true,
    },
  ],
  availableFilters: [
    { id: 'excludeExternal', label: 'Exclude external', default: false },
  ],
  availableMetrics: [
    { field: 'count', label: 'Total Contracts', format: 'number' },
  ],
  getItems(data, filters) {
    const entry = data.projectData?.entries?.[0]
    if (!entry) return []
    const all = [...entry.initialContracts, ...entry.discoveredContracts]
    return all
      .filter((c) => {
        if (
          filters.excludeExternal &&
          isExternalContract(c.address, data.contractTags)
        )
          return false
        return true
      })
      .map((c) => ({
        name: c.name ?? shortenAddress(c.address),
        address: c.address,
        type: c.type,
        proxyType: c.proxyType ?? 'Immutable',
      }))
  },
  getMetricValue(data, field, filters) {
    if (field === 'count') return this.getItems(data, filters).length
    return undefined
  },
}

// ============================================================================
// Data Source: Protocol Actors (Admins/Owners)
// ============================================================================

const v2ScoreAdminsSource: DataSourceDefinition = {
  id: 'v2score.admins',
  label: 'Protocol Actors',
  description: 'Admin and owner addresses from V2 scoring',
  relevantSections: ['actors'],
  requires: ['v2Score'],
  availableColumns: [
    { field: 'adminName', header: 'Name', defaultSelected: true },
    {
      field: 'adminAddress',
      header: 'Address',
      format: 'address',
      defaultSelected: true,
    },
    {
      field: 'adminType',
      header: 'Type',
      format: 'badge',
      defaultSelected: true,
    },
    {
      field: 'likelihood',
      header: 'Likelihood',
      format: 'badge',
      defaultSelected: false,
    },
    {
      field: 'functionsCount',
      header: 'Functions',
      format: 'number',
      defaultSelected: true,
    },
    {
      field: 'totalDirectCapital',
      header: 'Capital at Risk',
      format: 'usd',
      defaultSelected: true,
    },
  ],
  availableFilters: [
    { id: 'excludeExternal', label: 'Exclude external', default: true },
    { id: 'excludeImmutable', label: 'Exclude immutable (0x0)', default: true },
  ],
  availableMetrics: [
    { field: 'count', label: 'Total Actors', format: 'number' },
    {
      field: 'totalCapitalAtRisk',
      label: 'Total Capital at Risk',
      format: 'usd',
    },
  ],
  getItems(data, filters) {
    const breakdown = data.v2Score?.inventory?.admins?.breakdown
    if (!breakdown) return []

    return breakdown
      .filter((admin) => {
        if (
          filters.excludeExternal &&
          isExternalContract(admin.adminAddress, data.contractTags)
        )
          return false
        if (
          filters.excludeImmutable &&
          admin.adminAddress.includes(
            '0x0000000000000000000000000000000000000000',
          )
        )
          return false
        return true
      })
      .map((admin) => ({
        adminName: admin.adminName,
        adminAddress: admin.adminAddress,
        adminType: admin.adminType,
        likelihood: admin.likelihood ?? 'unscored',
        functionsCount: admin.functions.length,
        totalDirectCapital: hasCapitalData(admin)
          ? admin.totalDirectCapital
          : 0,
      }))
  },
  getMetricValue(data, field, filters) {
    const items = this.getItems(data, filters)
    if (field === 'count') return items.length
    if (field === 'totalCapitalAtRisk') {
      return data.v2Score?.inventory?.admins?.totalCapitalAtRisk ?? 0
    }
    return undefined
  },
}

// ============================================================================
// Data Source: Dependencies
// ============================================================================

const v2ScoreDependenciesSource: DataSourceDefinition = {
  id: 'v2score.dependencies',
  label: 'Dependencies',
  description: 'External dependencies from V2 scoring',
  relevantSections: ['dependencies'],
  requires: ['v2Score'],
  availableColumns: [
    { field: 'dependencyName', header: 'Name', defaultSelected: true },
    {
      field: 'dependencyAddress',
      header: 'Address',
      format: 'address',
      defaultSelected: true,
    },
    {
      field: 'likelihood',
      header: 'Likelihood',
      format: 'badge',
      defaultSelected: true,
    },
    {
      field: 'functionsCount',
      header: 'Functions Affected',
      format: 'number',
      defaultSelected: true,
    },
  ],
  availableFilters: [],
  availableMetrics: [
    { field: 'count', label: 'Total Dependencies', format: 'number' },
  ],
  getItems(data) {
    const breakdown = data.v2Score?.inventory?.dependencies?.breakdown
    if (!breakdown) return []

    return breakdown.map((dep) => ({
      dependencyName: dep.dependencyName,
      dependencyAddress: dep.dependencyAddress,
      likelihood: dep.likelihood ?? 'unscored',
      functionsCount: dep.functions.length,
    }))
  },
  getMetricValue(data, field) {
    if (field === 'count') return this.getItems(data, {}).length
    return undefined
  },
}

// ============================================================================
// Data Source: Contract Balances (Funds)
// ============================================================================

const fundsContractBalancesSource: DataSourceDefinition = {
  id: 'funds.contractBalances',
  label: 'Contract Balances',
  description: 'Token balances and DeFi positions per contract',
  relevantSections: ['collaterals'],
  requires: ['fundsData'],
  availableColumns: [
    { field: 'contractName', header: 'Contract', defaultSelected: true },
    {
      field: 'address',
      header: 'Address',
      format: 'address',
      defaultSelected: true,
    },
    {
      field: 'balancesTotal',
      header: 'Token Balance',
      format: 'usd',
      defaultSelected: true,
    },
    {
      field: 'positionsTotal',
      header: 'DeFi Positions',
      format: 'usd',
      defaultSelected: true,
    },
  ],
  availableFilters: [
    {
      id: 'excludeExternal',
      label: 'Exclude external',
      default: true,
      defaultBySection: { collaterals: true },
    },
    {
      id: 'excludeTokens',
      label: 'Exclude protocol tokens',
      default: true,
      defaultBySection: { collaterals: true },
    },
  ],
  availableMetrics: [
    { field: 'totalBalances', label: 'Total Token Balances', format: 'usd' },
    { field: 'totalPositions', label: 'Total DeFi Positions', format: 'usd' },
    { field: 'count', label: 'Contracts with Funds', format: 'number' },
  ],
  getItems(data, filters) {
    const contracts = data.fundsData?.contracts
    if (!contracts) return []

    const contractNameMap = buildContractNameMap(data.projectData)

    return Object.entries(contracts)
      .filter(([addr, cfd]) => {
        if (!cfd.balances && !cfd.positions) return false
        if (
          filters.excludeExternal &&
          isExternalContract(addr, data.contractTags)
        )
          return false
        if (filters.excludeTokens && isTokenContract(addr, data.contractTags))
          return false
        return true
      })
      .map(([addr, cfd]) => ({
        contractName:
          contractNameMap.get(addr.toLowerCase()) ?? shortenAddress(addr),
        address: addr,
        balancesTotal: cfd.balances?.totalUsdValue ?? 0,
        positionsTotal: cfd.positions?.totalUsdValue ?? 0,
      }))
  },
  getMetricValue(data, field, filters) {
    const items = this.getItems(data, filters)
    if (field === 'count') return items.length
    if (field === 'totalBalances') {
      return items.reduce(
        (sum, item) => sum + (item.balancesTotal as number),
        0,
      )
    }
    if (field === 'totalPositions') {
      return items.reduce(
        (sum, item) => sum + (item.positionsTotal as number),
        0,
      )
    }
    return undefined
  },
}

// ============================================================================
// Data Source: Permissioned Functions
// ============================================================================

const permissionedFunctionsSource: DataSourceDefinition = {
  id: 'functions.permissioned',
  label: 'Permissioned Functions',
  description: 'Functions marked as permissioned across all contracts',
  relevantSections: ['actors', 'codeAndAudits'],
  requires: ['functionsData'],
  availableColumns: [
    { field: 'contractName', header: 'Contract', defaultSelected: true },
    {
      field: 'contractAddress',
      header: 'Contract Address',
      format: 'address',
      defaultSelected: false,
    },
    { field: 'functionName', header: 'Function', defaultSelected: true },
    {
      field: 'score',
      header: 'Impact',
      format: 'badge',
      defaultSelected: true,
    },
    { field: 'ownerPaths', header: 'Owners', defaultSelected: false },
  ],
  availableFilters: [
    {
      id: 'excludeExternal',
      label: 'Exclude external contracts',
      default: false,
    },
    { id: 'onlyChecked', label: 'Only reviewed functions', default: false },
  ],
  availableMetrics: [
    { field: 'count', label: 'Total Permissioned Functions', format: 'number' },
  ],
  getItems(data, filters) {
    const contracts = data.functionsData?.contracts
    if (!contracts) return []

    const contractNameMap = buildContractNameMap(data.projectData)
    const items: Record<string, unknown>[] = []

    for (const [addr, contractFuncs] of Object.entries(contracts)) {
      if (
        filters.excludeExternal &&
        isExternalContract(addr, data.contractTags)
      )
        continue

      for (const func of contractFuncs.functions) {
        if (!func.isPermissioned) continue
        if (filters.onlyChecked && !func.checked) continue

        items.push({
          contractName:
            contractNameMap.get(addr.toLowerCase()) ?? shortenAddress(addr),
          contractAddress: addr,
          functionName: func.functionName,
          score: func.score ?? 'unscored',
          ownerPaths: (func.ownerDefinitions ?? [])
            .map((od) => od.path)
            .join(', '),
        })
      }
    }

    return items
  },
  getMetricValue(data, field, filters) {
    if (field === 'count') return this.getItems(data, filters).length
    return undefined
  },
}

// ============================================================================
// Helpers
// ============================================================================

function buildContractNameMap(
  projectData?: ApiProjectResponse,
): Map<string, string> {
  const map = new Map<string, string>()
  const entry = projectData?.entries?.[0]
  if (!entry) return map
  for (const c of [...entry.initialContracts, ...entry.discoveredContracts]) {
    if (c.name) {
      map.set(c.address.toLowerCase(), c.name)
    }
  }
  return map
}

// ============================================================================
// Registry
// ============================================================================

export const DATA_SOURCES: DataSourceDefinition[] = [
  projectContractsSource,
  v2ScoreAdminsSource,
  v2ScoreDependenciesSource,
  fundsContractBalancesSource,
  permissionedFunctionsSource,
]

/** Look up a data source by ID */
export function getDataSource(id: string): DataSourceDefinition | undefined {
  return DATA_SOURCES.find((ds) => ds.id === id)
}

/** Get data sources relevant to a specific section */
export function getDataSourcesForSection(
  sectionKey: SectionKey,
): DataSourceDefinition[] {
  return DATA_SOURCES.filter((ds) => ds.relevantSections.includes(sectionKey))
}

/** Check if a data source has its required data available */
export function isDataSourceAvailable(
  source: DataSourceDefinition,
  data: ImportDataBundle,
): boolean {
  return source.requires.every((key) => data[key] !== undefined)
}

/** Get default columns for a data source */
export function getDefaultColumns(
  source: DataSourceDefinition,
): DataTableColumn[] {
  return source.availableColumns
    .filter((col) => col.defaultSelected)
    .map(({ field, header, format }) => ({ field, header, format }))
}

/** Get default filters for a data source and section */
export function getDefaultFilters(
  source: DataSourceDefinition,
  sectionKey: SectionKey,
): Record<string, boolean> {
  const filters: Record<string, boolean> = {}
  for (const f of source.availableFilters) {
    filters[f.id] = f.defaultBySection?.[sectionKey] ?? f.default
  }
  return filters
}

/** Resolve a field value from an item using dot notation */
export function resolveFieldValue(
  item: Record<string, unknown>,
  field: string,
): unknown {
  const parts = field.split('.')
  let current: unknown = item
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return current
}

/** Format a value according to column format */
export function formatColumnValue(
  value: unknown,
  format?: DataColumnFormat,
): string {
  if (value == null) return '-'

  switch (format) {
    case 'usd':
      return typeof value === 'number' ? formatUsdValue(value) : String(value)
    case 'address': {
      const addr = String(value)
      return shortenAddress(addr)
    }
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value)
    case 'percent':
      return typeof value === 'number'
        ? `${(value * 100).toFixed(1)}%`
        : String(value)
    default:
      return String(value)
  }
}
