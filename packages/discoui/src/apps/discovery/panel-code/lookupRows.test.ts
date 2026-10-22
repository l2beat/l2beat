import { expect } from 'earl'
import type { ApiDefinition, ApiReference } from '../../../api/types'
import { peekContent, rowsOf, title } from './lookupRows'

const DEFINITION: ApiDefinition = {
  address: 'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
  name: 'Bridge',
  label: 'AbsBridge.sequencerMessageCount',
  resolution: 'discovered-value',
  fileName: 'Bridge.sol',
  line: 864,
  sourceIndex: 1,
  offset: 31653,
  length: 21,
  alsoIn: 0,
  declaration: {
    line: 863,
    offset: 31600,
    text: '    /// @notice The count.\n    uint256 public sequencerMessageCount;',
  },
}

const REFERENCE: ApiReference = {
  address: 'eth:0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6',
  name: 'SequencerInbox',
  fileName: 'SequencerInbox.sol',
  line: 1849,
  sourceIndex: 1,
  offset: 70000,
  length: 21,
  resolution: 'discovered-value',
  isCall: true,
  elsewhere: false,
  text: 'return bridge.sequencerMessageCount();',
  copies: 0,
}

describe('lookup rows', () => {
  it('describes where each definition is and how it was found', () => {
    const lookup = {
      status: 'definitions' as const,
      response: {
        symbol: 'bridge.sequencerMessageCount',
        receiver: undefined,
        definitions: [DEFINITION, { ...DEFINITION, alsoIn: 2 }],
      },
    }

    expect(rowsOf(lookup).map((row) => row.detail)).toEqual([
      'Bridge eth:0x8315…ed3a · Bridge.sol:864 · from discovered.json',
      'Bridge eth:0x8315…ed3a · Bridge.sol:864 · from discovered.json · same code in 2 more',
    ])
    expect(title(lookup)).toEqual('bridge.sequencerMessageCount: 2 candidates')
  })

  it('shows references by their code, marking calls and copies', () => {
    const lookup = {
      status: 'references' as const,
      response: {
        symbol: 'AbsBridge.sequencerMessageCount',
        definitions: [DEFINITION],
        references: [
          REFERENCE,
          { ...REFERENCE, isCall: false, elsewhere: true, copies: 3 },
        ],
      },
    }

    expect(rowsOf(lookup).map((row) => [row.headline, row.detail])).toEqual([
      [
        'return bridge.sequencerMessageCount();',
        'SequencerInbox · SequencerInbox.sol:1849 · call · from discovered.json',
      ],
      [
        'return bridge.sequencerMessageCount();',
        'SequencerInbox · SequencerInbox.sol:1849 · same code in another contract · also in 3 identical files',
      ],
    ])
    expect(title(lookup)).toEqual(
      'AbsBridge.sequencerMessageCount: 2 references',
    )
  })

  it('peeks a definition at its place in the file', () => {
    const onOpen = () => {}

    expect(peekContent(DEFINITION, onOpen)).toEqual({
      key: 'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a:1:31653',
      title: 'AbsBridge.sequencerMessageCount',
      location: 'Bridge.sol lines 863–864',
      owner: 'Bridge eth:0x8315…ed3a',
      text: DEFINITION.declaration.text,
      firstLine: 863,
      origin: { address: DEFINITION.address, sourceIndex: 1, offset: 31600 },
      onOpen,
    })
  })

  it('explains empty answers', () => {
    const none = {
      status: 'definitions' as const,
      response: {
        symbol: 'target.ping',
        receiver: { address: DEFINITION.address, name: undefined },
        definitions: [],
      },
    }
    const nothing = {
      status: 'references' as const,
      response: { symbol: '', definitions: [], references: [] },
    }

    expect(title(none)).toEqual(
      'No definition found for target.ping (eth:0x8315…ed3a)',
    )
    expect(title(nothing)).toEqual('Nothing to find references for here')
    expect(title({ status: 'failed' })).toEqual('Could not resolve this')
  })
})
