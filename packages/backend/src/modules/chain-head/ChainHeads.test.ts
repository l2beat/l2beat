import { Logger } from '@l2beat/backend-tools'
import type { IRpcClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { mockDatabase } from '../../test/database'
import { ChainHeads } from './ChainHeads'

const READER = { batchSize: 100, keepFor: 4 * UnixTime.HOUR }

describe(ChainHeads.name, () => {
  describe(ChainHeads.prototype.get.name, () => {
    it('gives every reader of a chain the same head', () => {
      const heads = chainHeads(['base', 'optimism'])

      const first = heads.get('base', READER)
      const second = heads.get('base', READER)

      expect(first).not.toEqual(undefined)
      expect(second === first).toEqual(true)
      expect(heads.get('optimism', READER) === first).toEqual(false)
    })

    it('has no head for a chain with no RPC to follow', () => {
      const heads = chainHeads(['base'])

      expect(heads.get('starknet', READER)).toEqual(undefined)
      expect(heads.all()).toEqual([])
    })
  })

  describe(ChainHeads.prototype.all.name, () => {
    it('lists the heads that were asked for, each once', () => {
      const heads = chainHeads(['base', 'optimism', 'arbitrum'])
      const base = heads.get('base', READER)
      const optimism = heads.get('optimism', READER)
      heads.get('base', READER)

      const all = heads.all()

      expect(all.length).toEqual(2)
      expect(all[0] === base && all[1] === optimism).toEqual(true)
    })
  })
})

function chainHeads(chains: string[]) {
  return new ChainHeads({
    rpcClients: chains.map((chain) => mockObject<IRpcClient>({ chain })),
    db: mockDatabase(),
    logger: Logger.SILENT,
  })
}
