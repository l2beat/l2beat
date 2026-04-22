import type { CompiledReview } from '../types'
import { formatUsdValue, stripChainPrefix } from './format'
import { getKeyFindings, type KeyFinding } from './keyFindings'

const HUMAN_ADMIN_TYPES = new Set([
  'EOA',
  'EOAPermissioned',
  'Multisig',
  'Timelock',
])

function findingIcon(type: KeyFinding['type']): string {
  switch (type) {
    case 'positive':
      return '+'
    case 'warning':
      return '!'
    case 'critical':
      return '!!'
    case 'info':
      return 'i'
  }
}

export function reviewToMarkdown(review: CompiledReview): string {
  const lines: string[] = []
  const { metadata, totals, admins, dependencies, funds } = review

  // Header
  lines.push(`# DeFiScan Decentralization Review: ${metadata.protocolName}`)
  lines.push('')
  lines.push(`**Chain:** ${metadata.chain}`)
  if (metadata.tokenName) {
    lines.push(`**Token:** ${metadata.tokenName}`)
  }
  lines.push(`**Type:** ${metadata.projectType}`)
  lines.push('')

  // Summary
  if (metadata.description) {
    lines.push('## Summary')
    lines.push('')
    lines.push(metadata.description)
    lines.push('')
  }

  // Key Findings
  const findings = getKeyFindings(review)
  if (findings.length > 0) {
    lines.push('## Key Findings')
    lines.push('')
    for (const f of findings) {
      lines.push(`- **[${findingIcon(f.type)}] ${f.title}:** ${f.detail}`)
    }
    lines.push('')
  }

  // Funds
  lines.push('## What Is at Stake?')
  lines.push('')
  if (funds.length === 0) {
    lines.push('No TVL data is currently available for this protocol.')
  } else {
    const totalFunds = funds.reduce(
      (sum, f) =>
        sum +
        (f.balances?.totalUsdValue ?? 0) +
        (f.positions?.totalUsdValue ?? 0),
      0,
    )
    lines.push(
      `The protocol holds **${formatUsdValue(totalFunds)}** across ${funds.length} contract${funds.length !== 1 ? 's' : ''}.`,
    )
    lines.push('')
    lines.push('| Contract | Address | TVL |')
    lines.push('|----------|---------|-----|')
    for (const f of funds) {
      const value =
        (f.balances?.totalUsdValue ?? 0) + (f.positions?.totalUsdValue ?? 0)
      if (value > 0) {
        lines.push(
          `| ${f.name} | \`${stripChainPrefix(f.address)}\` | ${formatUsdValue(value)} |`,
        )
      }
    }

    // Protocol tokens
    const tokenFunds = funds.filter(
      (f) => f.tokenInfo && f.tokenInfo.tokenValue > 0,
    )
    if (tokenFunds.length > 0) {
      const totalTokenValue = tokenFunds.reduce(
        (sum, f) => sum + (f.tokenInfo?.tokenValue ?? 0),
        0,
      )
      const tokenNames = [
        ...new Set(tokenFunds.map((f) => f.tokenInfo?.symbol).filter(Boolean)),
      ]
      lines.push('')
      lines.push(
        `The protocol${tokenNames.length === 1 ? "'s native token" : ' issues'} ${tokenNames.join(', ')} ${tokenNames.length === 1 ? 'has' : 'have'} a combined market cap of **${formatUsdValue(totalTokenValue)}**.`,
      )
      lines.push('')
      lines.push('| Token | Contract | Market Cap |')
      lines.push('|-------|----------|------------|')
      for (const f of tokenFunds) {
        const ti = f.tokenInfo
        if (!ti) continue
        lines.push(
          `| ${ti.symbol} | ${f.name} (\`${stripChainPrefix(f.address)}\`) | ${formatUsdValue(ti.tokenValue)} |`,
        )
      }
    }
  }
  lines.push('')

  // Admins — filter to match UI: only show human-controlled and governance admins
  const visibleAdmins = admins.filter(
    (a) => HUMAN_ADMIN_TYPES.has(a.adminType) || a.isGovernance,
  )

  lines.push('## Who Is in Control?')
  lines.push('')
  if (visibleAdmins.length === 0) {
    lines.push(
      'All admin controls resolve to immutable contracts or revoked addresses. No permissioned functions can affect user funds.',
    )
  } else {
    const fnCount = visibleAdmins.reduce(
      (sum, a) => sum + a.functions.length,
      0,
    )
    lines.push(
      `${visibleAdmins.length} admin${visibleAdmins.length !== 1 ? 's' : ''} control ${fnCount} permissioned function${fnCount !== 1 ? 's' : ''}.`,
    )
    lines.push('')
    for (const admin of visibleAdmins) {
      lines.push(`### ${admin.name}`)
      lines.push('')
      lines.push(`- **Type:** ${admin.adminType}`)
      lines.push(`- **Address:** \`${stripChainPrefix(admin.address)}\``)
      if (admin.isGovernance) {
        lines.push('- **Governance:** Yes')
      }
      if (admin.totalReachableCapital > 0) {
        lines.push(
          `- **TVL at risk:** ${formatUsdValue(admin.totalReachableCapital)}`,
        )
      }
      if (admin.description) {
        lines.push(`- ${admin.description}`)
      }
      if (admin.functions.length > 0) {
        lines.push('')
        lines.push('**Permissioned functions:**')
        for (const fn of admin.functions) {
          const fundsStr =
            fn.directFundsUsd > 0
              ? ` (${formatUsdValue(fn.directFundsUsd)} at risk)`
              : ''
          lines.push(`- \`${fn.contractName}.${fn.functionName}()\`${fundsStr}`)
        }
      }
      lines.push('')
    }
  }

  // Dependencies
  lines.push('## What Does It Depend On?')
  lines.push('')
  if (dependencies.length === 0) {
    lines.push(
      'No external dependencies detected. This protocol operates entirely through its own on-chain logic.',
    )
  } else {
    const entities = [
      ...new Set(dependencies.map((d) => d.entity).filter(Boolean)),
    ]
    lines.push(
      `The protocol depends on **${dependencies.length} external contract${dependencies.length !== 1 ? 's' : ''}**${entities.length > 0 ? ` from ${entities.join(', ')}` : ''}.`,
    )
    lines.push('')
    lines.push('| Dependency | Entity | Address | Funds at Risk | Type |')
    lines.push('|------------|--------|---------|---------------|------|')
    for (const dep of dependencies) {
      const typeLabel = dep.viewOnlyPath ? 'Read-only' : 'Write'
      lines.push(
        `| ${dep.name} | ${dep.entity ?? '-'} | \`${stripChainPrefix(dep.address)}\` | ${formatUsdValue(dep.totalFundsAtRisk + (dep.totalTokenValueAtRisk ?? 0))} | ${typeLabel} |`,
      )
    }
  }
  lines.push('')

  // Totals summary
  lines.push('## Summary Statistics')
  lines.push('')
  lines.push(`| Metric | Value |`)
  lines.push(`|--------|-------|`)
  lines.push(`| Contracts | ${totals.contractCount} |`)
  lines.push(
    `| Permissioned Functions | ${visibleAdmins.reduce((sum, a) => sum + a.functions.length, 0)} |`,
  )
  lines.push(`| Admins | ${visibleAdmins.length} |`)
  lines.push(`| External Dependencies | ${totals.dependencyCount} |`)
  lines.push(
    `| Total Capital at Risk | ${formatUsdValue(totals.totalCapitalAtRisk)} |`,
  )
  if (totals.totalTokenValue > 0) {
    lines.push(
      `| Total Token Value | ${formatUsdValue(totals.totalTokenValue)} |`,
    )
  }
  lines.push('')

  // Resources
  if (review.resources && review.resources.length > 0) {
    lines.push('## Resources')
    lines.push('')
    for (const r of review.resources) {
      const label = r.label ?? r.type
      lines.push(`- [${label}](${r.url})`)
    }
    lines.push('')
  }

  lines.push('---')
  lines.push(
    `*Generated by DeFiScan on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*`,
  )
  lines.push('')

  return lines.join('\n')
}
