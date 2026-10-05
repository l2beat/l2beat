import type { EthereumAddress, Log } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { attributeFunders, eventKey } from './attributeFunders'
import {
  ALICE,
  BOB,
  CURVE_3POOL,
  DAI,
  FUNDED,
  PORTAL,
  recovered,
  SIPA,
  sweep,
  transfer,
  USDC,
  USDT,
} from './test/fixtures'

// Each scenario is the token history of one SIPA, built from synthetic
// Transfer / Sweep / Recovered logs encoded with the real ABIs, replayed from
// empty balances unless stated otherwise. A sweep sends a 2 DAI fee and then
// FUNDED DAI to the portal.
describe(attributeFunders.name, () => {
  it('attributes a sweep to the single funder of the balance', () => {
    const portalTransfer = transfer(SIPA, PORTAL, FUNDED, { logIndex: 3 })

    const funders = replay([
      transfer(ALICE, SIPA, FUNDED + 2n, { logIndex: 1 }),
      transfer(SIPA, BOB, 2n, { logIndex: 2 }),
      portalTransfer,
    ])

    expect(funders).toEqual(new Map([[eventKey(portalTransfer), ALICE]]))
  })

  it('starts a new funding round after a sweep', () => {
    const secondPortalTransfer = transfer(SIPA, PORTAL, FUNDED, { logIndex: 7 })

    const funders = replay([
      transfer(ALICE, SIPA, FUNDED, { logIndex: 1 }),
      transfer(SIPA, PORTAL, FUNDED, { logIndex: 2 }),
      sweep(1, { logIndex: 3 }),
      transfer(BOB, SIPA, FUNDED + 2n, { logIndex: 5 }),
      transfer(SIPA, ALICE, 2n, { logIndex: 6 }),
      secondPortalTransfer,
    ])

    expect(funders.get(eventKey(secondPortalTransfer))).toEqual(BOB)
  })

  it('orders history by block and log index, so later same-block transfers do not taint a sweep', () => {
    const portalTransfer = transfer(SIPA, PORTAL, FUNDED, { logIndex: 2 })
    const history = [
      transfer(ALICE, SIPA, FUNDED, { logIndex: 1 }),
      portalTransfer,
      transfer(BOB, SIPA, FUNDED, { logIndex: 3 }),
    ]

    const funders = replay(history.reverse())

    expect(funders).toEqual(new Map([[eventKey(portalTransfer), ALICE]]))
  })

  it('ignores zero-value transfers', () => {
    const portalTransfer = transfer(SIPA, PORTAL, FUNDED, { logIndex: 3 })

    const funders = replay([
      transfer(BOB, SIPA, 0n, { logIndex: 1 }),
      transfer(ALICE, SIPA, FUNDED, { logIndex: 2 }),
      portalTransfer,
    ])

    expect(funders).toEqual(new Map([[eventKey(portalTransfer), ALICE]]))
  })

  it('ignores self transfers', () => {
    const portalTransfer = transfer(SIPA, PORTAL, FUNDED, { logIndex: 3 })

    const funders = replay([
      transfer(ALICE, SIPA, FUNDED, { logIndex: 1 }),
      transfer(SIPA, SIPA, FUNDED, { logIndex: 2 }),
      portalTransfer,
    ])

    expect(funders).toEqual(new Map([[eventKey(portalTransfer), ALICE]]))
  })

  it('excludes mixed funding until the balance is emptied', () => {
    const laterPortalTransfer = transfer(SIPA, PORTAL, FUNDED, { logIndex: 7 })

    const funders = replay([
      transfer(ALICE, SIPA, 50n, { logIndex: 1 }),
      transfer(BOB, SIPA, FUNDED + 2n - 50n, { logIndex: 2 }),
      transfer(SIPA, ALICE, 2n, { logIndex: 3 }),
      transfer(SIPA, PORTAL, FUNDED, { logIndex: 4 }),
      sweep(1, { logIndex: 5 }),
      transfer(ALICE, SIPA, FUNDED, { logIndex: 6 }),
      laterPortalTransfer,
    ])

    expect(funders).toEqual(new Map([[eventKey(laterPortalTransfer), ALICE]]))
  })

  it('carries swap provenance into the deposit token, ignoring unswapped tokens', () => {
    const portalTransfer = transfer(SIPA, PORTAL, FUNDED, { logIndex: 6 })

    const funders = replay(swapThroughCurve(portalTransfer))

    expect(funders).toEqual(new Map([[eventKey(portalTransfer), ALICE]]))
  })

  it('mixes a swap output with deposit tokens already held from another funder', () => {
    const portalTransfer = transfer(SIPA, PORTAL, FUNDED, { logIndex: 6 })

    const funders = replay([
      transfer(BOB, SIPA, 1n, { logIndex: 0 }),
      ...swapThroughCurve(portalTransfer),
    ])

    expect(funders).toEqual(new Map())
  })

  it('does not infer a funder from a swap output without a swap input', () => {
    const funders = replay([
      transfer(CURVE_3POOL, SIPA, FUNDED, { logIndex: 1 }),
      transfer(SIPA, PORTAL, FUNDED, { logIndex: 2 }),
    ])

    expect(funders).toEqual(new Map())
  })

  it('excludes balances held before the history starts', () => {
    const funders = replay(
      [
        transfer(ALICE, SIPA, FUNDED - 10n, { logIndex: 1 }),
        transfer(SIPA, PORTAL, FUNDED, { logIndex: 2 }),
      ],
      new Map([[DAI, 10n]]),
    )

    expect(funders).toEqual(new Map())
  })

  it('attributes again once a recovery empties a balance held before the history starts', () => {
    const portalTransfer = transfer(SIPA, PORTAL, FUNDED, { logIndex: 4 })

    const funders = replay(
      [
        transfer(SIPA, ALICE, 10n, { logIndex: 1 }),
        recovered(DAI, ALICE, 10n, { logIndex: 2 }),
        transfer(BOB, SIPA, FUNDED, { logIndex: 3 }),
        portalTransfer,
      ],
      new Map([[DAI, 10n]]),
    )

    expect(funders).toEqual(new Map([[eventKey(portalTransfer), BOB]]))
  })
})

/** Alice's USDC is swapped to DAI and swept; Bob's USDT stays untouched. */
function swapThroughCurve(portalTransfer: Log): Log[] {
  return [
    transfer(BOB, SIPA, 999n, { logIndex: 1 }, USDT),
    transfer(ALICE, SIPA, 100n, { logIndex: 2 }, USDC),
    transfer(SIPA, CURVE_3POOL, 100n, { logIndex: 3 }, USDC),
    transfer(CURVE_3POOL, SIPA, FUNDED + 2n, { logIndex: 4 }),
    transfer(SIPA, BOB, 2n, { logIndex: 5 }),
    portalTransfer,
  ]
}

function replay(
  history: Log[],
  initialBalances = new Map<EthereumAddress, bigint>(),
) {
  return attributeFunders({
    history,
    initialBalances: new Map([
      [DAI, 0n],
      [USDC, 0n],
      [USDT, 0n],
      ...initialBalances,
    ]),
    sipa: SIPA,
    token: DAI,
    portal: PORTAL,
    exchange: CURVE_3POOL,
  })
}
