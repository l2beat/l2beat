import { UnixTime } from '@l2beat/types'

import { EventTracker } from '../event-tracker/EventTracker'
import { getDurationAverage } from '../event-tracker/history-reducers/getDurationAverage'
import { getLastSecondCount } from '../event-tracker/history-reducers/getLastSecondCount'
import { ReadonlyHistory } from '../event-tracker/types'

type Counts = Record<TaskEvent, number>

type TaskEvent = 'success' | 'retry' | 'error' | 'started'

export class Monitor {
  private readonly trackers: Record<TaskEvent, EventTracker> = {
    success: new EventTracker(),
    retry: new EventTracker(),
    error: new EventTracker(),
    started: new EventTracker(),
  }

  record(event: TaskEvent) {
    this.trackers[event].record()
  }

  getStats() {
    const now = UnixTime.now()

    return {
      lastSecond: this.getLastSecondCounts(now),
      lastMinuteAverage: this.getAverageCounts(now, 'minutes'),
      lastHourAverage: this.getAverageCounts(now, 'hours'),
    }
  }

  private getLastSecondCounts(now: UnixTime): Counts {
    return this.reduceHistories((h) => getLastSecondCount(h, now))
  }

  private getAverageCounts(
    now: UnixTime,
    duration: 'hours' | 'minutes',
  ): Counts {
    const from = now.add(-1, duration)
    return this.reduceHistories((h) => getDurationAverage(h, from, now))
  }

  private reduceHistories(
    reducer: (history: ReadonlyHistory) => number,
  ): Counts {
    return {
      success: reducer(this.trackers.success.getHistory()),
      retry: reducer(this.trackers.retry.getHistory()),
      error: reducer(this.trackers.error.getHistory()),
      started: reducer(this.trackers.started.getHistory()),
    }
  }
}
