import { assert } from '@l2beat/shared-pure'
import type * as AST from '@mradomski/fast-solidity-parser'
import { isDeepStrictEqual } from 'util'

const DECLARATION_LISTS: Record<string, string> = {
  SourceUnit: 'children',
  ContractDefinition: 'subNodes',
}

// Declaration lists become objects keyed so that paired declarations share a
// key, then the shared `diff` compares them wherever they moved. A
// declaration on one side only keeps its list as it was.
export function pairDeclarations(left: AST.ASTNode, right: AST.ASTNode): void {
  const work: [AST.ASTNode, AST.ASTNode][] = [[left, right]]
  while (work.length > 0) {
    const [l, r] = work.pop() as [AST.ASTNode, AST.ASTNode]
    assert(l.type === r.type, 'Paired lists have one owner type')
    const field = DECLARATION_LISTS[l.type] as string
    const lFields = l as unknown as Record<string, unknown>
    const rFields = r as unknown as Record<string, unknown>
    const lList = lFields[field] as AST.ASTNode[]
    const rList = rFields[field] as AST.ASTNode[]
    const lTitles = lList.map(declarationKey)
    const rTitles = rList.map(declarationKey)
    const partner = pairLists(lList, rList, lTitles, rTitles)
    const [lKeyed, rKeyed] = keyLists(lList, rList, lTitles, rTitles, partner)
    lFields[field] = lKeyed
    rFields[field] = rKeyed
    lList.forEach((declaration, i) => {
      const paired = rList[partner[i] as number]
      if (paired !== undefined && declaration.type in DECLARATION_LISTS) {
        work.push([declaration, paired])
      }
    })
  }
}

// Paired are, in order: declarations sharing a title and contracts of one
// kind that share most declarations.
function pairLists(
  lList: AST.ASTNode[],
  rList: AST.ASTNode[],
  lTitles: string[],
  rTitles: string[],
): Int32Array {
  const partner = new Int32Array(lList.length).fill(-1)
  const groups = new Map<string, [number[], number[]]>()
  const groupOf = (title: string) => {
    const group = groups.get(title) ?? [[], []]
    groups.set(title, group)
    return group
  }
  lTitles.forEach((title, i) => groupOf(title)[0].push(i))
  rTitles.forEach((title, j) => groupOf(title)[1].push(j))
  for (const [left, right] of groups.values()) {
    pairGroup(lList, rList, left, right, partner)
  }
  pairRenamedContracts(lList, rList, partner)
  return partner
}

// A repeated title (a library flattened twice, overloads) pairs identical
// declarations first, the rest pair in order of appearance.
function pairGroup(
  lList: AST.ASTNode[],
  rList: AST.ASTNode[],
  left: number[],
  right: number[],
  partner: Int32Array,
): void {
  const free = [...right]
  if (left.length > 1 || right.length > 1) {
    for (const i of left) {
      const k = free.findIndex((j) => isDeepStrictEqual(lList[i], rList[j]))
      if (k !== -1) {
        partner[i] = free.splice(k, 1)[0] as number
      }
    }
  }
  for (const i of left) {
    if (partner[i] === -1 && free.length > 0) {
      partner[i] = free.shift() as number
    }
  }
}

// A renamed contract still holds most of the declarations it had. The
// closest pairs are taken first, ties in order of appearance.
function pairRenamedContracts(
  lList: AST.ASTNode[],
  rList: AST.ASTNode[],
  partner: Int32Array,
): void {
  const taken = new Uint8Array(rList.length)
  for (const j of partner) {
    if (j !== -1) taken[j] = 1
  }
  const candidates: [number, number, number][] = []
  lList.forEach((l, i) => {
    if (partner[i] !== -1 || l.type !== 'ContractDefinition') return
    const titles = subNodeTitles(l)
    rList.forEach((r, j) => {
      if (taken[j] === 1 || r.type !== 'ContractDefinition') return
      if (r.kind !== l.kind) return
      const similarity =
        sharedCount(titles, subNodeTitles(r)) /
        Math.max(l.subNodes.length, r.subNodes.length)
      if (similarity > 0.5) candidates.push([similarity, i, j])
    })
  })
  candidates.sort((a, b) => b[0] - a[0])
  for (const [, i, j] of candidates) {
    if (partner[i] === -1 && taken[j] === 0) {
      partner[i] = j
      taken[j] = 1
    }
  }
}

function keyLists(
  lList: AST.ASTNode[],
  rList: AST.ASTNode[],
  lTitles: string[],
  rTitles: string[],
  partner: Int32Array,
): [Record<string, AST.ASTNode>, Record<string, AST.ASTNode>] {
  const used = new Set<string>()
  const lKeyed: Record<string, AST.ASTNode> = {}
  const rKeyed: Record<string, AST.ASTNode> = {}
  const rKeys: string[] = []
  lList.forEach((declaration, i) => {
    const key = uniqueKey(lTitles[i] as string, used)
    lKeyed[key] = declaration
    if (partner[i] !== -1) rKeys[partner[i] as number] = key
  })
  rList.forEach((declaration, j) => {
    rKeyed[rKeys[j] ?? uniqueKey(rTitles[j] as string, used)] = declaration
  })
  return [lKeyed, rKeyed]
}

function uniqueKey(title: string, used: Set<string>): string {
  let key = title
  for (let occurrence = 2; used.has(key); occurrence++) {
    key = `${title} #${occurrence}`
  }
  used.add(key)
  return key
}

// Overloads share a title, so each declaration matches at most once.
function sharedCount(left: string[], right: string[]): number {
  const counts = new Map<string, number>()
  for (const title of left) {
    counts.set(title, (counts.get(title) ?? 0) + 1)
  }
  let shared = 0
  for (const title of right) {
    const count = counts.get(title) ?? 0
    if (count > 0) {
      counts.set(title, count - 1)
      shared++
    }
  }
  return shared
}

function subNodeTitles(contract: AST.ContractDefinition): string[] {
  return contract.subNodes.map((node) => declarationKey(node as AST.ASTNode))
}

// Parameter types are not part of the title, so a function whose signature
// changed still pairs with itself and the change shows inside it.
function declarationKey(node: AST.ASTNode): string {
  return titleOf(node) ?? JSON.stringify(node)
}

function titleOf(node: AST.ASTNode): string | undefined {
  switch (node.type) {
    case 'ContractDefinition':
      return `${node.kind} ${node.name}`
    case 'FunctionDefinition':
      if (node.isConstructor) return 'constructor'
      if (node.isFallback) return 'fallback'
      if (node.isReceiveEther) return 'receive'
      return `function ${node.name}`
    case 'ModifierDefinition':
      return `modifier ${node.name}`
    case 'EventDefinition':
      return `event ${node.name}`
    case 'CustomErrorDefinition':
      return `error ${node.name}`
    case 'StructDefinition':
      return `struct ${node.name}`
    case 'EnumDefinition':
      return `enum ${node.name}`
    case 'TypeDefinition':
      return `type ${node.name}`
    case 'FileLevelConstant':
      return `constant ${node.name}`
    case 'StateVariableDeclaration':
      return `variable ${node.variables.map((v) => v.name).join(', ')}`
    case 'PragmaDirective':
      return `pragma ${node.name}`
    case 'ImportDirective':
      return `import ${node.path}`
    default:
      return undefined
  }
}
