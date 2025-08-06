import type * as AST from '@mradomski/fast-solidity-parser'
import { parse } from '@mradomski/fast-solidity-parser'

export function format(source: string) {
  return formatAst(parse(source))
}

function formatAst(ast: AST.ASTNode) {
  const out = new OutputStream()
  formatAstNode(ast, out)
  return out.finish()
}

function formatAstNode(node: AST.ASTNode, out: OutputStream): void {
  return FORMATTERS[node.type](node as never, out)
}

type Formatter<T> = (
  node: Extract<AST.ASTNode, { type: T }>,
  out: OutputStream,
) => void

function DoesNotExistSkip() {}

const FORMATTERS: { [K in AST.ASTNode['type']]: Formatter<K> } = {
  ArrayTypeName,
  AssemblyAssignment,
  AssemblyBlock,
  AssemblyCall,
  AssemblyCase,
  AssemblyFor,
  AssemblyFunctionDefinition,
  AssemblyIf,
  AssemblyLocalDefinition,
  AssemblyMemberAccess,
  AssemblyStackAssignment: DoesNotExistSkip,
  AssemblySwitch,
  BinaryOperation,
  Block,
  BooleanLiteral,
  Break,
  BreakStatement,
  CatchClause,
  Conditional,
  Continue,
  ContinueStatement,
  ContractDefinition,
  CustomErrorDefinition,
  DecimalNumber,
  DoWhileStatement,
  ElementaryTypeName,
  EmitStatement,
  EnumDefinition,
  EnumValue,
  EventDefinition,
  ExpressionStatement,
  FileLevelConstant,
  ForStatement,
  FunctionCall,
  FunctionDefinition,
  FunctionTypeName,
  HexLiteral,
  HexNumber,
  Identifier,
  IfStatement,
  ImportDirective,
  IndexAccess,
  IndexRangeAccess,
  InheritanceSpecifier,
  InlineAssemblyStatement,
  LabelDefinition: DoesNotExistSkip,
  Mapping,
  MemberAccess,
  ModifierDefinition,
  ModifierInvocation,
  NameValueExpression,
  NameValueList,
  NewExpression,
  NumberLiteral,
  PragmaDirective,
  ReturnStatement,
  RevertStatement,
  SourceUnit,
  StateVariableDeclaration,
  StringLiteral,
  StructDefinition,
  ThrowStatement: DoesNotExistSkip,
  TryStatement,
  TupleExpression,
  TypeDefinition,
  UnaryOperation,
  UncheckedStatement,
  UserDefinedTypeName,
  UsingForDeclaration,
  VariableDeclaration,
  VariableDeclarationStatement,
  WhileStatement,
}

function ArrayTypeName(node: AST.ArrayTypeName, out: OutputStream) {
  formatAstNode(node.baseTypeName, out)
  out.noSpace()
  out.token('[')
  if (node.length) {
    formatAstNode(node.length, out)
  }
  out.token(']')
}

function AssemblyAssignment(node: AST.AssemblyAssignment, out: OutputStream) {
  out.beginLine()
  formatNodeList(node.names, out, { separator: ',' })
  // TODO: parser error
  if (node.expression) {
    out.token(':=')
    formatAstNode(node.expression, out)
  }
  out.endLine()
}

function AssemblyBlock(node: AST.AssemblyBlock, out: OutputStream) {
  out.token('{')
  if (node.operations.length > 0) {
    out.pushIndent()
    out.beginLine()
    for (const operation of node.operations) {
      formatAstNode(operation, out)
    }
    out.endLine()
    out.popIndent()
  }
  out.token('}')
  out.endLine()
}

function AssemblyCall(node: AST.AssemblyCall, out: OutputStream) {
  out.token(node.functionName)
  out.noSpace()
  formatNodeList(node.arguments, out, {
    separator: ',',
    prefix: '(',
    suffix: ')',
  })
}

function AssemblyCase(node: AST.AssemblyCase, out: OutputStream) {
  out.token(node.default ? 'default' : 'case')
  if (node.value) {
    formatAstNode(node.value, out)
  }
  formatAstNode(node.block, out)
}

function AssemblyFor(node: AST.AssemblyFor, out: OutputStream) {
  out.beginLine()
  out.token('for')
  out.pushIndent()
  out.beginLine()
  formatAstNode(node.pre, out)
  out.beginLine()
  formatAstNode(node.condition, out)
  out.beginLine()
  formatAstNode(node.post, out)
  out.popIndent()
  formatAstNode(node.body, out)
  out.endLine()
}

