import { expect } from 'earl'
import {
  parseEtherscanTimestamp,
  parseUnixTimestampInMilliseconds,
  parseUnixTimestampInSeconds,
} from './parseDate'

describe('parseDate', () => {
  describe('parseEtherscanTimestamp', () => {
    it('parses date string with parentheses and UTC', () => {
      const result = parseEtherscanTimestamp('(Aug-18-2023 06:36:29 PM +UTC)')
      expect(result).not.toEqual(undefined)
      expect(result?.toISOString().startsWith('2023-08-18')).toEqual(true)
    })

    it('parses date string without parentheses', () => {
      const result = parseEtherscanTimestamp('Aug-18-2023 06:36:29 PM +UTC')
      expect(result).not.toEqual(undefined)
      expect(result?.toISOString().startsWith('2023-08-18')).toEqual(true)
    })

    it('parses date string with UTC without plus sign', () => {
      const result = parseEtherscanTimestamp('Aug-18-2023 06:36:29 PM UTC')
      expect(result).not.toEqual(undefined)
      expect(result?.toISOString().startsWith('2023-08-18')).toEqual(true)
    })

    it('parses date string with AM time', () => {
      const result = parseEtherscanTimestamp('(Aug-18-2023 06:36:29 AM +UTC)')
      expect(result).not.toEqual(undefined)
      expect(result?.toISOString().startsWith('2023-08-18T06:36:29')).toEqual(
        true,
      )
    })

    it('parses date string at midnight', () => {
      const result = parseEtherscanTimestamp('(Aug-18-2023 12:00:00 AM +UTC)')
      expect(result).not.toEqual(undefined)
      expect(result?.toISOString().startsWith('2023-08-18T00:00:00')).toEqual(
        true,
      )
    })

    it('parses date string at noon', () => {
      const result = parseEtherscanTimestamp('(Aug-18-2023 12:00:00 PM +UTC)')
      expect(result).not.toEqual(undefined)
      expect(result?.toISOString().startsWith('2023-08-18T12:00:00')).toEqual(
        true,
      )
    })

    it('returns undefined for invalid date string', () => {
      const result = parseEtherscanTimestamp('invalid date')
      expect(result).toEqual(undefined)
    })

    it('returns undefined for empty string', () => {
      const result = parseEtherscanTimestamp('')
      expect(result).toEqual(undefined)
    })

    it('returns undefined for numeric string', () => {
      const result = parseEtherscanTimestamp('1692383789')
      expect(result).toEqual(undefined)
    })
  })

  describe('parseUnixTimestampInSeconds', () => {
    it('parses unix timestamp in seconds (10 digits)', () => {
      // 2023-08-18T18:36:29Z = 1692383789 seconds
      const result = parseUnixTimestampInSeconds('1692383789')
      expect(result).not.toEqual(undefined)
      expect(result?.toISOString()).toEqual('2023-08-18T18:36:29.000Z')
    })

    it('returns undefined for less than 10 digits', () => {
      const result = parseUnixTimestampInSeconds('946684800') // 9 digits
      expect(result).toEqual(undefined)
    })

    it('returns undefined for more than 10 digits', () => {
      const result = parseUnixTimestampInSeconds('16923837890') // 11 digits
      expect(result).toEqual(undefined)
    })

    it('returns undefined for non-numeric string', () => {
      const result = parseUnixTimestampInSeconds('abc123def')
      expect(result).toEqual(undefined)
    })

    it('returns undefined for empty string', () => {
      const result = parseUnixTimestampInSeconds('')
      expect(result).toEqual(undefined)
    })
  })

  describe('parseUnixTimestampInMilliseconds', () => {
    it('parses unix timestamp in milliseconds (13 digits)', () => {
      // 2023-08-18T18:36:29Z = 1692383789000 milliseconds
      const result = parseUnixTimestampInMilliseconds('1692383789000')
      expect(result).not.toEqual(undefined)
      expect(result?.toISOString()).toEqual('2023-08-18T18:36:29.000Z')
    })

    it('parses unix timestamp in milliseconds (12 digits)', () => {
      // 1999-12-31T23:59:59Z = 946684799000 milliseconds (12 digits)
      const result = parseUnixTimestampInMilliseconds('946684799000')
      expect(result).not.toEqual(undefined)
      expect(result?.toISOString()).toEqual('1999-12-31T23:59:59.000Z')
    })

    it('returns undefined for less than 12 digits', () => {
      const result = parseUnixTimestampInMilliseconds('1692383789') // 10 digits
      expect(result).toEqual(undefined)
    })

    it('returns undefined for 11 digits', () => {
      const result = parseUnixTimestampInMilliseconds('16923837890') // 11 digits
      expect(result).toEqual(undefined)
    })

    it('returns undefined for non-numeric string', () => {
      const result = parseUnixTimestampInMilliseconds('abc123def')
      expect(result).toEqual(undefined)
    })

    it('returns undefined for empty string', () => {
      const result = parseUnixTimestampInMilliseconds('')
      expect(result).toEqual(undefined)
    })
  })
})
