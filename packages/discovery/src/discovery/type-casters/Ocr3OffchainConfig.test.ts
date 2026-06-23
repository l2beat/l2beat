import { expect } from 'earl'
import { Ocr3OffchainConfig } from './Ocr3OffchainConfig'

describe('Ocr3OffchainConfig', () => {
  it('decodes the OCR3 OffchainConfig protobuf fields', () => {
    // Hand-crafted message:
    //   field 30 (rMax, varint) = 3
    //   field 31 (s, packed uint32) = [1, 2, 3]
    //   field 33 (peerIds, repeated string) = ["p2p"]
    //   field 34 (reportingPluginConfig, bytes) = {"a":1}
    //   field 39 (sharedSecretEncryptions) { field 1 diffieHellmanPoint = 0xdead }
    const hex =
      '0x' +
      'f00103' + // 30: rMax = 3
      'fa0103010203' + // 31: s = [1,2,3]
      '8a0203703270' + // 33: peerIds = "p2p"
      '9202077b2261223a317d' + // 34: reportingPluginConfig = {"a":1}
      'ba02040a02dead' // 39: sharedSecretEncryptions { diffieHellmanPoint: 0xdead }

    expect(Ocr3OffchainConfig.cast({}, hex)).toEqual({
      rMax: 3,
      s: [1, 2, 3],
      peerIds: ['p2p'],
      reportingPluginConfig: { a: 1 },
      sharedSecretEncryptions: { diffieHellmanPoint: '0xdead' },
    })
  })

  it('strips null values from the embedded JSON (e.g. tokenDataObservers: null)', () => {
    // field 34 reportingPluginConfig = {"a":1,"b":null}
    const hex = `0x920210${'7b2261223a312c2262223a6e756c6c7d'}`
    expect(Ocr3OffchainConfig.cast({}, hex)).toEqual({
      reportingPluginConfig: { a: 1 },
    })
  })

  it('keeps reportingPluginConfig as a string when it is not valid JSON', () => {
    // field 34 = "not json"
    const hex = '0x9202086e6f74206a736f6e'
    expect(Ocr3OffchainConfig.cast({}, hex)).toEqual({
      reportingPluginConfig: 'not json',
    })
  })

  it('returns an empty object for empty bytes', () => {
    expect(Ocr3OffchainConfig.cast({}, '0x')).toEqual({})
  })

  it('throws if the value is not a hex string', () => {
    expect(() => Ocr3OffchainConfig.cast({}, 42)).toThrow(
      'Value must be a hex string',
    )
  })
})
