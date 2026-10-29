import { expect } from 'earl'
import { deriveEthDeposit } from './deriveEthDeposit'

describe(deriveEthDeposit.name, () => {
  it('derives the Arbitrum One deposit tx hash', () => {
    // L1 tx 0xf3773c0a76f4f5dfaed3ae16eb9cb84a09adf16f4c3558e3a8868a231717dc26
    const derived = deriveEthDeposit({
      chainId: 42161,
      messageIndex: 2606426n,
      sender: '0xd740f6257d585d2B24e8Cf01F05568e15bb50D32',
      messageData:
        '0xc62ff6257d585d2b24e8cf01f05568e15bb4fc21000000000000000000000000000000000000000000000001f9ab075a5b771a24',
    })

    expect(derived).toEqual({
      to: '0xc62ff6257d585d2b24e8cf01f05568e15bb4fc21',
      value: 36437225294834113060n,
      l2TxHash:
        '0x9c1fca27d65b585a331ceb28a277ce964726481acffbeaa0e0cd3ddc1616a289',
    })
  })

  it('derives the Robinhood Chain deposit tx hash', () => {
    // L1 tx 0x199598b23d0c401f44318bdfd7eaf000ceb5eb821d1fbb79bb878278f5424ce6
    const derived = deriveEthDeposit({
      chainId: 4663,
      messageIndex: 411073n,
      sender: '0x85dbbb7ec8a208dc0e1cd0e61dec928270785691',
      messageData:
        '0x74cabb7ec8a208dc0e1cd0e61dec9282707845800000000000000000000000000000000000000000000000000162b99d6150d992',
    })

    expect(derived?.l2TxHash).toEqual(
      '0x4945f9d407e6f91ac0923bc8041efc9f3fe1911a7b5097c0800eccada08bff1a',
    )
  })

  it('returns undefined for data that is not an ETH deposit', () => {
    expect(
      deriveEthDeposit({
        chainId: 42161,
        messageIndex: 1n,
        sender: '0xd740f6257d585d2b24e8cf01f05568e15bb50d32',
        messageData: '0x1234',
      }),
    ).toEqual(undefined)
  })
})
