import type * as AST from '@mradomski/fast-solidity-parser'

export function formatAst(ast: AST.ASTNode) {
  return formatAstNode(ast, 0) + '\n\n'
}

export function formatAstNode(node: AST.ASTNode, indent: number): string {
  return FORMATTERS[node.type](node as never, indent)
}

type Formatter<T> = (
  node: Extract<AST.ASTNode, { type: T }>,
  indent: number,
) => string

const __REPLACE_ME__ = (node: AST.ASTNode, indent: number) =>
  `${formatIndent(indent)}${node.type}${
    node.type.endsWith('Statement') || node.type.endsWith('Definition')
      ? ';'
      : ''
  }`

const FORMATTERS: {
  [K in AST.ASTNode['type']]: Formatter<K>
} = {
  ArrayTypeName: __REPLACE_ME__,
  AssemblyAssignment: __REPLACE_ME__,
  AssemblyBlock: __REPLACE_ME__,
  AssemblyCall: __REPLACE_ME__,
  AssemblyCase: __REPLACE_ME__,
  AssemblyFor: __REPLACE_ME__,
  AssemblyFunctionDefinition: __REPLACE_ME__,
  AssemblyIf: __REPLACE_ME__,
  AssemblyLocalDefinition: __REPLACE_ME__,
  AssemblyMemberAccess: __REPLACE_ME__,
  AssemblyStackAssignment: __REPLACE_ME__,
  AssemblySwitch: __REPLACE_ME__,
  BinaryOperation: __REPLACE_ME__,
  Block,
  BooleanLiteral: __REPLACE_ME__,
  Break: __REPLACE_ME__,
  BreakStatement: __REPLACE_ME__,
  CatchClause: __REPLACE_ME__,
  Conditional: __REPLACE_ME__,
  Continue: __REPLACE_ME__,
  ContinueStatement: __REPLACE_ME__,
  ContractDefinition,
  CustomErrorDefinition: __REPLACE_ME__,
  DecimalNumber: __REPLACE_ME__,
  DoWhileStatement: __REPLACE_ME__,
  ElementaryTypeName,
  EmitStatement: __REPLACE_ME__,
  EnumDefinition: __REPLACE_ME__,
  EnumValue: __REPLACE_ME__,
  EventDefinition: __REPLACE_ME__,
  ExpressionStatement: __REPLACE_ME__,
  FileLevelConstant: __REPLACE_ME__,
  ForStatement: __REPLACE_ME__,
  FunctionCall: __REPLACE_ME__,
  FunctionDefinition,
  FunctionTypeName: __REPLACE_ME__,
  HexLiteral: __REPLACE_ME__,
  HexNumber: __REPLACE_ME__,
  Identifier,
  IfStatement: __REPLACE_ME__,
  ImportDirective: __REPLACE_ME__,
  IndexAccess: __REPLACE_ME__,
  IndexRangeAccess: __REPLACE_ME__,
  InheritanceSpecifier,
  InlineAssemblyStatement: __REPLACE_ME__,
  LabelDefinition: __REPLACE_ME__,
  Mapping: __REPLACE_ME__,
  MemberAccess: __REPLACE_ME__,
  ModifierDefinition: __REPLACE_ME__,
  ModifierInvocation: __REPLACE_ME__,
  NameValueExpression: __REPLACE_ME__,
  NameValueList: __REPLACE_ME__,
  NewExpression: __REPLACE_ME__,
  NumberLiteral: __REPLACE_ME__,
  PragmaDirective: __REPLACE_ME__,
  ReturnStatement: __REPLACE_ME__,
  RevertStatement: __REPLACE_ME__,
  SourceUnit,
  StateVariableDeclaration,
  StringLiteral: __REPLACE_ME__,
  StructDefinition: __REPLACE_ME__,
  ThrowStatement: __REPLACE_ME__,
  TryStatement: __REPLACE_ME__,
  TupleExpression: __REPLACE_ME__,
  TypeDefinition: __REPLACE_ME__,
  UnaryOperation: __REPLACE_ME__,
  UncheckedStatement: __REPLACE_ME__,
  UserDefinedTypeName,
  UsingForDeclaration: __REPLACE_ME__,
  VariableDeclaration,
  VariableDeclarationStatement: __REPLACE_ME__,
  WhileStatement: __REPLACE_ME__,
}

function Block(node: AST.Block, indent: number) {
  const begin = formatIndent(indent)
  const statements = formatNodeList(
    node.statements as AST.ASTNode[],
    indent + 1,
    { separator: `${begin}\n`, prefix: '\n', suffix: `\n${begin}` },
  )
  return `${begin}{${statements}}`
}

