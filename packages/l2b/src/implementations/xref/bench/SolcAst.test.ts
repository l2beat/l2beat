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
})
