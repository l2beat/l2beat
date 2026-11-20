import { expect } from 'earl'
import { isEmptyBloom, isInBloom, parseBloom, toBloomFilter } from './logsBloom'

/**
 * Methodology: the bloom of Arbitrum block 525625651 and its only log, a USDT
 * transfer, as an RPC returned them. The log's address and three topics set
 * the bloom's twelve bits and no others, so they fix the bit positions
 * against the chain, where a bloom built by this code would only agree with
 * itself
 */
const BLOOM =
  '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000010000000000000000008000000000000000000000000000800000000000000000000000800000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008002000000002000000000000000000000000040000000000000000000000000000000000000000000000000000010000000000000000000000000000000'
const USDT = '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9'
const TRANSFER =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const FROM =
  '0x000000000000000000000000acc500f32273586baf7063f139751da3dc6172ed'
const TO = '0x0000000000000000000000004e5bc1cd2c421ecfef65395b3237f90a97178c55'
const OTHER_ADDRESS = '0xaf88d065e77c8cc2239327c5edb3a432268e5831'
const OTHER_TOPIC =
  '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'

describe('logsBloom', () => {
  const bloom = parseBloom(BLOOM) as Uint8Array

  describe(isInBloom.name, () => {
    it("finds a block's log in the block's bloom, and not a log the block does not have", () => {
      const log = {
        address: USDT,
        topics: [TRANSFER, FROM, TO],
        data: '0x',
        blockNumber: 525625651,
        blockHash: '0x',
        transactionHash: '0x',
        logIndex: 0,
      }

      expect(isInBloom(bloom, log)).toEqual(true)
      expect(isInBloom(bloom, { ...log, address: OTHER_ADDRESS })).toEqual(
        false,
      )
      expect(
        isInBloom(bloom, { ...log, topics: [TRANSFER, FROM, OTHER_TOPIC] }),
      ).toEqual(false)
    })
  })

  describe(toBloomFilter.name, () => {
    it('may match when the bloom has one of the addresses and one topic at each position named', () => {
      const filter = toBloomFilter({
        addresses: [OTHER_ADDRESS, USDT],
        topics: [[OTHER_TOPIC, TRANSFER], null, TO],
      })

      expect(filter(bloom)).toEqual(true)
    })

    it('rules a block out when its bloom has none of the addresses, or none of the topics at a position', () => {
      const noAddress = toBloomFilter({
        addresses: [OTHER_ADDRESS],
        topics: [[TRANSFER]],
      })
      const noTopic = toBloomFilter({
        addresses: [USDT],
        topics: [[TRANSFER], null, [OTHER_TOPIC]],
      })

      expect(noAddress(bloom)).toEqual(false)
      expect(noTopic(bloom)).toEqual(false)
    })
  })

  describe(parseBloom.name, () => {
    it('has nothing for a bloom that was not stored or is not one', () => {
      expect(parseBloom(null)).toEqual(undefined)
      expect(parseBloom('0x')).toEqual(undefined)
    })

    it('tells a bloom of all zeros from one with a log', () => {
      const zeros = parseBloom(`0x${'0'.repeat(512)}`) as Uint8Array

      expect(isEmptyBloom(zeros)).toEqual(true)
      expect(isEmptyBloom(bloom)).toEqual(false)
    })
  })
})
