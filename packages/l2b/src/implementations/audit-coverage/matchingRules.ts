import type { Rule } from '@l2beat/discovery'

export function renameDeclaration(from: string, to: string): Rule {
  return (node) => {
    switch (node.type) {
      case 'ContractDefinition':
      case 'FunctionDefinition':
      case 'Identifier':
      case 'ModifierInvocation':
        if (node.name === from) {
          node.name = to
        }
        return
      case 'UserDefinedTypeName':
        if (node.namePath === from) {
          node.namePath = to
        } else if (node.namePath.startsWith(`${from}.`)) {
          node.namePath = `${to}${node.namePath.slice(from.length)}`
        }
        return
    }
  }
}

export function setContractKind(name: string, kind: string): Rule {
  return (node) => {
    if (node.type === 'ContractDefinition' && node.name === name) {
      node.kind = kind
    }
  }
}

export const canonicalByteType: Rule = (node) => {
  if (node.type === 'ElementaryTypeName' && node.name === 'byte') {
    node.name = 'bytes1'
  }
}

export const hexLiteralsWithoutUnderscores: Rule = (node) => {
  if (node.type === 'HexLiteral') {
    node.value = withoutUnderscores(node.value)
    node.parts = node.parts.map(withoutUnderscores)
  }
}

function withoutUnderscores(value: string): string {
  return value.split('_').join('')
}