function AssemblyFunctionDefinition(
  node: AST.AssemblyFunctionDefinition,
  out: OutputStream,
) {
  out.beginLine()
  out.token('function')
  out.token(node.name)
  out.noSpace()
  out.token('(')
  formatNodeList(node.arguments, out, { separator: ',' })
  out.token(')')
  if (node.returnArguments.length > 0) {
    out.token('->')
    formatNodeList(node.returnArguments, out, { separator: ',' })
  }
  formatAstNode(node.body, out)
  out.endLine()
}

function AssemblyIf(node: AST.AssemblyIf, out: OutputStream) {
  out.beginLine()
  out.token('if')
  formatAstNode(node.condition, out)
  // TODO(radomski): The types in the fast-solidity-parser are wrong as they
  // are taken from the solidity-parser package verbatim. This check here
  // shouldn't be present anyway because we depended on a bug inside the
  // parser and now the hashes in the shapes expect that the output will
  // contain this bug artifact.
  // This can be removed once we have a script that goes over all the shapes
  // and updates their hash with the new flattener version.
  //
  // @ts-ignore: This can be Identifier, the types are wrong
  if (node.condition.type === 'Identifier') {
    out.noSpace()
  }
  formatAstNode(node.body, out)
  out.endLine()
}

function AssemblyLocalDefinition(
  node: AST.AssemblyLocalDefinition,
  out: OutputStream,
) {
  out.beginLine()
  out.token('let')
  formatNodeList(node.names, out, { separator: ',' })
  if (node.expression) {
    out.token(':=')
    formatAstNode(node.expression, out)
  }
  out.endLine()
}

function AssemblyMemberAccess(
  node: AST.AssemblyMemberAccess,
  out: OutputStream,
) {
  formatAstNode(node.expression, out)
  out.noSpace()
  out.token('.')
  out.noSpace()
  formatAstNode(node.memberName, out)
}

function AssemblySwitch(node: AST.AssemblySwitch, out: OutputStream) {
  out.beginLine()
  out.token('switch')
  formatAstNode(node.expression, out)
  out.pushIndent()
  out.beginLine()
  for (const caseStatement of node.cases) {
    formatAstNode(caseStatement, out)
  }
  out.popIndent()
  out.endLine()
}

function BinaryOperation(node: AST.BinaryOperation, out: OutputStream) {
  formatAstNode(node.left, out)
  out.token(node.operator)
  formatAstNode(node.right, out)
}

function Block(
  node: AST.Block,
  out: OutputStream,
  options = { noEndLine: false },
) {
  out.token('{')
  out.pushIndent()
  for (const n of node.statements) {
    formatAstNode(n as AST.ASTNode, out)
  }
  out.popIndent()
  out.token('}')
  if (!options.noEndLine) {
    out.endLine()
  }
}

function BooleanLiteral(node: AST.BooleanLiteral, out: OutputStream) {
  out.token(node.value ? 'true' : 'false')
}

function Break(_: AST.Break, out: OutputStream) {
  out.token('break')
}

function BreakStatement(_: AST.BreakStatement, out: OutputStream) {
  out.beginLine()
  out.token('break')
  out.token(';')
  out.endLine()
}

function CatchClause(node: AST.CatchClause, out: OutputStream) {
  out.token('catch')
  if (node.kind) {
    out.token(node.kind)
  }
  if (node.parameters) {
    if (node.kind) {
      out.noSpace()
    }
    formatNodeList(node.parameters, out, {
      separator: ',',
      prefix: '(',
      suffix: ')',
    })
  }
  Block(wrapBlock(node.body), out, { noEndLine: true })
}

function Conditional(node: AST.Conditional, out: OutputStream) {
  formatAstNode(node.condition, out)
  out.token('?')
  formatAstNode(node.trueExpression, out)
  out.token(':')
  formatAstNode(node.falseExpression, out)
}

function Continue(_: AST.Continue, out: OutputStream) {
  out.token('continue')
}

function ContinueStatement(_: AST.ContinueStatement, out: OutputStream) {
  out.beginLine()
  out.token('continue')
  out.token(';')
  out.endLine()
}

