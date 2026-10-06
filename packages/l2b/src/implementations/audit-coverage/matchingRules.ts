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
