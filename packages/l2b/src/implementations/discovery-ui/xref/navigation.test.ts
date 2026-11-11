import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { FlatWorkspace } from '../../xref/FlatWorkspace'
import { addFlattenerNote } from '../getCode'
import { contractAt, definitionAt, referencesAt } from './navigation'

const IMPLEMENTATION = `contract Box {
    uint256 internal value;
    /*
       Hashed; never changes.
     */
    bytes32 internal constant SEED =
        keccak256("seed;");

    /// @notice Keeps next.
    /**
     * @param next The value to keep.
     */
    function store(uint256 next) external {
        value = next + uint256(SEED);
    }
}
`
const PROXY = `contract Proxy {}
`
const NOTE = addFlattenerNote('')
const NOTE_LINES = NOTE.split('\n').length - 1
const ADDRESS = ChainSpecificAddress(`eth:0x${'1'.repeat(40)}`)

describe('xref navigation', () => {
  const files: Record<string, string> = {
    '/p/.flat/Box/Box.1.sol': IMPLEMENTATION,
    '/p/.flat/Box/Proxy.p.sol': PROXY,
  }
  const workspace = new FlatWorkspace(
    [
      {
        name: 'Box',
        address: ADDRESS,
        type: 'Contract',
        values: {},
        abi: [],
        sourcePaths: ['/p/.flat/Box/Box.1.sol', '/p/.flat/Box/Proxy.p.sol'],
      },
    ],
    (path) => files[path] ?? '',
  )
  // The panel lists the proxy first, so the implementation is source 1.
  const IMPLEMENTATION_SOURCE = 1
  const shown = (offset: number) => NOTE.length + offset

  it('translates panel positions, which sit below the flattener note', () => {
    const use = IMPLEMENTATION.indexOf('value = next')
    const result = definitionAt(
      workspace,
      ADDRESS,
      IMPLEMENTATION_SOURCE,
      shown(use),
    )
    const declaration = IMPLEMENTATION.indexOf('value;')

    expect(result.definitions).toEqual([
      {
        address: ADDRESS,
        name: 'Box',
        label: 'Box.value',
        resolution: 'in-file',
        fileName: 'Box.1.sol',
        line: 2 + NOTE_LINES,
        sourceIndex: IMPLEMENTATION_SOURCE,
        offset: shown(declaration),
        length: 'value'.length,
        alsoIn: 0,
        declaration: {
          line: 2 + NOTE_LINES,
          offset: shown(IMPLEMENTATION.indexOf('    uint256 internal value')),
          text: '    uint256 internal value;',
        },
      },
    ])
  })

  it('peeks whole lines, from the comment above to the end', () => {
    const declarationOf = (use: string) =>
      definitionAt(
        workspace,
        ADDRESS,
        IMPLEMENTATION_SOURCE,
        shown(IMPLEMENTATION.indexOf(use)),
      ).definitions.map((d) => d.declaration)

    expect(declarationOf('SEED)')).toEqual([
      {
        line: 3 + NOTE_LINES,
        offset: shown(IMPLEMENTATION.indexOf('    /*\n')),
        text: '    /*\n       Hashed; never changes.\n     */\n    bytes32 internal constant SEED =\n        keccak256("seed;");',
      },
    ])
    expect(declarationOf('store(')).toEqual([
      {
        line: 9 + NOTE_LINES,
        offset: shown(IMPLEMENTATION.indexOf('    /// @notice')),
        text: IMPLEMENTATION.slice(
          IMPLEMENTATION.indexOf('    /// @notice'),
          IMPLEMENTATION.lastIndexOf('\n}'),
        ),
      },
    ])
  })

  it('answers references in the same coordinates', () => {
    const declaration = IMPLEMENTATION.indexOf('value;')
    const result = referencesAt(
      workspace,
      ADDRESS,
      IMPLEMENTATION_SOURCE,
      shown(declaration),
    )

    expect(
      result.references.map((r) => [r.sourceIndex, r.line, r.offset, r.text]),
    ).toEqual([
      [
        IMPLEMENTATION_SOURCE,
        14 + NOTE_LINES,
        shown(IMPLEMENTATION.indexOf('value = next')),
        'value = next + uint256(SEED);',
      ],
    ])
  })

  it('names the contract an expression holds, if it is in the project', () => {
    const outside = ChainSpecificAddress(`eth:0x${'2'.repeat(40)}`)
    const holder = `contract Holder {
    address internal self;
    address internal outside;

    function f() external {
        self;
        outside;
    }
}
`
    const path = '/p/.flat/Holder.sol'
    const holders = new FlatWorkspace(
      [
        {
          name: 'Holder',
          address: ADDRESS,
          type: 'Contract',
          values: { self: ADDRESS, outside },
          abi: [],
          sourcePaths: [path],
        },
      ],
      () => holder,
    )
    const at = (use: string) =>
      contractAt(holders, ADDRESS, 0, shown(holder.indexOf(use)))

    expect(at('self;')).toEqual({
      symbol: 'self',
      address: ADDRESS,
      name: 'Holder',
    })
    expect(at('outside;')).toEqual({
      symbol: 'outside',
      address: outside,
      name: undefined,
    })
  })

  it('finds nothing inside the note itself', () => {
    expect(definitionAt(workspace, ADDRESS, 0, 3).definitions).toEqual([])
    expect(referencesAt(workspace, ADDRESS, 0, 3).references).toEqual([])
    expect(contractAt(workspace, ADDRESS, 0, 3).address).toEqual(undefined)
  })
})