function ContractDefinition(node: AST.ContractDefinition, out: OutputStream) {
  out.beginLine()
  out.token(node.kind === 'abstract' ? 'abstract contract' : node.kind)
  out.token(node.name)

  formatNodeList(node.baseContracts, out, { prefix: 'is', separator: ',' })

  out.token('{')
  out.pushIndent()
  forEachPrevious(node.subNodes, (n, prev) => {
    if (
      prev !== undefined &&
      (n.type === 'FunctionDefinition' ||
        n.type === 'ModifierDefinition' ||
        n.type === 'StructDefinition' ||
        n.type !== prev.type)
    ) {
      out.twoNewLines()
    }
    formatAstNode(n as AST.ASTNode, out)
  })
  out.popIndent()
  out.token('}')
  out.endLine()
}

function CustomErrorDefinition(
  node: AST.CustomErrorDefinition,
  out: OutputStream,
) {
  out.beginLine()
  out.token('error')
  out.token(node.name)
  out.noSpace()
  out.token('(')
  formatNodeList(node.parameters, out, { separator: ',' })
  out.token(')')
  out.token(';')
  out.endLine()
}

function DecimalNumber(node: AST.DecimalNumber, out: OutputStream) {
  out.token(node.value)
}

function DoWhileStatement(node: AST.DoWhileStatement, out: OutputStream) {
  out.beginLine()
  out.token('do')
  Block(wrapBlock(node.body), out, { noEndLine: true })
  out.token('while')
  out.token('(')
  formatAstNode(node.condition, out)
  out.token(')')
  out.token(';')
  out.endLine()
}

function ElementaryTypeName(node: AST.ElementaryTypeName, out: OutputStream) {
  if (node.name === 'uint') {
    out.token('uint256')
  } else if (node.name === 'int') {
    out.token('int256')
  } else {
    out.token(node.name)
  }
  if (node.stateMutability) {
    out.token(node.stateMutability)
  }
}

function EmitStatement(node: AST.EmitStatement, out: OutputStream) {
  out.beginLine()
  out.token('emit')
  formatAstNode(node.eventCall, out)
  out.token(';')
  out.endLine()
}

function EnumDefinition(node: AST.EnumDefinition, out: OutputStream) {
  out.beginLine()
  out.token('enum')
  out.token(node.name)
  out.token('{')
  formatNodeList(node.members, out, { separator: ',' })
  out.token('}')
  out.endLine()
}

function EnumValue(node: AST.EnumValue, out: OutputStream) {
  out.token(node.name)
}

function EventDefinition(node: AST.EventDefinition, out: OutputStream) {
  out.beginLine()
  out.token('event')
  out.token(node.name)
  out.noSpace()
  out.token('(')
  formatNodeList(node.parameters, out, { separator: ',' })
  out.token(')')
  if (node.isAnonymous) {
    out.token('anonymous')
  }
  out.token(';')
  out.endLine()
}

function ExpressionStatement(
  node: AST.ExpressionStatement,
  out: OutputStream,
  options = { inline: false },
) {
  if (!options.inline) {
    out.beginLine()
  }
  if (node.expression) {
    formatAstNode(node.expression, out)
  }
  if (!options.inline) {
    out.token(';')
    out.endLine()
  }
}

function FileLevelConstant(node: AST.FileLevelConstant, out: OutputStream) {
  out.beginLine()
  formatAstNode(node.typeName, out)
  out.token('constant')
  out.token(node.name)
  out.token('=')
  formatAstNode(node.initialValue, out)
  out.token(';')
  out.endLine()
}

function ForStatement(node: AST.ForStatement, out: OutputStream) {
  out.beginLine()
  out.token('for')
  out.token('(')
  if (node.initExpression) {
    if (node.initExpression.type === 'ExpressionStatement') {
      ExpressionStatement(node.initExpression, out, { inline: true })
    } else {
      VariableDeclarationStatement(node.initExpression, out, { inline: true })
    }
  }
  out.token(';')
  if (node.conditionExpression) {
    formatAstNode(node.conditionExpression, out)
  }
  out.token(';')
  ExpressionStatement(node.loopExpression, out, { inline: true })
  out.token(')')
  formatAstNode(wrapBlock(node.body), out)
  out.endLine()
}

function FunctionCall(node: AST.FunctionCall, out: OutputStream) {
  formatAstNode(node.expression, out)
  out.noSpace()
  out.token('(')
  formatNodeList(node.arguments, out, { separator: ',' })
  out.token(')')
}

