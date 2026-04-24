import type * as AST from '@mradomski/fast-solidity-parser'

type VisitFn = (node: AST.BaseASTNode, identifiers: string[]) => void

export function getASTIdentifiers(
  baseNode: AST.BaseASTNode | null,
  visit?: VisitFn,
): string[] {
  if (baseNode === null) {
    return []
  }
  const node = baseNode as AST.ASTNode

  let result: string[]
  switch (node.type) {
    case 'SourceUnit': {
      result = node.children.flatMap((n) => getASTIdentifiers(n, visit))
      break
    }
    case 'Identifier': {
      result = [node.name]
      break
    }
    case 'VariableDeclaration': {
      const ident = node.identifier !== null ? [node.identifier.name] : []
      const expr = parseExpression(node.expression, visit)
      const typeName = parseTypeName(node.typeName, visit)
      result = expr.concat(ident).concat(typeName)
      break
    }
    case 'Block': {
      result = node.statements.flatMap((statement) =>
        getASTIdentifiers(statement, visit),
      )
      break
    }
    case 'BreakStatement':
    case 'ContinueStatement':
    case 'InlineAssemblyStatement': {
      result = []
      break
    }
    case 'RevertStatement': {
      result = parseExpression(node.revertCall, visit)
      break
    }
    case 'IfStatement': {
      const condition = parseExpression(node.condition, visit)
      const trueBody = getASTIdentifiers(node.trueBody, visit)
      const falseBody = getASTIdentifiers(node.falseBody, visit)
      result = condition.concat(trueBody).concat(falseBody)
      break
    }
    case 'ExpressionStatement': {
      result = parseExpression(node.expression, visit)
      break
    }
    case 'VariableDeclarationStatement': {
      const variables = node.variables.flatMap((v) =>
        getASTIdentifiers(v, visit),
      )
      const initialValue = parseExpression(node.initialValue, visit)
      result = variables.concat(initialValue)
      break
    }
    case 'ReturnStatement': {
      result = parseExpression(node.expression, visit)
      break
    }
    case 'EmitStatement': {
      result = parseExpression(node.eventCall, visit)
      break
    }
    case 'ForStatement': {
      const init = getASTIdentifiers(node.initExpression, visit)
      const condition = parseExpression(node.conditionExpression ?? null, visit)
      const loopExpression = getASTIdentifiers(node.loopExpression, visit)
      const body = getASTIdentifiers(node.body, visit)
      result = init.concat(condition).concat(loopExpression).concat(body)
      break
    }
    case 'WhileStatement': {
      const condition = parseExpression(node.condition, visit)
      const body = getASTIdentifiers(node.body, visit)
      result = condition.concat(body)
      break
    }
    case 'DoWhileStatement': {
      const condition = parseExpression(node.condition, visit)
      const body = getASTIdentifiers(node.body, visit)
      result = condition.concat(body)
      break
    }
    case 'TryStatement': {
      const expression = parseExpression(node.expression, visit)
      const returnParameters = (node.returnParameters ?? []).flatMap((p) =>
        getASTIdentifiers(p, visit),
      )
      const body = getASTIdentifiers(node.body, visit)
      const catchClauses = node.catchClauses.flatMap((c) =>
        getASTIdentifiers(c, visit),
      )
      result = expression
        .concat(returnParameters)
        .concat(body)
        .concat(catchClauses)
      break
    }
    case 'CatchClause': {
      const parameters = (node.parameters ?? []).flatMap((p) =>
        getASTIdentifiers(p, visit),
      )
      const body = getASTIdentifiers(node.body, visit)
      result = parameters.concat(body)
      break
    }
    case 'UncheckedStatement': {
      result = getASTIdentifiers(node.block, visit)
      break
    }
    case 'CustomErrorDefinition': {
      result = node.parameters.flatMap((p) => getASTIdentifiers(p, visit))
      break
    }
    case 'EventDefinition': {
      result = node.parameters.flatMap((p) => getASTIdentifiers(p, visit))
      break
    }
    case 'FunctionDefinition': {
      const params = node.parameters.flatMap((p) => getASTIdentifiers(p, visit))
      const returnParams = (node.returnParameters ?? []).flatMap((p) =>
        getASTIdentifiers(p, visit),
      )
      const body = getASTIdentifiers(node.body, visit)
      const modifiers = (node.modifiers ?? [])
        .flatMap((m) => m.arguments ?? [])
        .flatMap((a) => parseExpression(a, visit))
      result = params.concat(returnParams).concat(body).concat(modifiers)
      break
    }
    case 'ModifierDefinition': {
      const params = node.parameters ?? []
      const paramTypes = params.flatMap((p) => getASTIdentifiers(p, visit))
      const librariesFromBlock = getASTIdentifiers(node.body, visit)
      result = paramTypes.concat(librariesFromBlock)
      break
    }
    case 'StateVariableDeclaration': {
      const varTypes = node.variables.flatMap((v) =>
        getASTIdentifiers(v, visit),
      )
      const expr = parseExpression(node.initialValue, visit)
      result = expr.concat(varTypes)
      break
    }
    case 'StructDefinition': {
      result = node.members.flatMap((m) => getASTIdentifiers(m, visit))
      break
    }
    case 'TypeDefinition': {
      result = parseTypeName(node.definition, visit)
      break
    }
    case 'FileLevelConstant': {
      const typeName = parseTypeName(node.typeName, visit)
      const initialValue = parseExpression(node.initialValue, visit)
      result = [node.name].concat(typeName).concat(initialValue)
      break
    }
    case 'UsingForDeclaration': {
      const typeName = parseTypeName(node.typeName, visit)
      const libraryName = node.libraryName ?? []
      result = typeName.concat(libraryName)
      break
    }
    case 'InheritanceSpecifier': {
      const baseName = parseTypeName(node.baseName, visit)
      const args = node.arguments.flatMap((a) => parseExpression(a, visit))
      result = args.concat(baseName)
      break
    }
    case 'ContractDefinition': {
      const name = node.name
      const baseContracts = node.baseContracts.flatMap((c) =>
        getASTIdentifiers(c, visit),
      )
      const subNodes = node.subNodes.flatMap((n) => getASTIdentifiers(n, visit))
      result = [name].concat(baseContracts).concat(subNodes)
      break
    }
    case 'NameValueList': {
      const identifiers = node.identifiers.flatMap((i) =>
        getASTIdentifiers(i, visit),
      )
      const args = node.arguments.flatMap((a) => parseExpression(a, visit))
      result = identifiers.concat(args)
      break
    }
    case 'EnumValue': {
      result = [node.name]
      break
    }
    case 'PragmaDirective':
    case 'ImportDirective':
    case 'EnumDefinition': {
      result = []
      break
    }
    case 'BinaryOperation':
    case 'IndexAccess':
    case 'IndexRangeAccess':
    case 'TupleExpression':
    case 'Conditional':
    case 'MemberAccess':
    case 'FunctionCall':
    case 'UnaryOperation':
    case 'NewExpression':
    case 'BooleanLiteral':
    case 'HexLiteral':
    case 'NumberLiteral':
    case 'StringLiteral':
    case 'NameValueExpression': {
      result = parseExpression(node, visit)
      break
    }
    case 'ElementaryTypeName':
    case 'UserDefinedTypeName':
    case 'Mapping':
    case 'ArrayTypeName':
    case 'FunctionTypeName': {
      result = parseTypeName(node, visit)
      break
    }
    default: {
      throw new Error(`TopLevelFunc: Unknown node type: [${node.type}]`)
    }
  }

  visit?.(node, result)
  return result
}

