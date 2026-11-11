import {
  type Bytes,
  ChainSpecificAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, type MockObject, mockFn, mockObject } from 'earl'
import { type providers, utils } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import { ADMIN_SLOT, IMPLEMENTATION_SLOT } from '../auto/Eip1967Proxy'
import { getUpgradeGatekeeperProxy } from './UpgradeGatekeeperProxy'

describe(getUpgradeGatekeeperProxy.name, () => {
  const ADDRESS = ChainSpecificAddress.random()
  const OTHER = ChainSpecificAddress.random()
  const MASTER = ChainSpecificAddress.random()
  const INITIAL = ChainSpecificAddress.random()
  const CURRENT = ChainSpecificAddress.random()
  const OTHER_TARGET = ChainSpecificAddress.random()
  const DEPLOYMENT_TX = Hash256.random()
  const DEPLOYMENT_BLOCK = 10
  const TIMESTAMP = UnixTime(1_700_000_000)

  const abi = new utils.Interface([
    'event UpgradeComplete(uint256 indexed versionId, address[] newTargets)',
  ])
  const upgradeComplete = (
    blockNumber: number,
    versionId: number,
    newTargets: ChainSpecificAddress[],
  ): providers.Log =>
    ({
      ...abi.encodeEventLog(abi.getEvent('UpgradeComplete'), [
        versionId,
        newTargets.map((t) => ChainSpecificAddress.address(t).toString()),
      ]),
      blockNumber,
      transactionHash: `0x${blockNumber.toString(16).padStart(64, '0')}`,
    }) as providers.Log
  const date = (blockNumber: number) =>
    UnixTime.toDate(UnixTime(TIMESTAMP + blockNumber)).toISOString()
  const ZERO = ChainSpecificAddress.ZERO('ethereum')

  function mockProvider(logs: providers.Log[]): MockObject<IProvider> {
    const storage = (implementation: ChainSpecificAddress) =>
      mockFn((address: ChainSpecificAddress, slot: Bytes) => {
        if (address !== ADDRESS) return Promise.resolve(ZERO)
        if (slot.equals(IMPLEMENTATION_SLOT))
          return Promise.resolve(implementation)
        if (slot.equals(ADMIN_SLOT)) return Promise.resolve(MASTER)
        return Promise.resolve(ZERO)
      })
    return mockObject<IProvider>({
      chain: 'ethereum',
      getStorageAsAddress: storage(CURRENT),
      // a plain object: a mockObject in a promise is probed for .then
      switchBlock: mockFn().resolvesTo({
        chain: 'ethereum',
        getStorageAsAddress: storage(INITIAL),
      } as unknown as IProvider),
      getDeployment: mockFn().resolvesTo({
        deployer: OTHER,
        transactionHash: DEPLOYMENT_TX,
        blockNumber: DEPLOYMENT_BLOCK,
        timestamp: UnixTime(TIMESTAMP + DEPLOYMENT_BLOCK),
      }),
      callMethod: mockFn(
        (address: ChainSpecificAddress, _: string, args: unknown[]): any => {
          const managed = [OTHER, ADDRESS][args[0] as number]
          return Promise.resolve(
            address === MASTER && managed !== undefined
              ? ChainSpecificAddress.address(managed)
              : undefined,
          )
        },
      ),
      getLogs: mockFn((address: ChainSpecificAddress) =>
        Promise.resolve(address === MASTER ? logs : []),
      ),
      getBlock: mockFn((blockNumber: number) =>
        Promise.resolve({
          number: blockNumber,
          timestamp: TIMESTAMP + blockNumber,
        } as providers.Block),
      ),
    })
  }

  it('reads upgrades from the master gatekeeper', async () => {
    const provider = mockProvider([
      upgradeComplete(20, 1, [OTHER_TARGET, ZERO]),
      upgradeComplete(30, 2, [ZERO, CURRENT]),
    ])

    const result = await getUpgradeGatekeeperProxy(provider, ADDRESS)

    expect(provider.getLogs).toHaveBeenOnlyCalledWith(MASTER, [
      abi.getEventTopic('UpgradeComplete'),
    ])
    expect(result).toEqual({
      type: 'UpgradeGatekeeper proxy',
      values: {
        $admin: MASTER.toString(),
        $implementation: CURRENT.toString(),
        $pastUpgrades: [
          [date(DEPLOYMENT_BLOCK), DEPLOYMENT_TX, [INITIAL]],
          [
            date(30),
            Hash256(`0x${(30).toString(16).padStart(64, '0')}`),
            [CURRENT],
          ],
        ],
        $upgradeCount: 2,
      },
    })
  })

  it('keeps only the deployment when the master does not manage it', async () => {
    const provider = mockProvider([upgradeComplete(20, 1, [OTHER_TARGET])])
    provider.callMethod.resolvesTo(undefined)

    const result = await getUpgradeGatekeeperProxy(provider, ADDRESS)

    expect(result?.values.$pastUpgrades).toEqual([
      [date(DEPLOYMENT_BLOCK), DEPLOYMENT_TX, [INITIAL]],
    ])
  })

  it('is not a proxy without an implementation', async () => {
    const provider = mockProvider([])
    provider.getStorageAsAddress.resolvesTo(ZERO)

    expect(await getUpgradeGatekeeperProxy(provider, ADDRESS)).toEqual(
      undefined,
    )
  })

  it('ignores a target list shorter than the index', async () => {
    const provider = mockProvider([
      upgradeComplete(20, 1, [OTHER_TARGET]),
      upgradeComplete(30, 2, [OTHER_TARGET, CURRENT]),
    ])

    const result = await getUpgradeGatekeeperProxy(provider, ADDRESS)

    expect(result?.values.$upgradeCount).toEqual(2)
  })
})
