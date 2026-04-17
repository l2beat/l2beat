import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


// Minimal subset of CompiledReview (from src/types.ts) — only fields needed for index aggregation.
// Keep in sync with the full type when adding new aggregated fields.
interface CompiledReview {
  metadata: {
    protocolName: string
    protocolSlug: string
    chain: string
    projectType: string
    tokenName: string
  }
  totals: {
    contractCount: number
    permissionedFunctionCount: number
    scoredFunctionCount: number
    adminCount: number
    dependencyCount: number
    totalCapitalAtRisk: number
    totalTokenValueAtRisk: number
    totalTokenValue?: number
  }
  admins: {
    address: string
    adminType: string
    isGovernance: boolean
    totalDirectCapital: number
    functions: { contractAddress: string }[]
  }[]
  dependencies: {
    address: string
    name: string
    entity: string | null
    totalFundsAtRisk: number
    functions: { contractAddress: string; contractName: string; functionName: string }[]
  }[]
  funds: {
    address: string
    name: string
    description: string
    balances: { totalUsdValue: number } | null
    positions: { totalUsdValue: number } | null
    tokenInfo: {
      symbol: string
      price: number
      totalSupply: string
      tokenValue: number
    } | null
    aggregate?: {
      totalUsdValue: number
      contractCount: number
      handlerName: string
      label?: string
    } | null
  }[]
  activity?: ActivityEvent[]
}

interface ActivityEvent {
  timestamp: string
}

interface FundsData {
  contracts: Record<string, {
    balances?: { totalUsdValue: number }
    positions?: { totalUsdValue: number }
    tokenInfo?: {
      symbol: string
      price: number
      totalSupply: string
      tokenValue: number
    }
    aggregate?: {
      totalUsdValue: number
      contractCount: number
      handlerName: string
    }
  }>
}

const DATA_DIR = join(__dirname, '..', 'public', 'data')

