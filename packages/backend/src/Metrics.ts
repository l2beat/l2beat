import {
  collectDefaultMetrics,
  Counter,
  CounterConfiguration,
  Gauge,
  GaugeConfiguration,
  Histogram,
  HistogramConfiguration,
  register,
  Summary,
  SummaryConfiguration,
} from 'prom-client'

import { TaskQueueHistogram } from './core/queue/TaskQueue'

export type RepositoryHistogram = Histogram<'repository' | 'method'>
export type ProjectGauge = Gauge<'project'>

export class Metrics {
  readonly repositoryHistogram: RepositoryHistogram
  readonly activityLast: ProjectGauge
  readonly activityLatest: ProjectGauge
  readonly activityIncludedInApi: ProjectGauge
  readonly activityConfig: Gauge<
    'project' | 'scheduleIntervalMs' | 'batchSize' | 'uncertaintyBuffer'
  >
  readonly tvlHistogram: TaskQueueHistogram

  constructor() {
    this.repositoryHistogram = this.createHistogram({
      name: 'repository_method_duration_seconds',
      help: 'duration histogram of repository methods',
      labelNames: ['repository', 'method'],
    })

    this.activityLast = this.createGauge({
      name: 'activity_last_synced',
      help: 'Last unit (block or day) synced by the sequence processor',
      labelNames: ['project'],
    })

    this.activityLatest = this.createGauge({
      name: 'activity_latest',
      help: 'Latest existing unit to be synced to',
      labelNames: ['project'],
    })

    this.activityIncludedInApi = this.createGauge({
      name: 'activity_included_in_api',
      help: 'Boolean value 1 when this project is included in activity api response',
      labelNames: ['project'],
    })

    this.activityConfig = this.createGauge({
      name: 'activity_config',
      help: 'Activity config info',
      labelNames: [
        'project',
        'scheduleIntervalMs',
        'batchSize',
        'uncertaintyBuffer',
      ],
    })

    this.tvlHistogram = this.createHistogram({
      name: 'tvl_sync_duration_histogram',
      help: 'Histogram showing TVL sync duration',
      buckets: [0.25, 0.5, 1, 2.5, 5, 10, 25, 50],
      labelNames: ['updater'],
    })
  }

  forTvl(updater: object) {
    return {
      histogram: this.tvlHistogram,
      labels: { updater: updater.constructor.name },
    }
  }

  collectDefaultMetrics(): void {
    collectDefaultMetrics()
  }

  async getMetrics(): Promise<string> {
    // we could also not use the global register, but that doesn't matter so much
    return await register.metrics()
  }

  createCounter<T extends string>(
    configuration: CounterConfiguration<T>,
  ): Counter<T> {
    return new Counter<T>(configuration)
  }

  createGauge<T extends string>(
    configuration: GaugeConfiguration<T>,
  ): Gauge<T> {
    return new Gauge<T>(configuration)
  }

  createHistogram<T extends string>(
    configuration: HistogramConfiguration<T>,
  ): Histogram<T> {
    return new Histogram<T>(configuration)
  }

  createSummary<T extends string>(
    configuration: SummaryConfiguration<T>,
  ): Summary<T> {
    return new Summary<T>(configuration)
  }
}
