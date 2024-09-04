import type * as AST from '@mradomski/fast-solidity-parser'

export function formatAst(ast: AST.ASTNode) {
  return formatAstNode(ast, 0) + '\n\n'
}

const state = {
  insideInterface: false,
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
  ImportDirective,
  IndexAccess: __REPLACE_ME__,
  IndexRangeAccess: __REPLACE_ME__,
  InheritanceSpecifier,
  InlineAssemblyStatement: __REPLACE_ME__,
  LabelDefinition: __REPLACE_ME__,
  Mapping: __REPLACE_ME__,
  MemberAccess: __REPLACE_ME__,
  ModifierDefinition: __REPLACE_ME__,
  ModifierInvocation,
  NameValueExpression: __REPLACE_ME__,
  NameValueList: __REPLACE_ME__,
  NewExpression: __REPLACE_ME__,
  NumberLiteral: __REPLACE_ME__,
  PragmaDirective,
  ReturnStatement: __REPLACE_ME__,
  RevertStatement: __REPLACE_ME__,
  SourceUnit,
  StateVariableDeclaration,
  StringLiteral,
  StructDefinition: __REPLACE_ME__,
  ThrowStatement: __REPLACE_ME__,
  TryStatement: __REPLACE_ME__,
  TupleExpression: __REPLACE_ME__,
  TypeDefinition: __REPLACE_ME__,
  UnaryOperation: __REPLACE_ME__,
  UncheckedStatement: __REPLACE_ME__,
  UserDefinedTypeName,
  UsingForDeclaration,
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

  if (node.kind === 'interface') {
    state.insideInterface = true
  }

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

  state.insideInterface = false

  return `${begin}${type} ${node.name} ${base}{${statementsFmt}}`
}

function ElementaryTypeName(node: AST.ElementaryTypeName, _: number) {
  let result = node.name
  if (result === 'uint') {
    result = 'uint256'
  } else if (result === 'int') {
    result = 'int256'
  }
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
      ? 'function fallback'
      : node.isReceiveEther
        ? 'function receive'
        : 'function'
  const name = node.name ? ` ${node.name}` : ''

  const parameters = formatNodeList(node.parameters, indent, {
    separator: ', ',
  })

  const after: string[] = []
  if (node.visibility !== 'default') {
    after.push(node.visibility)
  }
  if (node.stateMutability !== null) {
    after.push(node.stateMutability)
  }
  for (const n of node.modifiers) {
    after.push(formatAstNode(n, indent))
  }
  if (node.isVirtual) {
    after.push('virtual')
  }
  if (node.override) {
    after.push(formatOverride(node.override, indent))
  }
  if (node.returnParameters) {
    after.push(
      formatNodeList(node.returnParameters, indent, {
        separator: ', ',
        prefix: 'returns (',
        suffix: ')',
      }),
    )
  }
  const afterFmt = formatList(after, { separator: ' ', prefix: ' ' })

  const body = node.body
    ? ' ' + formatAstNode(node.body, indent).trimStart()
    : state.insideInterface
      ? ';'
      : ' {}'

  return `${begin}${typeName}${name}(${parameters})${afterFmt}${body}`
}

function Identifier(node: AST.Identifier, _: number) {
  return node.name
}

function ImportDirective(node: AST.ImportDirective, indent: number) {
  const before = formatIndent(indent)
  const unit = node.unitAliasIdentifier
    ? `* as ${formatAstNode(node.unitAliasIdentifier, indent)} from `
    : ''
  const aliases = (node.symbolAliasesIdentifiers ?? []).map(([id, asId]) => {
    const idFmt = formatAstNode(id, indent)
    if (!asId) {
      return idFmt
    }
    return `${idFmt} as ${formatAstNode(asId, indent)}`
  })
  const aliasesFmt = formatList(aliases, {
    separator: ', ',
    prefix: '{ ',
    suffix: ' } from ',
  })
  const path = formatAstNode(node.pathLiteral, indent)
  return `${before}import ${unit}${aliasesFmt}${path};`
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

function ModifierInvocation(node: AST.ModifierInvocation, indent: number) {
  const args = formatNodeList(node.arguments ?? [], indent, {
    separator: ', ',
    prefix: '(',
    suffix: ')',
  })
  return `${node.name}${args}`
}

function PragmaDirective(node: AST.PragmaDirective, indent: number) {
  const before = formatIndent(indent)
  return `${before}pragma ${node.name} ${node.value};`
}

function SourceUnit(node: AST.SourceUnit, indent: number) {
  return node.children
    .map((n, i) => {
      const fmt = formatAstNode(n, indent)
      if (
        i !== node.children.length - 1 &&
        (n.type !== 'ImportDirective' ||
          node.children[i + 1]?.type !== 'ImportDirective')
      ) {
        return fmt + '\n'
      }
      return fmt
    })
    .join('\n')
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

function StringLiteral(node: AST.StringLiteral, _: number) {
  return JSON.stringify(node.value)
}

function UserDefinedTypeName(node: AST.UserDefinedTypeName, _: number) {
  return node.namePath
}

function UsingForDeclaration(node: AST.UsingForDeclaration, indent: number) {
  const before = formatIndent(indent)
  const items = ['using']
  if (node.libraryName) {
    items.push(node.libraryName)
  }
  if (node.functions.length > 0) {
    const mapped = node.functions.map((fn, i) => {
      const operator = node.operators[i]
      return operator ? `${fn} as ${operator}` : fn
    })
    items.push(
      formatList(mapped, { separator: ', ', prefix: '{ ', suffix: ' }' }),
    )
  }
  items.push('for')
  if (node.typeName) {
    items.push(formatAstNode(node.typeName, indent))
  } else {
    items.push('*')
  }
  if (node.isGlobal) {
    items.push('global')
  }
  return `${before}${items.join(' ')};`
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