function FunctionDefinition(node: AST.FunctionDefinition, out: OutputStream) {
  out.beginLine()

  if (node.isConstructor) {
    out.token('constructor')
  } else {
    if (node.isFallback) {
      out.token('fallback')
    } else if (node.isReceiveEther) {
      out.token('receive')
    } else if (node.name) {
      out.token('function')
      out.token(node.name)
    }
  }

  out.noSpace()
  out.token('(')
  formatNodeList(node.parameters, out, { separator: ',' })
  out.token(')')

  if (node.visibility !== 'default') {
    out.token(node.visibility)
  }
  if (node.stateMutability !== null) {
    out.token(node.stateMutability)
  }
  for (const n of node.modifiers) {
    formatAstNode(n, out)
  }
  if (node.isVirtual) {
    out.token('virtual')
  }
  if (node.override) {
    formatOverride(node.override, out)
  }
  if (node.returnParameters && node.returnParameters.length > 0) {
    out.token('returns')
    out.token('(')
    formatNodeList(node.returnParameters, out, { separator: ',' })
    out.token(')')
  }

  if (node.body) {
    formatAstNode(node.body, out)
  } else {
    out.token(';')
  }

  out.endLine()
}

function FunctionTypeName(node: AST.FunctionTypeName, out: OutputStream) {
  out.token('function')
  out.token('(')
  formatNodeList(node.parameterTypes, out, { separator: ',' })
  out.token(')')
  if (node.visibility !== 'default') {
    out.token(node.visibility)
  }
  if (node.stateMutability) {
    out.token(node.stateMutability)
  }
  if (node.returnTypes.length > 0) {
    out.token('returns')
    out.token('(')
    formatNodeList(node.returnTypes, out, { separator: ',' })
    out.token(')')
  }
}

function HexLiteral(node: AST.HexLiteral, out: OutputStream) {
  for (const part of node.parts) {
    out.token(`hex"${part}"`)
  }
}

function HexNumber(node: AST.HexNumber, out: OutputStream) {
  out.token(node.value)
}

function Identifier(node: AST.Identifier, out: OutputStream) {
  out.token(node.name)
}

function IfStatement(
  node: AST.IfStatement,
  out: OutputStream,
  options = { elseIf: false },
) {
  if (!options.elseIf) {
    out.beginLine()
  }
  out.token('if')
  out.token('(')
  formatAstNode(node.condition, out)
  out.token(')')
  Block(wrapBlock(node.trueBody), out, { noEndLine: !!node.falseBody })
  if (node.falseBody) {
    out.token('else')
    if (node.falseBody.type === 'IfStatement') {
      IfStatement(node.falseBody, out, { elseIf: true })
    } else {
      formatAstNode(wrapBlock(node.falseBody), out)
    }
  }
  out.endLine()
}

function ImportDirective(node: AST.ImportDirective, out: OutputStream) {
  out.beginLine()
  out.token('import')
  if (node.unitAliasIdentifier) {
    out.token('*')
    out.token('as')
    formatAstNode(node.unitAliasIdentifier, out)
    out.token('from')
  }

  if (
    node.symbolAliasesIdentifiers &&
    node.symbolAliasesIdentifiers.length > 0
  ) {
    out.token('{')
    forEachSeparator(node.symbolAliasesIdentifiers, (n, separate) => {
      formatAstNode(n[0], out)
      if (n[1]) {
        out.token('as')
        formatAstNode(n[1], out)
      }
      if (separate) {
        out.token(',')
      }
    })
    out.token('}')
    out.token('from')
  }

  formatAstNode(node.pathLiteral, out)

  out.token(';')
  out.endLine()
}

function IndexAccess(node: AST.IndexAccess, out: OutputStream) {
  formatAstNode(node.base, out)
  out.noSpace()
  out.token('[')
  // TODO: parser error
  if (node.index) {
    formatAstNode(node.index, out)
  }
  out.token(']')
}

function IndexRangeAccess(node: AST.IndexRangeAccess, out: OutputStream) {
  formatAstNode(node.base, out)
  out.noSpace()
  out.token('[')
  if (node.indexStart) {
    formatAstNode(node.indexStart, out)
  }
  out.noSpace()
  out.token(':')
  out.noSpace()
  if (node.indexEnd) {
    formatAstNode(node.indexEnd, out)
  }
  out.token(']')
}