function parseExpression(
  expr: AST.Expression | null,
  visit?: VisitFn,
): string[] {
  if (!expr?.type) {
    return []
  }

  let result: string[]
  switch (expr.type) {
    case 'BinaryOperation': {
      result = parseExpression(expr.left, visit).concat(
        parseExpression(expr.right, visit),
      )
      break
    }
    case 'FunctionCall': {
      result = parseExpression(expr.expression, visit)
        .concat(expr.arguments.flatMap((k) => parseExpression(k, visit)))
        .concat(expr.identifiers.map((i) => i.name))
      break
    }
    case 'IndexAccess': {
      result = parseExpression(expr.base, visit).concat(
        parseExpression(expr.index, visit),
      )
      break
    }
    case 'TupleExpression': {
      result = expr.components.flatMap((component) =>
        getASTIdentifiers(component, visit),
      )
      break
    }
    case 'MemberAccess': {
      result = parseExpression(expr.expression, visit)
      break
    }
    case 'Conditional': {
      result = parseExpression(expr.condition, visit)
        .concat(parseExpression(expr.trueExpression, visit))
        .concat(parseExpression(expr.falseExpression, visit))
      break
    }
    case 'Identifier': {
      result = [expr.name]
      break
    }
    case 'NewExpression': {
      result = parseTypeName(expr.typeName, visit)
      break
    }
    case 'UnaryOperation': {
      result = parseExpression(expr.subExpression, visit)
      break
    }
    case 'IndexRangeAccess': {
      const base = parseExpression(expr.base, visit)
      const indexStart = parseExpression(expr.indexStart ?? null, visit)
      const indexEnd = parseExpression(expr.indexEnd ?? null, visit)
      result = base.concat(indexStart).concat(indexEnd)
      break
    }
    case 'ElementaryTypeName': {
      result = parseTypeName(expr, visit)
      break
    }
    case 'NameValueExpression': {
      result = parseExpression(expr.expression, visit).concat(
        getASTIdentifiers(expr.arguments, visit),
      )
      break
    }
    case 'NumberLiteral':
    case 'BooleanLiteral':
    case 'HexLiteral':
    case 'StringLiteral': {
      result = []
      break
    }
    default: {
      throw new Error(
        `parseExpression: Unknown expression type: [${expr.type}]`,
      )
    }
  }

  visit?.(expr, result)
  return result
}

function parseTypeName(type: AST.TypeName | null, visit?: VisitFn): string[] {
  if (!type?.type) {
    return []
  }

  let result: string[]
  switch (type.type) {
    case 'ElementaryTypeName': {
      result = []
      break
    }
    case 'UserDefinedTypeName': {
      result = [type.namePath]
      break
    }
    case 'Mapping': {
      result = parseTypeName(type.keyType, visit).concat(
        parseTypeName(type.valueType, visit),
      )
      break
    }
    case 'ArrayTypeName': {
      const { baseTypeName, length } = type
      result = parseTypeName(baseTypeName, visit).concat(
        parseExpression(length, visit),
      )
      break
    }
    case 'FunctionTypeName': {
      result = []
      break
    }
  }

  visit?.(type, result)
  return result
}
