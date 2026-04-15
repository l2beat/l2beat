import type * as AST from '@mradomski/fast-solidity-parser'

export function getASTIdentifiers(baseNode: AST.BaseASTNode | null): string[] {
  if (baseNode === null) {
    return []
  }
  const node = baseNode as AST.ASTNode

  switch (node.type) {
    case 'Identifier': {
      return [node.name]
    }
    case 'VariableDeclaration': {
      const ident = node.identifier !== null ? [node.identifier.name] : []
      const expr = parseExpression(node.expression)
      const typeName = parseTypeName(node.typeName)
      return expr.concat(ident).concat(typeName)
    }
    case 'Block': {
      return node.statements.flatMap((statement) =>
        getASTIdentifiers(statement),
      )
    }
    case 'BreakStatement':
    case 'ContinueStatement':
    case 'InlineAssemblyStatement': {
      return []
    }
    case 'RevertStatement': {
      return parseExpression(node.revertCall)
    }
    case 'IfStatement': {
      const condition = parseExpression(node.condition)
      const trueBody = getASTIdentifiers(node.trueBody)
      const falseBody = getASTIdentifiers(node.falseBody)

      return condition.concat(trueBody).concat(falseBody)
    }
    case 'ExpressionStatement': {
      return parseExpression(node.expression)
    }
    case 'VariableDeclarationStatement': {
      const variables = node.variables.flatMap((v) => getASTIdentifiers(v))
      const initialValue = parseExpression(node.initialValue)

      return variables.concat(initialValue)
    }
    case 'ReturnStatement': {
      return parseExpression(node.expression)
    }
    case 'EmitStatement': {
      return parseExpression(node.eventCall)
    }
    case 'ForStatement': {
      const init = getASTIdentifiers(node.initExpression)
      const condition = parseExpression(node.conditionExpression ?? null)
      const loopExpression = getASTIdentifiers(node.loopExpression)
      const body = getASTIdentifiers(node.body)
      return init.concat(condition).concat(loopExpression).concat(body)
    }
    case 'WhileStatement': {
      const condition = parseExpression(node.condition)
      const body = getASTIdentifiers(node.body)
      return condition.concat(body)
    }
    case 'DoWhileStatement': {
      const condition = parseExpression(node.condition)
      const body = getASTIdentifiers(node.body)
      return condition.concat(body)
    }
    case 'TryStatement': {
      const expression = parseExpression(node.expression)
      const returnParameters = (node.returnParameters ?? []).flatMap((p) =>
        getASTIdentifiers(p),
      )
      const body = getASTIdentifiers(node.body)
      const catchClauses = node.catchClauses.flatMap((c) =>
        getASTIdentifiers(c),
      )
      return expression
        .concat(returnParameters)
        .concat(body)
        .concat(catchClauses)
    }
    case 'CatchClause': {
      const parameters = (node.parameters ?? []).flatMap((p) =>
        getASTIdentifiers(p),
      )
      const body = getASTIdentifiers(node.body)
      return parameters.concat(body)
    }
    case 'UncheckedStatement': {
      return getASTIdentifiers(node.block)
    }
    case 'CustomErrorDefinition': {
      return node.parameters.flatMap((p) => getASTIdentifiers(p))
    }
    case 'EventDefinition': {
      return node.parameters.flatMap((p) => getASTIdentifiers(p))
    }
    case 'FunctionDefinition': {
      const params = node.parameters.flatMap((p) => getASTIdentifiers(p))
      const returnParams = (node.returnParameters ?? []).flatMap((p) =>
        getASTIdentifiers(p),
      )
      const body = getASTIdentifiers(node.body)

      return params.concat(returnParams).concat(body)
    }
    case 'ModifierDefinition': {
      const params = node.parameters ?? []

      const paramTypes = params.flatMap((p) => getASTIdentifiers(p))
      const librariesFromBlock = getASTIdentifiers(node.body)

      return paramTypes.concat(librariesFromBlock)
    }
    case 'StateVariableDeclaration': {
      const varTypes = node.variables.flatMap((v) => getASTIdentifiers(v))
      const expr = parseExpression(node.initialValue)

      return expr.concat(varTypes)
    }
    case 'StructDefinition': {
      return node.members.flatMap((m) => getASTIdentifiers(m))
    }
    case 'TypeDefinition': {
      return parseTypeName(node.definition)
    }
    case 'UsingForDeclaration': {
      const typeName = parseTypeName(node.typeName)
      const libraryName = node.libraryName ?? []

      return typeName.concat(libraryName)
    }
    case 'InheritanceSpecifier': {
      const baseName = parseTypeName(node.baseName)
      const args = node.arguments.flatMap((a) => parseExpression(a))

      return args.concat(baseName)
    }
    case 'ContractDefinition': {
      const name = node.name
      const baseContracts = node.baseContracts.flatMap((c) =>
        getASTIdentifiers(c),
      )
      const subNodes = node.subNodes.flatMap((n) => getASTIdentifiers(n))

      return [name].concat(baseContracts).concat(subNodes)
    }
    case 'NameValueList': {
      const identifiers = node.identifiers.flatMap((i) => getASTIdentifiers(i))
      const args = node.arguments.flatMap((a) => parseExpression(a))
      return identifiers.concat(args)
    }
    case 'EnumValue': {
      return [node.name]
    }
    case 'PragmaDirective':
    case 'ImportDirective':
    case 'EnumDefinition': {
      return []
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
      return parseExpression(node)
    }
    case 'ElementaryTypeName':
    case 'UserDefinedTypeName':
    case 'Mapping':
    case 'ArrayTypeName':
    case 'FunctionTypeName': {
      return parseTypeName(node)
    }
    default: {
      throw new Error(`TopLevelFunc: Unknown node type: [${node.type}]`)
    }
  }
}

