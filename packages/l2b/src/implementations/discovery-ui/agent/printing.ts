import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { CodeExcerpt } from './codeExcerpt'
import type { ProjectEntry } from './entries'
import type { CodeMatch } from './findCodeAnchor'
import {
  formatDelay,
  type PermissionHolder,
  type PermissionPath,
  signerTree,
} from './permissionPaths'
import type { AgentContext, AgentReceipt } from './router'
import type { AgentStep } from './steps'
import type { SelectorMatch } from './views'

const DESCRIPTIONS_MAX = 3
const NAMES_MAX = 12

export function printStep(
  lines: string[],
  index: number,
  count: number,
  step: AgentStep,
  excerpt: CodeExcerpt | undefined,
  names: Record<string, string>,
) {
  const name = (address: string) => names[address] ?? address
  if (count > 1) lines.push(`step ${index + 1}/${count}`)
  for (const path of step.paths) {
    lines.push(`  path   ${path.map(name).join(' → ')}`)
  }
  for (const node of step.nodes) lines.push(`  node   ${name(node)}`)
  if (step.code) {
    const { sourceName, others } = step.code
    lines.push(
      `  code   ${name(step.code.address)} ${sourceName}:${place(step.code)}`,
    )
    if (others.length > 0) {
      const where = (match: CodeMatch) =>
        match.sourceName === sourceName
          ? place(match)
          : `${match.sourceName}:${place(match)}`
      lines.push(`         also at ${others.map(where).join(', ')}`)
    }
  }
  if (excerpt) printExcerpt(lines, excerpt)
}

function printExcerpt(lines: string[], excerpt: CodeExcerpt) {
  const width = String(excerpt.line + excerpt.lines.length).length
  for (const [i, text] of excerpt.lines.entries()) {
    lines.push(`  ${String(excerpt.line + i).padStart(width)} | ${text}`)
  }
  if (excerpt.isCut) {
    lines.push('  … cut here, read the rest in the .flat source')
  }
}

function place(match: CodeMatch): string {
  return match.contract === undefined
    ? `${match.line}`
    : `${match.line} in ${match.contract}`
}

export function printPermissionPath(
  lines: string[],
  p: PermissionPath,
  byAddress: ReadonlyMap<ChainSpecificAddress, PermissionHolder>,
  name: (address: ChainSpecificAddress) => string,
) {
  const role = p.role ? ` ${p.role}` : ''
  lines.push(`\n[${p.permission}${role}] ${formatDelay(p.delaySeconds)}`)
  lines.push(`  ${p.path.map(name).join(' → ')}`)
  for (const condition of p.conditions) lines.push(`  if ${condition}`)
  for (const description of p.descriptions.slice(0, DESCRIPTIONS_MAX)) {
    lines.push(`  · ${description}`)
  }
  const more = p.descriptions.length - DESCRIPTIONS_MAX
  if (more > 0) lines.push(`  · and ${more} more`)
  for (const line of signerTree(p.path[0] as ChainSpecificAddress, byAddress)) {
    lines.push(`  ${line}`)
  }
  lines.push(`  path ${p.path.join(',')}`)
}

