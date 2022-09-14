import { expect, mockFn } from 'earljs'

import { InMemoryTimer } from '../../../src'

describe(InMemoryTimer.name, () => {
  it('returns current time', () => {
    const timer = new InMemoryTimer(0)
    timer.tick(10)
    expect(timer.now()).toEqual(10)
  })

  it('schedules single callback for execution right away', () => {
    const timer = new InMemoryTimer()
    const cb = mockFn(() => {})
    timer.setTimeout(cb, 0)
    expect(cb).toHaveBeenCalledWith([])
  })

  it('schedules single callback for execution in the future', () => {
    const timer = new InMemoryTimer()
    const cb = mockFn(() => {})
    timer.setTimeout(cb, 1)
    expect(cb).not.toHaveBeenCalledWith([])
    timer.tick()
    expect(cb).toHaveBeenCalledWith([])
  })

  it('executes callback only once', () => {
    const timer = new InMemoryTimer()
    const cb = mockFn(() => {})
    timer.setTimeout(cb, 1)
    expect(cb).not.toHaveBeenCalledWith([])
    timer.tick()
    expect(cb).toHaveBeenCalledExactlyWith([[]])
    timer.tick()
    expect(cb).toHaveBeenCalledExactlyWith([[]])
  })

  it('executes multiple callbacks for a given moment', () => {
    const timer = new InMemoryTimer()
    const cb1 = mockFn(() => {})
    const cb2 = mockFn(() => {})
    const cb3 = mockFn(() => {})
    timer.setTimeout(cb1, 1)
    timer.setTimeout(cb2, 1)
    timer.setTimeout(cb3, 1)

    timer.tick()

    expect(cb1).toHaveBeenCalledExactlyWith([[]])
    expect(cb2).toHaveBeenCalledExactlyWith([[]])
    expect(cb3).toHaveBeenCalledExactlyWith([[]])
  })

  it('clears timeout', () => {
    const timer = new InMemoryTimer()
    const cb = mockFn(() => {})
    const timeout = timer.setTimeout(cb, 1)
    timer.clearTimeout(timeout)
    timer.tick()
    expect(cb).toHaveBeenCalledExactlyWith([])
  })
})
