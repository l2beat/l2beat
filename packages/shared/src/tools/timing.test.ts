// Import the function to be tested
import { expect } from 'earl'
import { formatSI } from './timing'

// Test cases for formatSI function
describe('formatSI', () => {
  it('should return the value with kilo (k) prefix when number is in thousands', () => {
    const result = formatSI(1000, 'g')
    expect(result).toEqual('1 Kg')
  })

  it('should return the value with milli (m) prefix when number is in thousandths', () => {
    const result = formatSI(0.001, 'm')
    expect(result).toEqual('1 mm')
  })

  it('should return the value with mega (M) prefix when number is in millions', () => {
    const result = formatSI(1000000, 'W')
    expect(result).toEqual('1 MW')
  })

  it('should return the value with giga (G) prefix when number is in billions', () => {
    const result = formatSI(1000000000, 'B')
    expect(result).toEqual('1 GB')
  })

  it('should return the value with micro (µ) prefix when number is in millionths', () => {
    const result = formatSI(0.000001, 'm')
    expect(result).toEqual('1 µm')
  })

  it('should return the value unchanged if no SI prefix is required', () => {
    const result = formatSI(42, 'm')
    expect(result).toEqual('42 m')
  })

  it('should handle negative values correctly with the appropriate SI prefix', () => {
    const result = formatSI(-1000, 'g')
    expect(result).toEqual('-1 Kg')
  })

  it('should return zero with unit if the value is zero', () => {
    const result = formatSI(0, 'm')
    expect(result).toEqual('0 m')
  })

  it('should return appropriate decimal formatted values for non-integer values', () => {
    const result = formatSI(1500, 'g')
    expect(result).toEqual('1.5 Kg')
  })

  it('should handle very large values with appropriate SI prefix', () => {
    const result = formatSI(1000000000000, 'W')
    expect(result).toEqual('1 TW') // Tera for trillion
  })

  it('should handle very small values with appropriate SI prefix', () => {
    const result = formatSI(0.000000001, 'F')
    expect(result).toEqual('1 nF') // Nano for billionth
  })
})
