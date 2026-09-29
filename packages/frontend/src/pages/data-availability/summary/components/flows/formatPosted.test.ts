import { expect } from 'earl'
import { formatPosted } from './formatPosted'

describe(formatPosted.name, () => {
  it('keeps three significant digits', () => {
    expect(formatPosted(1.11 * 1024 ** 3)).toEqual('1.11 GiB')
    expect(formatPosted(82 * 1024 ** 2)).toEqual('82.0 MiB')
    expect(formatPosted(934.13 * 1024 ** 2)).toEqual('934 MiB')
  })

  it('never shows a fraction of a byte', () => {
    expect(formatPosted(512)).toEqual('512 B')
    expect(formatPosted(0)).toEqual('0 B')
  })

  it('moves to the next unit at 1024', () => {
    expect(formatPosted(1024)).toEqual('1.00 KiB')
    expect(formatPosted(2 * 1024)).toEqual('2.00 KiB')
  })
})
