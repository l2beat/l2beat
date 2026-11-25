import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type GasFeesWalletTipRecord,
  GasFeesWalletTipRepository,
} from './GasFeesWalletTipRepository'

describeDatabase(GasFeesWalletTipRepository.name, (db) => {
  const repository = db.gasFeesWalletTip

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('keeps the last read of each option and deletes old reads', async () => {
    await repository.upsertMany([
      tip('Rabby', 'fast', 100),
      tip('MetaMask', 'high', 100),
    ])
    await repository.upsertMany([tip('MetaMask', 'high', 200)])

    expect(await repository.deleteReadBefore(UnixTime(150))).toEqual(1)
    expect(await repository.getAll()).toEqual([tip('MetaMask', 'high', 200)])
  })
})

function tip(
  wallet: GasFeesWalletTipRecord['wallet'],
  option: string,
  readAt: number,
): GasFeesWalletTipRecord {
  return { wallet, option, tier: 'fast', tipGwei: 2, readAt: UnixTime(readAt) }
}
