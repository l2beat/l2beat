import { unique } from '@l2beat/shared-pure'
import type * as AST from '@mradomski/fast-solidity-parser'

type Node = AST.BaseASTNode | null
type VisitFn = (node: AST.BaseASTNode, identifiers: string[]) => void
type Item = { node: Node; start?: number }

export function getASTIdentifiers(root: Node, visit?: VisitFn): string[] {
  const work: Item[] = [{ node: root }]
  const flat: string[] = []

  while (work.length > 0) {
    const item = work.pop() as Item
    if (item.start !== undefined) {
      visit?.(item.node as AST.BaseASTNode, flat.slice(item.start))
      continue
    }
    if (!item.node?.type) continue
    const kids: Node[] = []
    const start = flat.length
    emit(item.node as AST.ASTNode, flat, kids)
    work.push({ node: item.node, start })
    for (let i = kids.length - 1; i >= 0; i--) {
      work.push({ node: kids[i] as Node })
    }
  }

  return unique(flat)
}

function emit(n: AST.ASTNode, flat: string[], kids: Node[]): void {
  switch (n.type) {
    case 'SourceUnit':
      kids.push(...n.children)
      return
    case 'ContractDefinition':
      flat.push(n.name)
      kids.push(...n.baseContracts, ...n.subNodes)
      return
    case 'InheritanceSpecifier':
      kids.push(...n.arguments, n.baseName)
      return
    case 'FunctionDefinition':
      kids.push(
        ...n.parameters,
        ...(n.returnParameters ?? []),
        n.body,
        ...(n.modifiers ?? []).flatMap((m) => m.arguments ?? []),
      )
      return
    case 'ModifierDefinition':
      kids.push(...(n.parameters ?? []), n.body)
      return
    case 'StateVariableDeclaration':
      kids.push(n.initialValue, ...n.variables)
      return
    case 'VariableDeclaration':
      // node.expression intentionally NOT walked: parser aliases initialValue
      // onto each variable's .expression, which would cause a double-visit.
      if (n.identifier !== null) flat.push(n.identifier.name)
      kids.push(n.typeName)
      return
    case 'StructDefinition':
      kids.push(...n.members)
      return
    case 'TypeDefinition':
      kids.push(n.definition)
      return
    case 'FileLevelConstant':
      flat.push(n.name)
      kids.push(n.typeName, n.initialValue)
      return
    case 'UsingForDeclaration': {
      kids.push(n.typeName)
      const raw = n as unknown as {
        libraryName?: string | string[] | null
        functions?: string[] | null
      }
      if (typeof raw.libraryName === 'string') flat.push(raw.libraryName)
      else if (Array.isArray(raw.libraryName)) flat.push(...raw.libraryName)
      if (Array.isArray(raw.functions)) flat.push(...raw.functions)
      return
    }
    case 'CustomErrorDefinition':
    case 'EventDefinition':
      kids.push(...n.parameters)
      return
    case 'EnumValue':
      flat.push(n.name)
      return
    case 'NameValueList':
      kids.push(...n.identifiers, ...n.arguments)
      return

    case 'Block':
      kids.push(...n.statements)
      return
    case 'IfStatement':
      kids.push(n.condition, n.trueBody, n.falseBody)
      return
    case 'ForStatement':
      kids.push(
        n.initExpression,
        n.conditionExpression ?? null,
        n.loopExpression,
        n.body,
      )
      return
    case 'WhileStatement':
    case 'DoWhileStatement':
      kids.push(n.condition, n.body)
      return
    case 'TryStatement':
      kids.push(
        n.expression,
        ...(n.returnParameters ?? []),
        n.body,
        ...n.catchClauses,
      )
      return
    case 'CatchClause':
      kids.push(...(n.parameters ?? []), n.body)
      return
    case 'UncheckedStatement':
      kids.push(n.block)
      return
    case 'VariableDeclarationStatement':
      kids.push(...n.variables, n.initialValue)
      return
    case 'ExpressionStatement':
      kids.push(n.expression)
      return
    case 'ReturnStatement':
      kids.push(n.expression)
      return
    case 'EmitStatement':
      kids.push(n.eventCall)
      return
    case 'RevertStatement':
      kids.push(n.revertCall)
      return
    case 'InlineAssemblyStatement':
      kids.push(n.body)
      return

    case 'Identifier':
      flat.push(n.name)
      return
    case 'BinaryOperation':
      kids.push(n.left, n.right)
      return
    case 'UnaryOperation':
      kids.push(n.subExpression)
      return
    case 'Conditional':
      kids.push(n.condition, n.trueExpression, n.falseExpression)
      return
    case 'MemberAccess':
      kids.push(n.expression)
      return
    case 'IndexAccess':
      kids.push(n.base, n.index)
      return
    case 'IndexRangeAccess':
      kids.push(n.base, n.indexStart ?? null, n.indexEnd ?? null)
      return
    case 'TupleExpression':
      kids.push(...n.components)
      return
    case 'FunctionCall':
      kids.push(n.expression, ...n.arguments)
      flat.push(...n.identifiers.map((i) => i.name))
      return
    case 'NewExpression':
      kids.push(n.typeName)
      return
    case 'NameValueExpression':
      kids.push(n.expression, n.arguments)
      return

    case 'UserDefinedTypeName':
      flat.push(n.namePath)
      return
    case 'Mapping':
      kids.push(n.keyType, n.valueType)
      return
    case 'ArrayTypeName':
      kids.push(n.baseTypeName, n.length)
      return

    case 'AssemblyBlock':
      kids.push(...n.operations)
      return
    case 'AssemblyCall':
      flat.push(n.functionName)
      kids.push(...n.arguments)
      return
    case 'AssemblyLocalDefinition':
    case 'AssemblyAssignment':
      kids.push(...(n.names ?? []), n.expression ?? null)
      return
    case 'AssemblyStackAssignment':
      flat.push(n.name)
      kids.push(n.expression)
      return
    case 'AssemblyIf':
      kids.push(n.condition, n.body)
      return
    case 'AssemblyFor':
      kids.push(n.pre, n.condition, n.post, n.body)
      return
    case 'AssemblySwitch':
      kids.push(n.expression, ...n.cases)
      return
    case 'AssemblyCase':
      kids.push(n.block)
      return
    case 'AssemblyFunctionDefinition':
      kids.push(n.body)
      return
    case 'AssemblyMemberAccess':
      flat.push(n.expression.name)
      return
  }
}