function InheritanceSpecifier(
  node: AST.InheritanceSpecifier,
  out: OutputStream,
) {
  formatAstNode(node.baseName, out)
  if (node.arguments.length > 0) {
    out.noSpace()
    formatNodeList(node.arguments, out, {
      separator: ',',
      prefix: '(',
      suffix: ')',
    })
  }
}

function InlineAssemblyStatement(
  node: AST.InlineAssemblyStatement,
  out: OutputStream,
) {
  out.beginLine()
  out.token('assembly')
  if (node.language) {
    out.token(JSON.stringify(node.language))
  }
  if (node.flags.length > 0) {
    out.token('(')
    forEachSeparator(node.flags, (flag, separate) => {
      out.token(JSON.stringify(flag))
      if (separate) {
        out.token(',')
      }
    })
    out.token(')')
  }
  formatAstNode(node.body, out)
  out.endLine()
}

function Mapping(node: AST.Mapping, out: OutputStream) {
  out.token('mapping')
  out.noSpace()
  out.token('(')
  formatAstNode(node.keyType, out)
  if (node.keyName) {
    formatAstNode(node.keyName, out)
  }
  out.token('=>')
  formatAstNode(node.valueType, out)
  if (node.valueName) {
    formatAstNode(node.valueName, out)
  }
  out.token(')')
}

function MemberAccess(node: AST.MemberAccess, out: OutputStream) {
  formatAstNode(node.expression, out)
  out.noSpace()
  out.token('.')
  out.noSpace()
  out.token(node.memberName)
}

function ModifierDefinition(node: AST.ModifierDefinition, out: OutputStream) {
  out.beginLine()
  out.token('modifier')
  out.token(node.name)
  if (node.parameters) {
    out.noSpace()
    out.token('(')
    formatNodeList(node.parameters, out, { separator: ',' })
    out.token(')')
  }
  if (node.isVirtual) {
    out.token('virtual')
  }
  if (node.override) {
    formatOverride(node.override, out)
  }
  if (node.body) {
    formatAstNode(node.body, out)
  } else {
    out.token(';')
  }
  out.endLine()
}

function ModifierInvocation(node: AST.ModifierInvocation, out: OutputStream) {
  out.token(node.name)
  if (node.arguments && node.arguments.length > 0) {
    out.noSpace()
    formatNodeList(node.arguments, out, {
      separator: ',',
      prefix: '(',
      suffix: ')',
    })
  }
}

function NameValueExpression(node: AST.NameValueExpression, out: OutputStream) {
  formatAstNode(node.expression, out)
  out.noSpace()
  formatAstNode(node.arguments, out)
}

function NameValueList(node: AST.NameValueList, out: OutputStream) {
  out.token('{')
  out.noSpace()
  forEachSeparator(node.identifiers, (n, separate, i) => {
    const value = node.arguments[i]
    formatAstNode(n, out)
    if (value) {
      out.noSpace()
      out.token(':')
      formatAstNode(value, out)
    }
    if (separate) {
      out.token(',')
    }
  })
  out.noSpace()
  out.token('}')
}

function NewExpression(node: AST.NewExpression, out: OutputStream) {
  out.token('new')
  formatAstNode(node.typeName, out)
}

function NumberLiteral(node: AST.NumberLiteral, out: OutputStream) {
  out.token(node.number)
  if (node.subdenomination) {
    out.token(node.subdenomination)
  }
}

function PragmaDirective(node: AST.PragmaDirective, out: OutputStream) {
  out.beginLine()
  out.token('pragma')
  out.token(node.name)
  out.token(node.value)
  out.token(';')
  out.endLine()
}

function ReturnStatement(node: AST.ReturnStatement, out: OutputStream) {
  out.beginLine()
  out.token('return')
  if (node.expression) {
    formatAstNode(node.expression, out)
  }
  out.token(';')
  out.endLine()
}

function RevertStatement(node: AST.RevertStatement, out: OutputStream) {
  out.beginLine()
  out.token('revert')
  // TODO: Incorrect parser types!
  // @ts-ignore
  if (node.revertCall.type === 'TupleExpression') {
    out.noSpace()
  }
  formatAstNode(node.revertCall, out)
  out.token(';')
  out.endLine()
}

function SourceUnit(node: AST.SourceUnit, out: OutputStream) {
  forEachPrevious(node.children, (n, prev) => {
    if (
      prev !== undefined &&
      (n.type !== 'ImportDirective' || prev.type !== 'ImportDirective')
    ) {
      out.twoNewLines()
    }
    formatAstNode(n, out)
  })
}

