import { expect } from 'earl'
import { asciiProgressBar } from './asciiProgressBar.js'

describe(asciiProgressBar.name, () => {
  it('should return a string', () => {
    expect(typeof asciiProgressBar(0, 100)).toEqual('string')
  })

  it('should return a string with the correct length', () => {
    expect(asciiProgressBar(0, 100)).toHaveLength(40)
  })

  it('should return a string with the correct width', () => {
    expect(asciiProgressBar(0, 100, 10)).toHaveLength(10)
  })

  it('should return a string with the correct width', () => {
    expect(asciiProgressBar(0, 100, 10)).toHaveLength(10)
  })

  it('empty progress bar', () => {
    expect(asciiProgressBar(0, 10, 10)).toEqual('░░░░░░░░░░')
    expect(asciiProgressBar(-30, 10, 10)).toEqual('░░░░░░░░░░')
  })

  it('full progress bar', () => {
    expect(asciiProgressBar(10, 10, 10)).toEqual('██████████')
    expect(asciiProgressBar(14, 10, 10)).toEqual('██████████')
  })
})