export function printViewResult(
  lines: string[],
  spec: { title: string; dryRun?: boolean },
  result: {
    tabs: number
    outdatedTabs: number
    matches: SelectorMatch[]
    receipt?: AgentReceipt
  },
  entries: readonly ProjectEntry[],
) {
  const names = nameLookup(entries)
  for (const { selector, count, known } of result.matches) {
    // An address names exactly one contract; only misses are news.
    if (ChainSpecificAddress.tryParse(selector) !== undefined && count === 1) {
      continue
    }
    const found = count === 0 ? 'matched nothing' : plural(count, 'contract')
    const hint =
      count === 0 && selector.includes(',')
        ? '; for several selectors repeat the flag, one selector each'
        : known && known.length > 0
          ? `; values here: ${known.join(', ')}`
          : ''
    lines.push(`  ${selector}  ${found}${hint}`)
  }
  warnOutdated(lines, result.outdatedTabs)
  const receipt = result.receipt
  if (result.tabs === 0 || receipt === undefined) {
    lines.push(
      result.tabs === 0
        ? 'No DiscoUI tab can show views, nothing was applied.'
        : 'The tab did not confirm the view in time; check `ui-agent state`.',
    )
    return
  }
  if (receipt.unavailable === true) {
    lines.push(
      "The tab doesn't show this project's graph, so nothing could be previewed: ask the researcher to open it, or apply it without a dry run to open it for them.",
    )
    return
  }
  lines.push(
    spec.dryRun
      ? `Dry run of "${spec.title}", nothing changed:`
      : `Applied "${spec.title}" in ${tabsLabel(result.tabs)}`,
  )
  const sections: [string, string[]][] = [
    ['also hidden, only reachable through what you hid', receipt.cascaded],
    ['kept visible to connect what you asked for', receipt.connectors],
    [
      "can't be hidden (initial, or nothing references them), set aside in a closed group",
      receipt.notHideable,
    ],
    ['not in the graph', receipt.missing],
  ]
  for (const [label, addresses] of sections) {
    if (addresses.length > 0) {
      lines.push(`  ${label}: ${listNames(addresses, names)}`)
    }
  }
  lines.push(`  ${receipt.visible} of ${receipt.total} contracts visible`)
  if (!spec.dryRun) {
    lines.push(
      'The researcher sees it as a pending view and decides: Keep, Save as layout or Discard.',
    )
  }
}

export function warnOutdated(lines: string[], outdatedTabs: number) {
  if (outdatedTabs > 0) {
    lines.push(
      `${outdatedTabs === 1 ? '1 tab runs' : `${outdatedTabs} tabs run`} an older DiscoUI that ignores views: ask the researcher to reload.`,
    )
  }
}

export function printState(lines: string[], context: AgentContext) {
  const graph = context.graph
  if (graph === undefined) {
    lines.push('The open tab shows no graph')
    return
  }
  const visible = graph.contracts.filter((c) => !c.hidden)
  lines.push(
    `${context.project}: ${visible.length} of ${graph.contracts.length} contracts visible`,
  )
  if (graph.pendingView !== undefined) {
    const { title, changes } = graph.pendingView
    lines.push(`pending agent view "${title}", ${plural(changes, 'change')}`)
  }
  const byGroup = new Map<string, string[]>()
  for (const contract of visible) {
    const key = contract.group ?? ''
    byGroup.set(key, [...(byGroup.get(key) ?? []), contract.name])
  }
  for (const [group, members] of byGroup) {
    const label = group === '' ? 'not grouped' : `group "${group}"`
    lines.push(`\n${label} (${members.length}): ${members.join(', ')}`)
  }
  const hidden = graph.contracts.filter((c) => c.hidden).map((c) => c.name)
  if (hidden.length > 0) {
    lines.push(`\nhidden (${hidden.length}): ${hidden.join(', ')}`)
  }
}

// The context without the per-contract listing, which `state` prints.
export function contextSummary(context: AgentContext & { tabs: number }) {
  const { graph, ...rest } = context
  if (graph === undefined) {
    return rest
  }
  return {
    ...rest,
    graph: {
      contracts: graph.contracts.length,
      visible: graph.contracts.filter((c) => !c.hidden).length,
      groups: [...new Set(graph.contracts.flatMap((c) => c.group ?? []))],
      pendingView: graph.pendingView,
    },
  }
}

export function nameLookup(entries: readonly ProjectEntry[]) {
  const byAddress = new Map<string, string>(
    entries.map((e) => [e.address, e.name ?? e.address]),
  )
  return (address: string) => byAddress.get(address) ?? address
}

function listNames(addresses: string[], name: (a: string) => string): string {
  const shown = addresses.slice(0, NAMES_MAX).map(name).join(', ')
  const more = addresses.length - NAMES_MAX
  return more > 0 ? `${shown} and ${more} more` : shown
}

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

export function tabsLabel(tabs: number): string {
  return `${tabs} ${tabs === 1 ? 'tab' : 'tabs'}`
}
