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

    return {
      field: this.field,
      value: {
        summary: renderSummary(groups),
        rootQuorum: groups[0]?.quorum ?? 0,
        signerGroups: renderGroups(groups, longChain),
      },
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
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

function renderSummary(groups: GroupNode[]): string {
  if (groups.length === 0) return 'No active groups.'
  const lines: string[] = []
  for (const g of groups) {
    const childCount = g.members.length + g.childGroups.length
    const prefix = g.id === 0 ? 'Root' : `Group ${g.id}`
    const parts = [`${prefix}: ${g.quorum}-of-${childCount}`]
    if (g.id !== 0) parts.push(`parent=${g.parent}`)
    if (g.childGroups.length > 0)
      parts.push(`childGroups=[${g.childGroups.join(',')}]`)
    if (g.members.length > 0) parts.push(`signers=${g.members.length}`)
    lines.push(parts.join(', '))
  }
  return lines.join(' | ')
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
