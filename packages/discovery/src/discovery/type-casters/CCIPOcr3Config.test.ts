import { expect } from 'earl'
import { CCIPOcr3Config } from './CCIPOcr3Config'

describe('CCIPOcr3Config', () => {
  it('sorts all oracle-indexed fields using the node p2pId', () => {
    const config = {
      FRoleDON: 1,
      nodes: [
        {
          p2pId: '0xbb',
          signerKey: 'signer-b',
          transmitterKey: 'transmitter-b',
        },
        {
          p2pId: '0xaa',
          signerKey: 'signer-a',
          transmitterKey: 'transmitter-a',
        },
      ],
      // offchainPublicKeys = [0x01, 0xff]
      // peerIds = ["peer-b", "peer-a"]
      // sharedSecretEncryptions.encryptions = [0x02, 0xee]
      offchainConfig:
        '0x' +
        '82020101' +
        '820201ff' +
        '8a0206706565722d62' +
        '8a0206706565722d61' +
        'ba02061a01021a01ee',
    }

    expect(CCIPOcr3Config.cast({}, config)).toEqual({
      FRoleDON: 1,
      nodes: [
        {
          p2pId: '0xaa',
          signerKey: 'signer-a',
          transmitterKey: 'transmitter-a',
        },
        {
          p2pId: '0xbb',
          signerKey: 'signer-b',
          transmitterKey: 'transmitter-b',
        },
      ],
      offchainConfig: {
        offchainPublicKeys: ['0xff', '0x01'],
        peerIds: ['peer-a', 'peer-b'],
        sharedSecretEncryptions: {
          encryptions: ['0xee', '0x02'],
        },
      },
    })
  })

  it('does not reorder partially decoded parallel arrays', () => {
    const config = {
      nodes: [{ p2pId: '0xbb' }, { p2pId: '0xaa' }],
      // Only one peer ID for two nodes.
      offchainConfig: '0x8a0206706565722d62',
    }

    expect(CCIPOcr3Config.cast({}, config)).toEqual({
      nodes: [{ p2pId: '0xbb' }, { p2pId: '0xaa' }],
      offchainConfig: { peerIds: ['peer-b'] },
    })
  })
})
