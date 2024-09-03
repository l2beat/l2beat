import type * as AST from '@mradomski/fast-solidity-parser'

export function formatAst(ast: AST.ASTNode) {
  return formatAstNode(ast, 0) + '\n\n'
}

export function formatAstNode(node: AST.ASTNode, indent: number): string {
  return FORMATTERS[node.type](node as never, indent)
}

function formatIndent(indent: number) {
  return ' '.repeat(indent * 4)
}

type Formatter<T> = (
  node: Extract<AST.ASTNode, { type: T }>,
  indent: number,
) => string

const __REPLACE_ME__ = (node: AST.ASTNode, indent: number) =>
  `${formatIndent(indent)}${node.type}`

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
  Block: __REPLACE_ME__,
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
  ElementaryTypeName: __REPLACE_ME__,
  EmitStatement: __REPLACE_ME__,
  EnumDefinition: __REPLACE_ME__,
  EnumValue: __REPLACE_ME__,
  EventDefinition: __REPLACE_ME__,
  ExpressionStatement: __REPLACE_ME__,
  FileLevelConstant: __REPLACE_ME__,
  ForStatement: __REPLACE_ME__,
  FunctionCall: __REPLACE_ME__,
  FunctionDefinition: __REPLACE_ME__,
  FunctionTypeName: __REPLACE_ME__,
  HexLiteral: __REPLACE_ME__,
  HexNumber: __REPLACE_ME__,
  Identifier: __REPLACE_ME__,
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
  VariableDeclaration: __REPLACE_ME__,
  VariableDeclarationStatement: __REPLACE_ME__,
  WhileStatement: __REPLACE_ME__,
}

function ContractDefinition(node: AST.ContractDefinition, indent: number) {
  const begin = formatIndent(indent)
  const type = node.kind === 'abstract' ? 'abstract contract' : node.kind

  const baseContracts = []
  for (const contract of node.baseContracts) {
    baseContracts.push(formatAstNode(contract, indent))
  }

  const base = baseContracts.length > 0 ? `is ${baseContracts.join(', ')} ` : ''

  const statements = node.subNodes.map((n) =>
    formatAstNode(n as AST.ASTNode, indent + 1),
  )

  const statementsFmt =
    statements.length > 0 ? `\n${statements.join('\n')}\n` : ''

  return `${begin}${type} ${node.name} ${base}{${statementsFmt}}`
}

function InheritanceSpecifier(node: AST.InheritanceSpecifier, indent: number) {
  const base = formatAstNode(node.baseName, indent)
  if (node.arguments.length === 0) {
    return base
  }
  return `${base}(${node.arguments
    .map((n) => formatAstNode(n, indent))
    .join(', ')})`
}

function SourceUnit(node: AST.SourceUnit, indent: number) {
  return node.children.map((node) => formatAstNode(node, indent)).join('\n\n')
}

function StateVariableDeclaration(
  node: AST.StateVariableDeclaration,
  indent: number,
) {
  return node.variables.map((n) => formatAstNode(n, indent)).join('\n')
}

function UserDefinedTypeName(node: AST.UserDefinedTypeName, _: number) {
  return node.namePath
}
