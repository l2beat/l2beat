import { expect } from 'chai'
import { AsyncCache } from '../../src/services/AsyncCache'

describe('AsyncCache', () => {
  class MockCacheFile {
    constructor(public data: any) {}
    read() {
      return this.data
    }
    write(data: any) {
      this.data = data
    }
    writePrecomputed() {}
  }

  function makeCache(data: any) {
    const mock = new MockCacheFile(data)
    const cache = new AsyncCache(mock, 0)
    return { cache, mock }
  }

  it('reads data from the file', async () => {
    const { cache } = makeCache({ foo: 'bar' })
    const data = await cache.getOrFetch('foo', () => Promise.resolve('baz'))
    expect(data).to.equal('bar')
  })

  it('reads complex keys', async () => {
    const { cache } = makeCache({ '2020-06-07,123': 'bar' })
    const data = await cache.getOrFetch(`2020-06-07,123`, () =>
      Promise.resolve('baz')
    )
    expect(data).to.equal('bar')
  })

  it('supports data transformation', async () => {
    const { cache } = makeCache({ '2020-06-07,123': 'false' })
    const data = await cache.getOrFetch(
      `2020-06-07,123`,
      () => Promise.resolve(true),
      (bool) => bool.toString(),
      (json) => json === 'true'
    )
    expect(data).to.equal(false)
  })

  it('fetches and writes to the file', async () => {
    const { cache, mock } = makeCache({ foo: 'bar' })
    const data = await cache.getOrFetch(
      'baz',
      () => Promise.resolve('XYZ'),
      (data) => data.toLowerCase(),
      (json) => json.toUpperCase()
    )
    await new Promise((resolve) => setTimeout(resolve, 10))
    expect(data).to.equal('XYZ')
    expect(mock.data).to.deep.equal({
      foo: 'bar',
      baz: 'xyz',
    })
  })

  it('remembers old fetches', async () => {
    const { cache } = makeCache({ foo: 'bar' })
    const oldData = await cache.getOrFetch('baz', async () => 1)
    const newData = await cache.getOrFetch('baz', async () => 2)
    expect(oldData).to.equal(1)
    expect(newData).to.equal(1)
  })

  it('de-bounces writes', async () => {
    let calls = 0
    const mock = {
      read: () => ({}),
      write() {
        calls++
      },
      writePrecomputed() {},
    }
    const cache = new AsyncCache(mock, 10)
    await cache.getOrFetch('a', async () => 1)
    await cache.getOrFetch('b', async () => 2)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(calls).to.equal(1)
  })
})
