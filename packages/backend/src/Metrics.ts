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

export class Metrics {
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
