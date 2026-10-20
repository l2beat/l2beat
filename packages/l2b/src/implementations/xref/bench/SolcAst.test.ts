import { expect } from 'earl'
import { SolcAst } from './SolcAst'

describe(SolcAst.name, () => {
  it('maps UTF-8 byte offsets from solc to string offsets', () => {
    const text = '// ünïcode\ncontract A {}\n'
    const byteStart = Buffer.byteLength(text.slice(0, text.indexOf('contract')))
    const contract = {
      id: 2,
      nodeType: 'ContractDefinition',
      src: `${byteStart}:13:0`,
      name: 'A',
      contractKind: 'contract',
      linearizedBaseContracts: [2],
      nodes: [],
    }
    const ast = new SolcAst(
      {
        id: 1,
        nodeType: 'SourceUnit',
        src: '0:0:0',
        nodes: [contract],
      } as never,
      text,
    )

    expect(ast.characterRange(contract)).toEqual([
      text.indexOf('contract'),
      text.indexOf('contract') + 13,
    ])
    expect(ast.mainContract?.name).toEqual('A')
  })

  it('finds writes in the functions a callable calls', () => {
    const write = {
      id: 7,
      nodeType: 'Assignment',
      src: '0:0:0',
      operator: '=',
      leftHandSide: node(8, 'Identifier', { referencedDeclaration: 30 }),
    }
    const helper = node(20, 'FunctionDefinition', { body: block(6, [write]) })
    const call = node(4, 'FunctionCall', {
      expression: node(5, 'Identifier', { referencedDeclaration: 20 }),
    })
    const caller = node(10, 'FunctionDefinition', { body: block(3, [call]) })
    const ast = new SolcAst(
      node(1, 'SourceUnit', {
        nodes: [node(2, 'ContractDefinition', { nodes: [caller, helper] })],
      }) as never,
      '',
    )

    expect(ast.isWrittenDuring(caller, 30)).toEqual(true)
    expect(ast.isWrittenDuring(caller, 31)).toEqual(false)
  })
})

function node(id: number, nodeType: string, fields: object) {
  return { id, nodeType, src: '0:0:0', ...fields }
}

function block(id: number, statements: object[]) {
  return node(id, 'Block', { statements })
}