function parseExpression(expr: AST.Expression | null): string[] {
  if (!expr?.type) {
    return []
  }

  switch (expr.type) {
    case 'BinaryOperation': {
      return parseExpression(expr.left).concat(parseExpression(expr.right))
    }
    case 'FunctionCall': {
      return parseExpression(expr.expression)
        .concat(expr.arguments.flatMap((k) => parseExpression(k)))
        .concat(expr.identifiers.map((i) => i.name))
    }
    case 'IndexAccess': {
      return parseExpression(expr.base).concat(parseExpression(expr.index))
    }
    case 'TupleExpression': {
      return expr.components.flatMap((component) =>
        getASTIdentifiers(component),
      )
    }
    case 'MemberAccess': {
      return parseExpression(expr.expression)
    }
    case 'Conditional': {
      return parseExpression(expr.condition)
        .concat(parseExpression(expr.trueExpression))
        .concat(parseExpression(expr.falseExpression))
    }
    case 'Identifier': {
      return [expr.name]
    }
    case 'NewExpression': {
      return parseTypeName(expr.typeName)
    }
    case 'UnaryOperation': {
      return parseExpression(expr.subExpression)
    }
    case 'IndexRangeAccess': {
      const base = parseExpression(expr.base)
      const indexStart = parseExpression(expr.indexStart ?? null)
      const indexEnd = parseExpression(expr.indexEnd ?? null)

      return base.concat(indexStart).concat(indexEnd)
    }
    case 'ElementaryTypeName': {
      return parseTypeName(expr)
    }
    case 'NameValueExpression': {
      return parseExpression(expr.expression).concat(
        getASTIdentifiers(expr.arguments),
      )
    }
    case 'NumberLiteral':
    case 'BooleanLiteral':
    case 'HexLiteral':
    case 'StringLiteral': {
      return []
    }
    default: {
      throw new Error(
        `parseExpression: Unknown expression type: [${expr.type}]`,
      )
    }
  }
}

function parseTypeName(type: AST.TypeName | null): string[] {
  if (!type?.type) {
    return []
  }

  switch (type.type) {
    case 'ElementaryTypeName': {
      return [type.name]
    }
    case 'UserDefinedTypeName': {
      return [type.namePath]
    }
    case 'Mapping': {
      return parseTypeName(type.keyType).concat(parseTypeName(type.valueType))
    }
    case 'ArrayTypeName': {
      return parseTypeName(type.baseTypeName)
    }
    case 'FunctionTypeName': {
      return []
    }
  }
}
