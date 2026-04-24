import { expect } from 'earl'
import { perfStats } from './perfStats'

describe('perfStats', () => {
  beforeEach(() => {
    perfStats.reset()
  })

  afterEach(() => {
    perfStats.reset()
  })

  it('does not overshoot percentiles on exact rank boundaries', () => {
    for (let durationMs = 1; durationMs <= 20; durationMs++) {
      perfStats.recordFrame(durationMs)
      perfStats.recordRender(durationMs)
      perfStats.recordAction('boundary', durationMs)
    }

    const snapshot = perfStats.snapshot()

    expect(snapshot.frameP50Ms).toEqual(10)
    expect(snapshot.frameP95Ms).toEqual(19)
    expect(snapshot.renderP95Ms).toEqual(19)
    expect(snapshot.actions[0]?.p95Ms).toEqual(19)
  })

  it('sorts hot actions by the corrected percentile instead of the max', () => {
    for (let durationMs = 1; durationMs <= 20; durationMs++) {
      perfStats.recordAction('spiky', durationMs)
      perfStats.recordAction('steady', 19.5)
    }

    const snapshot = perfStats.snapshot()

    expect(snapshot.actions.map((action) => action.name)).toEqual([
      'steady',
      'spiky',
    ])
    expect(snapshot.actions.map((action) => action.p95Ms)).toEqual([19.5, 19])
  })
})
