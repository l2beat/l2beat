import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { utils } from 'ethers'

import type { ContractValue } from '../../output/types'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'

export type ManyChainMultiSigHandlerDefinition = v.infer<
  typeof ManyChainMultiSigHandlerDefinition
>
export const ManyChainMultiSigHandlerDefinition = v.strictObject({
  type: v.literal('manyChainMultiSig'),
  ignoreRelative: v.boolean().optional(),
})

const GET_CONFIG_FRAGMENT = utils.FunctionFragment.from(
  'getConfig() view returns (tuple(tuple(address addr, uint8 index, uint8 group)[] signers, uint8[32] groupQuorums, uint8[32] groupParents))',
)

interface SignerRow {
  addr: string
  index: number
  group: number
}

interface GroupNode {
  id: number
  quorum: number
  parent: number
  members: string[]
  childGroups: number[]
}

export class ManyChainMultiSigHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: ManyChainMultiSigHandlerDefinition,
  ) {}

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const config = await provider.callMethod<{
      signers: { addr: string; index: number; group: number }[]
      groupQuorums: number[]
      groupParents: number[]
    }>(address, GET_CONFIG_FRAGMENT, [])

    if (config === undefined) {
      return { field: this.field, error: 'getConfig() reverted' }
    }

    const signers: SignerRow[] = config.signers.map((s) => ({
      addr: s.addr,
      index: Number(s.index),
      group: Number(s.group),
    }))
    const quorums = config.groupQuorums.map(Number)
    const parents = config.groupParents.map(Number)

    const groups = buildTree(signers, quorums, parents)
    const longChain = provider.chain

    const allMembers = [
      ...new Set(groups.flatMap((g) => g.members.map((m) => m.toLowerCase()))),
    ]
      .sort()
      .map((addr) => ChainSpecificAddress.fromLong(longChain, addr).toString())

    const summaryLines = renderSummaryLines(groups)
    const summaryRoot = summaryLines[0] ?? ''
    const summaryGroups = summaryLines.slice(1).join(' | ')

    return {
      field: this.field,
      value: {
        summary: summaryLines.join(' | '),
        summaryRoot,
        summaryGroups,
        rootQuorum: groups[0]?.quorum ?? 0,
        minSigs: minSigsForRoot(groups),
        allMembers,
        signerGroups: renderGroups(groups, longChain),
      },
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}

// Recursively computes the minimum signature count required to satisfy the
// root group's quorum. For each group, the optimal strategy is to satisfy the
// `quorum` cheapest children (where a leaf signer costs 1 and a sub-group
// costs its own recursively-computed minSigs).
function minSigsForRoot(groups: GroupNode[]): number {
  const byId = new Map(groups.map((g) => [g.id, g]))
  const memo = new Map<number, number>()

  function cost(groupId: number): number {
    const cached = memo.get(groupId)
    if (cached !== undefined) return cached

    const g = byId.get(groupId)
    if (g === undefined) return Number.POSITIVE_INFINITY

    const childCosts: number[] = []
    for (const m of g.members) {
      void m
      childCosts.push(1)
    }
    for (const cid of g.childGroups) {
      childCosts.push(cost(cid))
    }
    childCosts.sort((a, b) => a - b)
    const k = Math.min(g.quorum, childCosts.length)
    const result = childCosts.slice(0, k).reduce((a, b) => a + b, 0)
    memo.set(groupId, result)
    return result
  }

  if (!byId.has(0)) return 0
  return cost(0)
}

function buildTree(
  signers: SignerRow[],
  quorums: number[],
  parents: number[],
): GroupNode[] {
  const NUM_GROUPS = quorums.length
  const groups: GroupNode[] = []

  for (let i = 0; i < NUM_GROUPS; i++) {
    if (quorums[i] === 0) continue
    groups.push({
      id: i,
      quorum: quorums[i] ?? 0,
      parent: parents[i] ?? 0,
      members: [],
      childGroups: [],
    })
  }

  const byId = new Map(groups.map((g) => [g.id, g]))

  for (const s of signers) {
    const g = byId.get(s.group)
    assert(
      g !== undefined,
      `Signer ${s.addr} references disabled group ${s.group}`,
    )
    g.members.push(s.addr)
  }

  for (const g of groups) {
    if (g.id === 0) continue
    const parent = byId.get(g.parent)
    assert(
      parent !== undefined,
      `Group ${g.id} references disabled parent ${g.parent}`,
    )
    parent.childGroups.push(g.id)
  }

  return groups
}

// Returns one summary line per active group, root first. Joining with ' | '
// produces the full single-line summary; the caller may also split off the
// root line and hide the rest behind the frontend's [label: content]
// collapsible widget.
function renderSummaryLines(groups: GroupNode[]): string[] {
  if (groups.length === 0) return ['No active groups.']
  const lines: string[] = []
  for (const g of groups) {
    const childCount = g.members.length + g.childGroups.length
    const prefix = g.id === 0 ? 'Root' : `Group ${g.id}`
    // Use parens (not brackets) for the childGroups array — the frontend's
    // markdown post-processor turns `[label: content]` into a collapsible
    // button and stray brackets here would trigger spurious collapses.
    const parts = [`${prefix}: ${g.quorum}-of-${childCount}`]
    if (g.id !== 0) parts.push(`parent=${g.parent}`)
    if (g.childGroups.length > 0)
      parts.push(`childGroups=(${g.childGroups.join(',')})`)
    if (g.members.length > 0) parts.push(`signers=${g.members.length}`)
    lines.push(parts.join(', '))
  }
  return lines
}

function renderGroups(
  groups: GroupNode[],
  longChain: string,
): Record<string, ContractValue> {
  const out: Record<string, ContractValue> = {}
  for (const g of groups) {
    const members = [...g.members]
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map((addr) => ChainSpecificAddress.fromLong(longChain, addr).toString())

    const key = g.id === 0 ? 'root' : `group${g.id}`
    out[key] = {
      quorum: g.quorum,
      parent: g.parent,
      childGroups: [...g.childGroups],
      members,
    }
  }
  return out
}
