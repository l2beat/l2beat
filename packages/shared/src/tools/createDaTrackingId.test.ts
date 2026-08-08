import { expect } from 'earl'
import { createDaTrackingId } from './createDaTrackingId'

describe(createDaTrackingId.name, () => {
  // Hashes pinned against the original backend implementation
  // (packages/backend/src/config/features/da.ts) before it was moved here.
  // These ids key indexed DA data in production - if any of these assertions
  // fails, deploying the change wipes the corresponding data.

  it('matches the pinned id for an ethereum config (zeronetwork old-timelock era)', () => {
    expect(
      createDaTrackingId({
        type: 'ethereum',
        daLayer: 'ethereum',
        inbox: '0x8c0Bfc04AdA21fd496c55B8C50331f904306F564',
        sequencers: [
          '0x479B7c95b9509E1A834C994fc94e3581aA8A73B9',
          '0x0F9B807d5B0cE12450059B425Dc35C727D65CB2F',
          '0xef854E09fa6e281268e1051D4d5465d8c92862ee',
          '0x7b55c1D9b75Fa35793157aD674b0a1aEF7b8DdE0',
        ],
      }),
    ).toEqual('d7d7f8be0a85')
  })

  it('matches the pinned id for an ethereum config (zeronetwork v29 era)', () => {
    expect(
      createDaTrackingId({
        type: 'ethereum',
        daLayer: 'ethereum',
        inbox: '0x2e5110cF18678Ec99818bFAa849B8C881744b776',
        sequencers: [
          '0xef854E09fa6e281268e1051D4d5465d8c92862ee',
          '0x7b55c1D9b75Fa35793157aD674b0a1aEF7b8DdE0',
        ],
      }),
    ).toEqual('a7118a5692fd')
  })

  it('matches the pinned id for a chain-prefixed inbox (zksync2 old Era config)', () => {
    // zksync2's committed config uses a 'eth:'-prefixed inbox string and that
    // exact string is part of the production identity - it must never be
    // normalized.
    expect(
      createDaTrackingId({
        type: 'ethereum',
        daLayer: 'ethereum',
        inbox: 'eth:0x8c0Bfc04AdA21fd496c55B8C50331f904306F564',
        sequencers: [
          '0xE1D8d4C8656949764c2c9Fa9faB2C15d3F42e6C2',
          '0x30066439887C0a509Cb38E45c9262E6924a29BbD',
        ],
      }),
    ).toEqual('9294ada25d43')
  })

  it('matches the pinned id for an ethereum config without sequencers', () => {
    expect(
      createDaTrackingId({
        type: 'ethereum',
        daLayer: 'ethereum',
        inbox: '0x8c0Bfc04AdA21fd496c55B8C50331f904306F564',
      }),
    ).toEqual('158f67fc279d')
  })

  it('matches the pinned id for an ethereum config with topics', () => {
    expect(
      createDaTrackingId({
        type: 'ethereum',
        daLayer: 'ethereum',
        inbox: '0x8c0Bfc04AdA21fd496c55B8C50331f904306F564',
        sequencers: ['0xb', '0xa'],
        topics: ['0x2', '0x1'],
      }),
    ).toEqual('7b0e365a57ff')
  })

  it('matches the pinned id for a celestia config', () => {
    expect(
      createDaTrackingId({
        type: 'celestia',
        daLayer: 'celestia',
        namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAY7JibkyLYAA=',
      }),
    ).toEqual('c2b71ff96450')
  })

  it('matches the pinned id for an avail config (sophon appIds)', () => {
    expect(
      createDaTrackingId({
        type: 'avail',
        daLayer: 'avail',
        appIds: ['17', '36', '37', '38'],
      }),
    ).toEqual('9186999c5d28')
  })

  it('matches the pinned id for an eigen-da config', () => {
    expect(
      createDaTrackingId({
        type: 'eigen-da',
        daLayer: 'eigen-da',
        customerId: '0xcustomer',
      }),
    ).toEqual('60feca2a7ba9')
  })

  it('is order-insensitive for sequencers and does not mutate the input', () => {
    const sequencers = [
      '0xef854E09fa6e281268e1051D4d5465d8c92862ee',
      '0x7b55c1D9b75Fa35793157aD674b0a1aEF7b8DdE0',
    ]
    const reversed = [...sequencers].reverse()
    const a = createDaTrackingId({
      type: 'ethereum',
      daLayer: 'ethereum',
      inbox: '0x2e5110cF18678Ec99818bFAa849B8C881744b776',
      sequencers,
    })
    const b = createDaTrackingId({
      type: 'ethereum',
      daLayer: 'ethereum',
      inbox: '0x2e5110cF18678Ec99818bFAa849B8C881744b776',
      sequencers: reversed,
    })
    expect(a).toEqual(b)
    expect(sequencers).toEqual([
      '0xef854E09fa6e281268e1051D4d5465d8c92862ee',
      '0x7b55c1D9b75Fa35793157aD674b0a1aEF7b8DdE0',
    ])
  })

  it('discriminator changes the id, absence preserves pinned ids', () => {
    const config = {
      type: 'ethereum' as const,
      daLayer: 'ethereum',
      inbox: '0x8c0Bfc04AdA21fd496c55B8C50331f904306F564',
    }
    // No discriminator -> pinned production id stays intact.
    expect(createDaTrackingId(config)).toEqual('158f67fc279d')
    // A discriminator breaks the A -> B -> A collision: same identity
    // fields, distinct backend configuration id.
    expect(createDaTrackingId({ ...config, discriminator: '1' })).not.toEqual(
      createDaTrackingId(config),
    )
    expect(createDaTrackingId({ ...config, discriminator: '1' })).not.toEqual(
      createDaTrackingId({ ...config, discriminator: '2' }),
    )
  })

  it('since and until ranges are not part of the identity', () => {
    // The input type has no since/until fields at all - this test documents
    // that ranges can change freely without re-keying indexed data.
    const config = {
      type: 'ethereum' as const,
      daLayer: 'ethereum',
      inbox: '0x2e5110cF18678Ec99818bFAa849B8C881744b776',
    }
    expect(createDaTrackingId(config)).toEqual(
      createDaTrackingId({ ...config }),
    )
  })
})
