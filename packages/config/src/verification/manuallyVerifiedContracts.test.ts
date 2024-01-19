import { expect } from 'earl'

import { parseManuallyVerifiedContracts } from './manuallyVerifiedContracts'

describe('manually verified contracts', () => {
  describe('parseManuallyVerifiedContracts()', () => {
    it('parse well formed jsonc', () => {
      const data = `
        {
            "$schema": "https://example.com",
            "0x0000000000000000000000000000000000000000": "https://example.com", // comment
            "0x1111111111111111111111111111111111111111": "https://example.com"
        }
        `
      expect(parseManuallyVerifiedContracts(data)).toEqual({
        '0x0000000000000000000000000000000000000000': 'https://example.com',
        '0x1111111111111111111111111111111111111111': 'https://example.com',
      })
    })

    it('throw on malformed jsonc', () => {
      const data = `
        {
          "0x0000000000000000000000000000000000000000": "https://example.com", // comment
        `
      expect(() => parseManuallyVerifiedContracts(data)).toThrow()
    })
    it('throw on incorrect link format', () => {
      const data = `
        {
          "0x0000000000000000000000000000000000000000": "Hello world", // comment
        }
        `
      expect(() => parseManuallyVerifiedContracts(data)).toThrow()
    })

    it('throw on incorrect address format', () => {
      const data = `
        {
          "0x01": "www.example.com", // comment
        }
        `
      expect(() => parseManuallyVerifiedContracts(data)).toThrow()
    })
  })
})