function ContractDefinition(node: AST.ContractDefinition, indent: number) {
  const begin = formatIndent(indent)
  const type = node.kind === 'abstract' ? 'abstract contract' : node.kind

  const base = formatNodeList(node.baseContracts, indent, {
    prefix: 'is ',
    separator: ', ',
    suffix: ' ',
  })

  const statements = node.subNodes.flatMap((n, i) => {
    const formatted = formatAstNode(n as AST.ASTNode, indent + 1)
    const result = [formatted]
    if (
      i !== 0 &&
      (n.type === 'FunctionDefinition' ||
        n.type === 'ModifierDefinition' ||
        n.type === 'StructDefinition' ||
        n.type !== node.subNodes[i - 1]?.type)
    ) {
      result.unshift('')
    }
    return result
  })

  const statementsFmt = formatList(statements, {
    separator: '\n',
    prefix: '\n',
    suffix: '\n',
  })

  return `${begin}${type} ${node.name} ${base}{${statementsFmt}}`
}

function ElementaryTypeName(node: AST.ElementaryTypeName, _: number) {
  let result = node.name
  if (node.stateMutability) {
    result += ` ${node.stateMutability}`
  }
  return result
}

function FunctionDefinition(node: AST.FunctionDefinition, indent: number) {
  const begin = formatIndent(indent)
  const typeName = node.isConstructor
    ? 'constructor'
    : node.isFallback
      ? 'fallback'
      : node.isReceiveEther
        ? 'receive'
        : 'function'
  const name = node.name ? ` ${node.name}` : ''

  const modifiers: string[] = []
  if (node.visibility !== 'default') {
    modifiers.push(node.visibility)
  }
  if (node.isVirtual) {
    modifiers.push('virtual')
  }
  if (node.stateMutability !== null) {
    modifiers.push(node.stateMutability)
  }
  if (node.override) {
    modifiers.push(formatOverride(node.override, indent))
  }
  for (const n of node.modifiers) {
    modifiers.push(formatAstNode(n, indent))
  }
  const modifiersFmt = formatList(modifiers, {
    separator: ' ',
    suffix: ' ',
  })

  const parameters = formatNodeList(node.parameters, indent, {
    separator: ', ',
  })

  const returns = formatNodeList(node.returnParameters ?? [], indent, {
    separator: ', ',
    prefix: 'returns (',
    suffix: ') ',
  })

  const body = node.body ? formatAstNode(node.body, indent).trimStart() : '{}'

  return `${begin}${typeName}${name}(${parameters}) ${modifiersFmt}${returns}${body}`
}

function Identifier(node: AST.Identifier, _: number) {
  return node.name
}

function InheritanceSpecifier(node: AST.InheritanceSpecifier, indent: number) {
  const base = formatAstNode(node.baseName, indent)
  const args = formatNodeList(node.arguments, indent, {
    separator: ', ',
    prefix: '(',
    suffix: ')',
  })
  return `${base}${args}`
}

function SourceUnit(node: AST.SourceUnit, indent: number) {
  return formatNodeList(node.children, indent, { separator: '\n\n' })
}

function StateVariableDeclaration(
  node: AST.StateVariableDeclaration,
  indent: number,
) {
  const begin = formatIndent(indent)
  const [n] = node.variables
  if (!n || node.variables.length > 1) {
    throw new Error(
      'Programmer error: StateVariableDeclaration.variables.length !== 1',
    )
  }
  const variable = formatAstNode(n, indent)
  return `${begin}${variable};`
}

function UserDefinedTypeName(node: AST.UserDefinedTypeName, _: number) {
  return node.namePath
}

function VariableDeclaration(node: AST.VariableDeclaration, indent: number) {
  const items: string[] = []
  if (node.typeName) {
    items.push(formatAstNode(node.typeName, indent))
  }
  if (node.visibility && node.visibility !== 'default') {
    items.push(node.visibility)
  }
  if (node.isDeclaredConst) {
    items.push('constant')
  }
  if ('override' in node && node.override) {
    items.push(
      formatOverride(node.override as AST.UserDefinedTypeName[], indent),
    )
  }
  if ('isImmutable' in node && node.isImmutable) {
    items.push('immutable')
  }
  if (node.isIndexed) {
    items.push('indexed')
  }
  if (node.storageLocation) {
    items.push(node.storageLocation)
  }
  if (node.identifier) {
    items.push(formatAstNode(node.identifier, indent))
  }
  if (node.expression) {
    items.push('=')
    items.push(formatAstNode(node.expression, indent))
  }
  return items.join(' ')
}

// --- HELPERS ---

function formatIndent(indent: number) {
  return '\t'.repeat(indent)
}

function formatNodeList(
  nodes: AST.ASTNode[],
  indent: number,
  options: { prefix?: string; suffix?: string; separator: string },
) {
  return formatList(
    nodes.map((n) => formatAstNode(n, indent)),
    options,
  )
}

function formatList(
  strings: string[],
  options: { prefix?: string; suffix?: string; separator: string },
) {
  if (strings.length === 0) {
    return ''
  }
  const items = strings.join(options.separator)
  return `${options.prefix ?? ''}${items}${options.suffix ?? ''}`
}

function formatOverride(override: AST.UserDefinedTypeName[], indent: number) {
  const types = override.map((n) => formatAstNode(n, indent))
  if (types.length > 0) {
    return `override(${types.join(', ')})`
  } else {
    return 'override'
  }
}
