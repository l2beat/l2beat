import { expect } from 'chai'
import { Cache, EmptyCacheBackend, NestedDict } from '../../../src'
import waitForExpect from 'wait-for-expect'

describe('Cache', () => {
  it('get initializes on first call', () => {
    let initCount = 0
    const backend = {
      read: () => {
        initCount++
        return new NestedDict({ a: { b: 1, c: 2 } })
      },
      write: () => {},
    }
    const cache = new Cache(backend)

    expect(cache.get('a', 'b')).to.equal(1)
    expect(initCount).to.equal(1)

    expect(cache.get('a', 'c')).to.equal(2)
    expect(initCount).to.equal(1)
  })

  it('has initializes on first call', () => {
    let initCount = 0
    const backend = {
      read: () => {
        initCount++
        return new NestedDict({ a: { b: 1 } })
      },
      write: () => {},
    }
    const cache = new Cache(backend)

    expect(cache.has('a', 'b')).to.equal(true)
    expect(initCount).to.equal(1)

    expect(cache.has('a', 'c')).to.equal(false)
    expect(initCount).to.equal(1)
  })

  it('set initializes on first call', () => {
    let initCount = 0
    const backend = {
      read: () => {
        initCount++
        return new NestedDict({})
      },
      write: () => {},
    }
    const cache = new Cache(backend)

    cache.set('a', 'b', 1)
    expect(initCount).to.equal(1)

    cache.set('a', 'c', 2)
    expect(initCount).to.equal(1)
  })

  it('set writes once after multiple calls', async () => {
    let writeCount = 0
    const backend = {
      read: () => new NestedDict({}),
      write: (data: NestedDict) => {
        writeCount++
        expect(data.data).to.deep.equal({ a: { b: 1, c: 2, d: 3 } })
      },
    }
    const cache = new Cache(backend)

    cache.set('a', 'b', 1)
    cache.set('a', 'c', 2)
    cache.set('a', 'd', 3)

    await waitForExpect(() => {
      expect(writeCount).to.equal(1)
    })
  })

  it('can wrap a function', () => {
    let calls = 0
    function add(a: number, b: number) {
      calls++
      return a + b
    }
    const cache = new Cache(new EmptyCacheBackend())
    const wrapped = cache.wrapSync('add', add)

    expect(wrapped(1, 2)).to.equal(3)
    expect(calls).to.equal(1)
    expect(wrapped(1, 2)).to.equal(3)
    expect(calls).to.equal(1)
  })

  it('can wrap an async function', async () => {
    let calls = 0
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms))

    async function add(a: number, b: number) {
      calls++
      await sleep(1)
      return { sum: a + b }
    }

    const cache = new Cache(new EmptyCacheBackend())
    const wrapped = cache.wrap('add', add)

    const [a, b, c] = await Promise.all([
      wrapped(1, 2),
      wrapped(1, 2),
      wrapped(1, 2),
    ])

    expect(a).to.deep.equal({ sum: 3 })
    expect(b).to.deep.equal({ sum: 3 })
    expect(c).to.deep.equal({ sum: 3 })
    expect(calls).to.equal(1)
    expect(cache.get('add', '[1,2]')).to.deep.equal({ sum: 3 })
  })
})
