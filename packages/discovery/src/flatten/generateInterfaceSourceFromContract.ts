import { assert } from '@l2beat/shared-pure'
import type * as AST from '@mradomski/fast-solidity-parser'
import type { TopLevelDeclaration } from './ParsedFilesManager'

export function generateInterfaceSourceFromContract(
  contract: TopLevelDeclaration,
): string {
  assert(
    contract.type === 'contract' || contract.type === 'abstract',
    'Only contracts are supported',
  )
  const ast = contract.ast as AST.ContractDefinition

  let result =
    '// NOTE(l2beat): This is a virtual interface, generated from the contract source code.\n'

  result += `interface ${contract.name}`
  if (ast.baseContracts.length > 0) {
    const baseNames = []
    for (const base of ast.baseContracts) {
      if (base.arguments.length > 0) {
        throw new Error('Base contract with arguments are not supported')
      }

      baseNames.push(base.baseName.namePath)
    }

    result += ` is ${baseNames.join(', ')}`
  }

  result += ' {'

  const elements: string[][] = []
  const padding = '    '
  for (const childGeneric of ast.subNodes) {
    const child = childGeneric as AST.ASTNode

    switch (child.type) {
      case 'FunctionDefinition': {
        if (child.isConstructor) {
          continue
        }

        elements.push([child.type, padding + formatFunctionDefinition(child)])
        break
      }
      case 'EventDefinition': {
        elements.push([child.type, padding + formatEventDefinition(child)])
        break
      }
      case 'CustomErrorDefinition': {
        elements.push([child.type, padding + formatErrorDefinition(child)])
        break
      }
      case 'StructDefinition': {
        elements.push([
          child.type,
          padding + formatStructDefinition(child, padding),
        ])
        break
      }
      case 'EnumDefinition': {
        elements.push([
          child.type,
          padding + formatEnumDefinition(child, padding),
        ])
        break
      }
      case 'UsingForDeclaration': {
        // NOTE(radomski): Using for declaration is not supported in interfaces
        break
      }
      case 'StateVariableDeclaration': {
        // NOTE(radomski): State variables are not supported in interfaces
        break
      }
      case 'ModifierDefinition': {
        // NOTE(radomski): Modifiers are not supported in interfaces
        break
      }
      default: {
        console.log(`Skipping: ${child.type}`)
      }
    }
  }

  if (elements.length > 0) {
    result += '\n'
    let prevType: string | undefined
    for (const [type, element] of elements) {
      if (prevType !== undefined && prevType !== type) {
        result += '\n'
      }

      result += element + '\n'

      prevType = type
    }
  }

  result += '}'

  return result
}

function formatEnumDefinition(
  enumDef: AST.EnumDefinition,
  padding: string,
): string {
  let result = `enum ${enumDef.name} {`
  if (enumDef.members.length > 0) {
    result += '\n'
    for (const [index, member] of enumDef.members.entries()) {
      const isLast = index === enumDef.members.length - 1
      const comma = isLast ? '' : ','

      result += `${padding.repeat(2)}${member.name}${comma}\n`
    }
  }
  result += `${padding}}`
  return result
}

function formatStructDefinition(
  struct: AST.StructDefinition,
  padding: string,
): string {
  let result = `struct ${struct.name} {`
  if (struct.members.length > 0) {
    result += '\n'
    for (const member of struct.members) {
      result += `${padding.repeat(2)}${formatParameter(member)};\n`
    }
  }
  result += `${padding}}`
  return result
}

function formatErrorDefinition(error: AST.CustomErrorDefinition): string {
  let result = `error ${error.name}(`

  if (error.parameters.length > 0) {
    const params = []
    for (const param of error.parameters) {
      params.push(formatParameter(param))
    }
    result += params.join(', ')
  }

  result += ');'
  return result
}

function formatEventDefinition(event: AST.EventDefinition): string {
  let result = `event ${event.name}(`
  if (event.parameters.length > 0) {
    const params = []
    for (const param of event.parameters) {
      params.push(formatParameter(param))
    }
    result += params.join(', ')
  }
  result += ');'
  return result
}

function formatFunctionDefinition(fn: AST.FunctionDefinition): string {
  let prefix = `function ${fn.name}`
  prefix = fn.isReceiveEther ? 'receive' : prefix
  prefix = fn.isFallback ? 'fallback' : prefix

  let declaration = `${prefix}(`
  if (fn.parameters.length > 0) {
    const params = []
    for (const param of fn.parameters) {
      params.push(formatParameter(param))
    }
    declaration += params.join(', ')
  }
  declaration += ')'

  const addons = ['external']
  if (fn.stateMutability !== null) {
    addons.push(fn.stateMutability)
  }
  if (fn.override !== null) {
    let value = 'override'
    const args = fn.override.map((x) => x.namePath)
    if (args.length > 0) {
      value += `(${args.join(', ')})`
    }
    addons.push(value)
  }
  if (addons.length > 0) {
    declaration += ` ${addons.join(' ')}`
  }

  if (fn.returnParameters !== null) {
    const returns = []
    for (const param of fn.returnParameters) {
      returns.push(formatParameter(param))
    }
    declaration += ` returns (${returns.join(', ')})`
  }

  declaration += ';'
  return declaration
}

function formatParameter(param: AST.VariableDeclaration): string {
  assert(param.typeName !== null, 'Parameter must have a type')
  let result = `${formatTypeName(param.typeName)}`
  if (param.storageLocation !== null) {
    result += ` ${param.storageLocation}`
  }
  if (param.identifier !== null) {
    result += ` ${param.identifier.name}`
  }

  return result
}

function formatTypeName(typeName: AST.TypeName): string {
  switch (typeName.type) {
    case 'ElementaryTypeName': {
      return typeName.name
    }
    case 'UserDefinedTypeName': {
      return typeName.namePath
    }
    case 'Mapping': {
      return `mapping(${formatTypeName(typeName.keyType)} => ${formatTypeName(
        typeName.valueType,
      )})`
    }
    case 'ArrayTypeName': {
      const baseType = formatTypeName(typeName.baseTypeName)
      if (typeName.length === null) {
        return `${baseType}[]`
      }
      return `${baseType}[${formatExpression(typeName.length)}]`
    }
    case 'FunctionTypeName': {
      let declaration = 'function('
      const params = []
      for (const param of typeName.parameterTypes) {
        assert(param.typeName !== null, 'Function parameter must have a type')
        params.push(formatTypeName(param.typeName))
      }

      declaration += params.join(', ')
      declaration += ')'

      if (typeName.returnTypes !== null) {
        const returns = []
        for (const returnType of typeName.returnTypes) {
          assert(
            returnType.typeName !== null,
            'Function return type must have a type',
          )
          returns.push(formatTypeName(returnType.typeName))
        }
        declaration += ` returns (${returns.join(', ')})`
      }

      return declaration
    }
  }
}

function formatExpression(expression: AST.Expression): string {
  switch (expression.type) {
    case 'NumberLiteral':
      return expression.number
    case 'Identifier':
      return expression.name
    case 'StringLiteral':
      return `"${expression.value}"`
    default: {
      console.log('Unsupported expression type: ', expression.type)
    }
  }

  return ''
}
