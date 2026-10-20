import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { FlatWorkspace } from '../FlatWorkspace'
import { type RpcMessage, XrefLanguageServer } from './XrefLanguageServer'

const ROLLUP = `interface IBridge {
    function count() external view returns (uint256);
}

contract Rollup {
    IBridge public bridge;

    function run() external view returns (uint256) {
        return bridge.count();
    }
}
`

const BRIDGE = `contract Bridge {
    function count() external view returns (uint256) {
        return 1;
    }
}
`

const ROLLUP_PATH = '/p/rollup/.flat/Rollup.sol'
const BRIDGE_PATH = '/p/rollup/.flat/Bridge.sol'
const BRIDGE_ADDRESS = ChainSpecificAddress(`eth:0x${'2'.repeat(40)}`)

describe(XrefLanguageServer.name, () => {
  const workspace = new FlatWorkspace(
    [
      {
        name: 'Rollup',
        address: ChainSpecificAddress(`eth:0x${'1'.repeat(40)}`),
        type: 'Contract',
        values: { bridge: BRIDGE_ADDRESS },
        abi: [],
        sourcePaths: [ROLLUP_PATH],
      },
      {
        name: 'Bridge',
        address: BRIDGE_ADDRESS,
        type: 'Contract',
        values: {},
        abi: [],
        sourcePaths: [BRIDGE_PATH],
      },
    ],
    (path) => (path === ROLLUP_PATH ? ROLLUP : BRIDGE),
  )
  const position = {
    textDocument: { uri: `file://${ROLLUP_PATH}` },
    position: { line: 8, character: ROLLUP.split('\n')[8]?.indexOf('count') },
  }

  function start() {
    const sent: (RpcMessage & Record<string, unknown>)[] = []
    const exits: number[] = []
    const server = new XrefLanguageServer(
      (path) => (path.includes('/.flat/') ? workspace : undefined),
      (message) => sent.push(message),
      (code) => exits.push(code),
    )
    const request = (id: number, method: string, params?: unknown) => {
      server.receive(JSON.stringify({ jsonrpc: '2.0', id, method, params }))
      return sent[sent.length - 1]
    }
    return { server, request, sent, exits }
  }

  it('advertises definition and hover', () => {
    const { request } = start()

    expect(request(1, 'initialize', {})?.result).toEqual({
      capabilities: {
        positionEncoding: 'utf-16',
        definitionProvider: true,
        hoverProvider: true,
        referencesProvider: true,
      },
      serverInfo: { name: 'l2b-xref' },
    })
  })

  it('answers a definition with the location of the name', () => {
    const { request } = start()

    expect(request(2, 'textDocument/definition', position)?.result).toEqual([
      {
        uri: `file://${BRIDGE_PATH}`,
        range: {
          start: { line: 1, character: 13 },
          end: { line: 1, character: 18 },
        },
      },
    ])
  })

  it('shows the resolved receiver on hover', () => {
    const { request } = start()
    const hover = request(3, 'textDocument/hover', position)?.result as {
      contents: { value: string }
    }

    expect(hover.contents.value).toEqual(
      [
        '**bridge.count**',
        '',
        `receiver: Bridge ${BRIDGE_ADDRESS}`,
        '- Bridge.count in Bridge, from discovered.json',
      ].join('\n'),
    )
  })

  it('lists references, with the declaration when asked', () => {
    const { request } = start()
    const call = {
      uri: `file://${ROLLUP_PATH}`,
      range: {
        start: { line: 8, character: 22 },
        end: { line: 8, character: 27 },
      },
    }
    const declaration = {
      uri: `file://${BRIDGE_PATH}`,
      range: {
        start: { line: 1, character: 13 },
        end: { line: 1, character: 18 },
      },
    }
    const without = { ...position, context: { includeDeclaration: false } }
    const including = { ...position, context: { includeDeclaration: true } }

    expect(request(8, 'textDocument/references', without)?.result).toEqual([
      call,
    ])
    expect(request(9, 'textDocument/references', including)?.result).toEqual([
      declaration,
      call,
    ])
  })

  it('returns nothing for files outside the discovery', () => {
    const { request } = start()
    const outside = { ...position, textDocument: { uri: 'file:///tmp/A.sol' } }

    expect(request(4, 'textDocument/definition', outside)?.result).toEqual([])
    expect(request(5, 'textDocument/hover', outside)?.result).toEqual(null)
  })

  it('rejects unknown methods and ignores notifications', () => {
    const { server, request, sent } = start()
    server.receive(JSON.stringify({ jsonrpc: '2.0', method: 'initialized' }))

    expect(sent.length).toEqual(0)
    expect(request(6, 'textDocument/rename', position)?.error).toEqual({
      code: -32601,
      message: 'Method not found',
    })
  })

  it('exits cleanly only after shutdown', () => {
    const early = start()
    early.server.receive(JSON.stringify({ jsonrpc: '2.0', method: 'exit' }))
    const clean = start()
    clean.request(7, 'shutdown')
    clean.server.receive(JSON.stringify({ jsonrpc: '2.0', method: 'exit' }))

    expect(early.exits).toEqual([1])
    expect(clean.exits).toEqual([0])
  })
})