function main() {
  mkdirSync(DATA_DIR, { recursive: true })

  // Discover projects by scanning public/data/ for subdirs containing compiled-review.json
  const slugs = readdirSync(DATA_DIR).filter((name) => {
    const dir = join(DATA_DIR, name)
    return statSync(dir).isDirectory() && existsSync(join(dir, 'compiled-review.json'))
  })

  if (slugs.length === 0) {
    console.log('No compiled reviews found in public/data/. index.json will be empty.')
  }

  const protocols: Array<{
    slug: string
    name: string
    chain: string
    projectType: string
    tokenName: string
    totals: CompiledReview['totals']
  }> = []

  // Dependency aggregation: address → { name, entity, totalFundsAtRisk, protocols }
  const depMap = new Map<
    string,
    {
      name: string
      entity: string | null
      totalFundsAtRisk: number
      protocols: { slug: string; name: string }[]
    }
  >()

  let totalCapitalAtRisk = 0
  let totalTokenValueAtRisk = 0
  let totalTokenValue = 0
  let totalContractCount = 0

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  let recentUpdateCount = 0

  const HUMAN_ADMIN_TYPES = new Set(['EOA', 'EOAPermissioned', 'Multisig', 'Timelock'])

  for (const slug of slugs) {
    const reviewPath = join(DATA_DIR, slug, 'compiled-review.json')
    const review: CompiledReview = JSON.parse(readFileSync(reviewPath, 'utf8'))

    console.log(`  Processing ${slug}`)

    // Patch funds data from funds-data.json if available (co-located next to compiled-review.json)
    const fundsDataPath = join(DATA_DIR, slug, 'funds-data.json')
    if (existsSync(fundsDataPath) && review.funds) {
      const fundsData: FundsData = JSON.parse(readFileSync(fundsDataPath, 'utf8'))
      // Build lookup from funds-data.json (addresses already normalized in compiled review)
      const fundsLookup = new Map<string, FundsData['contracts'][string]>()
      for (const [addr, data] of Object.entries(fundsData.contracts ?? {})) {
        fundsLookup.set(addr, data)
      }
      let patched = 0
      for (const fund of review.funds) {
        const contractFunds = fundsLookup.get(fund.address)
        if (!contractFunds) continue
        if (contractFunds.balances) {
          fund.balances = { totalUsdValue: contractFunds.balances.totalUsdValue }
        }
        if (contractFunds.positions) {
          fund.positions = { totalUsdValue: contractFunds.positions.totalUsdValue }
        }
        if (contractFunds.tokenInfo) {
          fund.tokenInfo = {
            symbol: contractFunds.tokenInfo.symbol,
            price: contractFunds.tokenInfo.price,
            totalSupply: contractFunds.tokenInfo.totalSupply,
            tokenValue: contractFunds.tokenInfo.tokenValue,
          }
        }
        if (contractFunds.aggregate) {
          fund.aggregate = {
            totalUsdValue: contractFunds.aggregate.totalUsdValue,
            contractCount: contractFunds.aggregate.contractCount,
            handlerName: contractFunds.aggregate.handlerName,
            label: fund.aggregate?.label,
          }
        }
        patched++
      }
      if (patched > 0) {
        console.log(`    Patched ${patched} fund(s) from funds-data.json`)
      }
    }

    // Compute entity-grouped dependency count
    const depEntities = new Set<string>()
    let ungroupedDeps = 0
    for (const dep of review.dependencies) {
      if (dep.entity) depEntities.add(dep.entity)
      else ungroupedDeps++
    }

    // Count admins excluding Immutable and Revoked
    const activeAdminCount = review.admins.filter(
      (a) => a.adminType !== 'Immutable' && a.adminType !== 'Revoked',
    ).length

    // Compute totalTokenValue from funds array (handles old compiled reviews missing this field)
    const computedTokenValue = review.funds
      ? review.funds.reduce((sum, f) => sum + (f.tokenInfo?.tokenValue ?? 0), 0)
      : 0
    const totalTokenValueForProtocol =
      computedTokenValue > 0
        ? computedTokenValue
        : (review.totals.totalTokenValue ?? 0)

    // totalCapitalAtRisk in compiled review already includes aggregate funds
    protocols.push({
      slug: review.metadata.protocolSlug,
      name: review.metadata.protocolName,
      chain: review.metadata.chain,
      projectType: review.metadata.projectType,
      tokenName: review.metadata.tokenName,
      totals: {
        ...review.totals,
        totalTokenValue: totalTokenValueForProtocol,
        adminCount: activeAdminCount,
        dependencyCount: depEntities.size + ungroupedDeps,
      },
    })

    totalCapitalAtRisk += review.totals.totalCapitalAtRisk
    totalContractCount += review.totals.contractCount

    // Count activity events from the last 7 days
    if (review.activity) {
      for (const event of review.activity) {
        if (event.timestamp >= sevenDaysAgo) {
          recentUpdateCount++
        }
      }
    }

    const protocolTokenValue = totalTokenValueForProtocol > 0
      ? totalTokenValueForProtocol
      : (review.totals.totalTokenValueAtRisk ?? 0)
    totalTokenValue += protocolTokenValue

    // Only count token value as "at risk" if the protocol has human-controlled admins
    const hasHumanAdmin = review.admins.some(
      (a) => HUMAN_ADMIN_TYPES.has(a.adminType) || a.isGovernance,
    )
    if (hasHumanAdmin) {
      totalTokenValueAtRisk += protocolTokenValue
    }

    // Aggregate dependencies across protocols using pre-computed funds
    for (const dep of review.dependencies) {
      const key = dep.address
      const existing = depMap.get(key)
      if (existing) {
        existing.protocols.push({ slug, name: review.metadata.protocolName })
        existing.totalFundsAtRisk += dep.totalFundsAtRisk
      } else {
        depMap.set(key, {
          name: dep.name,
          entity: dep.entity,
          totalFundsAtRisk: dep.totalFundsAtRisk,
          protocols: [{ slug, name: review.metadata.protocolName }],
        })
      }
    }
  }

  // Build dependencies list sorted by funds at risk
  const dependencies = Array.from(depMap.entries())
    .map(([address, data]) => ({
      address,
      name: data.name,
      entity: data.entity,
      totalFundsAtRisk: data.totalFundsAtRisk,
      protocols: data.protocols,
    }))
    .sort((a, b) => b.totalFundsAtRisk - a.totalFundsAtRisk)

  // Write index.json
  const index = {
    totalDefiTvl: 100_000_000_000, // Manually maintained — update periodically
    protocols,
    globalTotals: {
      totalCapitalAtRisk,
      totalTokenValueAtRisk,
      totalTokenValue,
      protocolsReviewed: protocols.length,
      totalContractCount,
      recentUpdateCount,
    },
    dependencies,
  }

  writeFileSync(join(DATA_DIR, 'index.json'), JSON.stringify(index, null, 2))

  console.log(`\nCompiled ${protocols.length} protocols → public/data/index.json`)
  console.log(`Dependencies: ${dependencies.length}`)
}

main()
