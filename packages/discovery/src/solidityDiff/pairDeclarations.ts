import { assert } from '@l2beat/shared-pure'
import type * as AST from '@mradomski/fast-solidity-parser'

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
    const partner = pairLists(lTitles, rTitles)
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

// Repeated titles (overloads, two `pragma solidity`) pair in order of
// appearance.
function pairLists(lTitles: string[], rTitles: string[]): Int32Array {
  const queues = new Map<string, number[]>()
  rTitles.forEach((title, j) => {
    const queue = queues.get(title) ?? []
    queue.push(j)
    queues.set(title, queue)
  })
  return Int32Array.from(lTitles, (title) => queues.get(title)?.shift() ?? -1)
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