describe(`${XrefLanguageServer.name} with identical implementation code`, () => {
  const core = `abstract contract Core {
    function ping() external view returns (uint256) {
        return 1;
    }
}
`
  const caller = `interface IProxy {
    function ping() external view returns (uint256);
}

contract Caller {
    IProxy public target;

    function run() external view returns (uint256) {
        return target.ping();
    }
}
`
  const files: Record<string, string> = {
    '/p/rollup/.flat/Proxy/Admin.1.sol': `${core}\ncontract Admin is Core {}\n`,
    '/p/rollup/.flat/Proxy/User.2.sol': `${core}\ncontract User is Core {}\n`,
    '/p/rollup/.flat/Caller.sol': caller,
  }
  const proxy = ChainSpecificAddress(`eth:0x${'5'.repeat(40)}`)
  const workspace = new FlatWorkspace(
    [
      {
        name: 'Proxy',
        address: proxy,
        type: 'Contract',
        values: {},
        abi: [],
        sourcePaths: [
          '/p/rollup/.flat/Proxy/Admin.1.sol',
          '/p/rollup/.flat/Proxy/User.2.sol',
        ],
      },
      {
        name: 'Caller',
        address: ChainSpecificAddress(`eth:0x${'6'.repeat(40)}`),
        type: 'Contract',
        values: { target: proxy },
        abi: [],
        sourcePaths: ['/p/rollup/.flat/Caller.sol'],
      },
    ],
    (path) => files[path] ?? '',
  )

  it('lists the declaration in every copy when asked', () => {
    const sent: (RpcMessage & Record<string, unknown>)[] = []
    const server = new XrefLanguageServer(
      () => workspace,
      (message) => sent.push(message),
      () => {},
    )
    const line = caller.split('\n').findIndex((l) => l.includes('target.ping'))
    server.receive(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'textDocument/references',
        params: {
          textDocument: { uri: 'file:///p/rollup/.flat/Caller.sol' },
          position: {
            line,
            character: caller.split('\n')[line]?.indexOf('ping'),
          },
          context: { includeDeclaration: true },
        },
      }),
    )
    const result = sent[0]?.result as {
      uri: string
      range: { start: { line: number } }
    }[]

    expect(result.map((l) => `${l.uri}:${l.range.start.line}`)).toEqual([
      'file:///p/rollup/.flat/Proxy/Admin.1.sol:1',
      'file:///p/rollup/.flat/Proxy/User.2.sol:1',
      `file:///p/rollup/.flat/Caller.sol:${line}`,
    ])
  })
})