function StateVariableDeclaration(
  node: AST.StateVariableDeclaration,
  out: OutputStream,
) {
  for (const n of node.variables) {
    out.beginLine()
    formatAstNode(n, out)
    out.token(';')
    out.endLine()
  }
}

function StringLiteral(node: AST.StringLiteral, out: OutputStream) {
  for (const part of node.parts) {
    out.token(
      '"' + part.replaceAll(/\\?"/g, '\\"').replaceAll(/\\?'/g, "'") + '"',
    )
  }
}

function StructDefinition(node: AST.StructDefinition, out: OutputStream) {
  out.beginLine()
  out.token('struct')
  out.token(node.name)
  out.token('{')
  out.pushIndent()
  for (const n of node.members) {
    out.beginLine()
    formatAstNode(n, out)
    out.token(';')
    out.endLine()
  }
  out.popIndent()
  out.token('}')
  out.endLine()
}

function TryStatement(node: AST.TryStatement, out: OutputStream) {
  out.beginLine()
  out.token('try')
  formatAstNode(node.expression, out)
  if (node.returnParameters) {
    out.token('returns')
    formatNodeList(node.returnParameters, out, {
      separator: ',',
      prefix: '(',
      suffix: ')',
    })
  }
  Block(wrapBlock(node.body), out, { noEndLine: true })
  for (const catchClause of node.catchClauses) {
    formatAstNode(catchClause, out)
  }
  out.endLine()
}

function TupleExpression(node: AST.TupleExpression, out: OutputStream) {
  out.token('(')
  forEachSeparator(node.components, (n, separate) => {
    if (n) {
      formatAstNode(n as AST.ASTNode, out)
    }
    if (separate) {
      out.token(',')
    }
  })
  out.token(')')
}

function TypeDefinition(node: AST.TypeDefinition, out: OutputStream) {
  out.beginLine()
  out.token('type')
  out.token(node.name)
  out.token('is')
  formatAstNode(node.definition, out)
  out.token(';')
  out.endLine()
}

function UnaryOperation(node: AST.UnaryOperation, out: OutputStream) {
  if (node.isPrefix) {
    out.token(node.operator)
    if (node.operator !== 'delete') {
      out.noSpace()
    }
  }
  formatAstNode(node.subExpression, out)
  if (!node.isPrefix) {
    out.noSpace()
    out.token(node.operator)
  }
}

function UncheckedStatement(node: AST.UncheckedStatement, out: OutputStream) {
  out.beginLine()
  out.token('unchecked')
  Block(wrapBlock(node.block), out)
}

function UserDefinedTypeName(node: AST.UserDefinedTypeName, out: OutputStream) {
  out.token(node.namePath)
}

function UsingForDeclaration(node: AST.UsingForDeclaration, out: OutputStream) {
  out.beginLine()
  out.token('using')
  if (node.libraryName) {
    out.token(node.libraryName)
  }
  if (node.functions.length > 0) {
    out.token('{')
    forEachSeparator(node.functions, (name, separate, i) => {
      out.token(name)
      const operator = node.operators[i]
      if (operator) {
        out.token('as')
        out.token(operator)
      }
      if (separate) {
        out.token(',')
      }
    })
    out.token('}')
  }
  out.token('for')
  if (node.typeName) {
    formatAstNode(node.typeName, out)
  } else {
    out.token('*')
  }
  if (node.isGlobal) {
    out.token('global')
  }
  out.token(';')
  out.endLine()
}

function VariableDeclaration(node: AST.VariableDeclaration, out: OutputStream) {
  if (node.typeName) {
    formatAstNode(node.typeName, out)
  }
  if (node.visibility && node.visibility !== 'default') {
    out.token(node.visibility)
  }
  if (node.isDeclaredConst) {
    out.token('constant')
  }
  if ('override' in node && node.override) {
    formatOverride(node.override as AST.UserDefinedTypeName[], out)
  }
  if ('isImmutable' in node && node.isImmutable) {
    out.token('immutable')
  }
  if (node.isIndexed) {
    out.token('indexed')
  }
  if (node.storageLocation) {
    out.token(node.storageLocation)
  }
  if (node.identifier) {
    formatAstNode(node.identifier, out)
  }
  if (node.expression) {
    out.token('=')
    formatAstNode(node.expression, out)
  }
}

