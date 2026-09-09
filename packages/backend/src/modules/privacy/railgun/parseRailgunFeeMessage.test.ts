import { bech32m } from '@scure/base'
import { generateKeyPairSync, type KeyObject, sign } from 'crypto'
import { expect } from 'earl'
import { isEligibleFeeAd, parseRailgunFeeAd } from './parseRailgunFeeMessage'

describe(parseRailgunFeeAd.name, () => {
  const NOW_MS = 1_785_974_400_000
  const broadcaster = makeBroadcaster()

  it('parses a valid signed fee advertisement', () => {
    const payload = makeFeeMessage(broadcaster, {
      feeExpiration: NOW_MS + 300_000,
      availableWallets: 3,
    })

    expect(parseRailgunFeeAd(payload)).toEqual({
      railgunAddress: broadcaster.railgunAddress,
      feeExpiration: NOW_MS + 300_000,
      availableWallets: 3,
      feeTokenCount: 1,
    })
  })

  it('keeps the fee expiration exactly as published', () => {
    // a bogus small value must read as expired, not get "fixed" into the future
    const payload = makeFeeMessage(broadcaster, {
      feeExpiration: 999_999_999_999,
      availableWallets: 1,
    })

    expect(parseRailgunFeeAd(payload)?.feeExpiration).toEqual(999_999_999_999)
  })

  it('rejects a tampered signature', () => {
    const payload = makeFeeMessage(broadcaster, {
      feeExpiration: NOW_MS + 300_000,
      availableWallets: 3,
    })
    const envelope = JSON.parse(Buffer.from(payload).toString('utf8'))
    const firstChar = envelope.signature[0] === '0' ? '1' : '0'
    envelope.signature = firstChar + envelope.signature.slice(1)

    expect(
      parseRailgunFeeAd(Buffer.from(JSON.stringify(envelope), 'utf8')),
    ).toEqual(undefined)
  })

  it('rejects an ad claiming an address the signer does not control', () => {
    const impostor = makeBroadcaster()
    const payload = makeFeeMessage(impostor, {
      feeExpiration: NOW_MS + 300_000,
      availableWallets: 3,
      railgunAddress: broadcaster.railgunAddress,
    })

    expect(parseRailgunFeeAd(payload)).toEqual(undefined)
  })

  it('rejects malformed payloads', () => {
    const valid = makeFeeMessage(broadcaster, {
      feeExpiration: NOW_MS + 300_000,
      availableWallets: 3,
    })
    const envelope = JSON.parse(Buffer.from(valid).toString('utf8'))

    const cases = [
      Buffer.from('not json', 'utf8'),
      Buffer.from(JSON.stringify({ data: 'zz', signature: 'zz' }), 'utf8'),
      Buffer.from(JSON.stringify({ signature: envelope.signature }), 'utf8'),
      Buffer.from(
        JSON.stringify({
          data: Buffer.from('{"noAddress":true}', 'utf8').toString('hex'),
          signature: envelope.signature,
        }),
        'utf8',
      ),
    ]

    for (const payload of cases) {
      expect(parseRailgunFeeAd(payload)).toEqual(undefined)
    }
  })

  it('rejects addresses that are not valid 0zk bech32m', () => {
    const payload = makeFeeMessage(broadcaster, {
      feeExpiration: NOW_MS + 300_000,
      availableWallets: 3,
      railgunAddress: 'zs1invalidaddress',
    })

    expect(parseRailgunFeeAd(payload)).toEqual(undefined)
  })
})

describe(isEligibleFeeAd.name, () => {
  const NOW_MS = 1_785_974_400_000
  const base = {
    railgunAddress: '0zktest',
    feeExpiration: NOW_MS + 300_000,
    availableWallets: 1,
    feeTokenCount: 1,
  }

  it('accepts an unexpired ad with fees and available wallets', () => {
    expect(isEligibleFeeAd(base, NOW_MS)).toEqual(true)
  })

  it('rejects an expired ad', () => {
    expect(isEligibleFeeAd({ ...base, feeExpiration: NOW_MS }, NOW_MS)).toEqual(
      false,
    )
    expect(
      isEligibleFeeAd({ ...base, feeExpiration: NOW_MS + 1 }, NOW_MS),
    ).toEqual(true)
  })

  it('rejects an ad without available wallets', () => {
    expect(isEligibleFeeAd({ ...base, availableWallets: 0 }, NOW_MS)).toEqual(
      false,
    )
  })

  it('rejects an ad without any fee entries', () => {
    expect(isEligibleFeeAd({ ...base, feeTokenCount: 0 }, NOW_MS)).toEqual(
      false,
    )
  })
})

interface TestBroadcaster {
  railgunAddress: string
  privateKey: KeyObject
}

function makeBroadcaster(): TestBroadcaster {
  const { publicKey, privateKey } = generateKeyPairSync('ed25519')
  const rawPublicKey = publicKey
    .export({ type: 'spki', format: 'der' })
    .subarray(-32)

  // 73 bytes: version (1) + master public key (32) + network id (8) +
  // viewing public key (32), matching the Railgun engine address layout.
  const addressBytes = new Uint8Array(73)
  addressBytes[0] = 1
  addressBytes.set(rawPublicKey, 41)
  const railgunAddress = bech32m.encode(
    '0zk',
    bech32m.toWords(addressBytes),
    1024,
  )

  return { railgunAddress, privateKey }
}

function makeFeeMessage(
  signer: TestBroadcaster,
  options: {
    feeExpiration: number
    availableWallets: number
    railgunAddress?: string
  },
): Uint8Array {
  const feeData = {
    fees: { '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': '0x0186a0' },
    feeExpiration: options.feeExpiration,
    feesID: 'test-fees-id',
    railgunAddress: options.railgunAddress ?? signer.railgunAddress,
    availableWallets: options.availableWallets,
    version: '8.1.0',
    relayAdapt: '0x0000000000000000000000000000000000000000',
    requiredPOIListKeys: [],
    reliability: 0.99,
  }

  const data = Buffer.from(JSON.stringify(feeData), 'utf8')
  const signature = sign(null, data, signer.privateKey)

  const envelope = {
    data: data.toString('hex'),
    signature: signature.toString('hex'),
  }
  return Buffer.from(JSON.stringify(envelope), 'utf8')
}