function VariableDeclarationStatement(
  node: AST.VariableDeclarationStatement,
  out: OutputStream,
  options = { inline: false },
) {
  if (!options.inline) {
    out.beginLine()
  }
  if (node.variables) {
    if (node.variables.length === 1) {
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      formatAstNode(node.variables[0]! as AST.ASTNode, out)
    } else {
      out.token('(')
      forEachSeparator(node.variables, (n, separate) => {
        if (n) {
          formatAstNode(n as AST.ASTNode, out)
        }
        if (separate) {
          out.token(',')
        }
      })
      out.token(')')
    }
  }
  if (node.initialValue) {
    out.token('=')
    formatAstNode(node.initialValue, out)
  }
  if (!options.inline) {
    out.token(';')
    out.endLine()
  }
}

function WhileStatement(node: AST.WhileStatement, out: OutputStream) {
  out.beginLine()
  out.token('while')
  out.token('(')
  formatAstNode(node.condition, out)
  out.token(')')
  formatAstNode(wrapBlock(node.body), out)
  out.endLine()
}

// --- HELPERS ---

class OutputStream {
  constructor(private indent = '\t') {}

  private result = ''

  private level = 0

  private isLineStart = true
  private indented = false
  private hintNoSpace = false

  private previous = ''

  token(token: string) {
    if (this.isLineStart && !this.indented) {
      this.appendRaw(this.indent.repeat(this.level))
    }
    if (
      this.hintNoSpace ||
      this.isLineStart ||
      token === ')' ||
      token === ']' ||
      token === ';' ||
      (token === ',' && this.previous !== ',') ||
      this.previous === '(' ||
      this.previous === '[' ||
      (token === '}' && this.previous === '{')
    ) {
      this.result += token
    } else {
      this.result += ' ' + token
    }
    this.previous = token
    this.hintNoSpace = false
    this.isLineStart = false
    this.indented = false
  }

  noSpace() {
    this.hintNoSpace = true
  }

  private appendRaw(value: string) {
    this.result += value
    this.previous = ''
  }

  pushIndent() {
    this.level += 1
  }

  popIndent() {
    this.level = Math.max(0, this.level - 1)
  }

  beginLine() {
    if (this.isLineStart && this.indented) {
      return
    }
    if (!this.isLineStart) {
      this.appendRaw('\n')
      this.isLineStart = true
    }
    if (!this.indented) {
      this.appendRaw(this.indent.repeat(this.level))
      this.indented = true
    }
  }

  twoNewLines() {
    this.endLine()
    this.appendRaw('\n')
  }

  endLine() {
    if (!this.isLineStart) {
      this.appendRaw('\n')
      this.isLineStart = true
    }
  }

  finish() {
    return this.result.trimEnd()
  }
}

function forEachPrevious<T>(
  values: T[],
  callback: (item: T, previous: T | undefined, i: number) => unknown,
) {
  for (let i = 0; i < values.length; i++) {
    // biome-ignore lint/style/noNonNullAssertion: we know it's there
    if (callback(values[i]!, values[i - 1], i) === true) {
      break
    }
  }
}

function forEachSeparator<T>(
  values: T[],
  callback: (item: T, separate: boolean, i: number) => unknown,
) {
  for (let i = 0; i < values.length; i++) {
    // biome-ignore lint/style/noNonNullAssertion: we know it's there
    if (callback(values[i]!, i !== values.length - 1, i) === true) {
      break
    }
  }
}

function formatNodeList(
  nodes: AST.ASTNode[],
  out: OutputStream,
  options: { prefix?: string; suffix?: string; separator: string },
) {
  if (options.prefix && nodes.length > 0) {
    out.token(options.prefix)
  }
  forEachSeparator(nodes, (n, separate) => {
    formatAstNode(n, out)
    if (separate) {
      out.token(options.separator)
    }
  })
  if (options.suffix && nodes.length > 0) {
    out.token(options.suffix)
  }
}

function formatOverride(
  override: AST.UserDefinedTypeName[],
  out: OutputStream,
) {
  out.token('override')
  if (override.length > 0) {
    out.noSpace()
    formatNodeList(override, out, {
      separator: ',',
      prefix: '(',
      suffix: ')',
    })
  }
}

function wrapBlock(node: AST.ASTNode): AST.Block {
  if (node.type !== 'Block') {
    return {
      type: 'Block',
      statements: [node],
    }
  }
  return node
}
