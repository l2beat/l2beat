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
  init() {
    collectDefaultMetrics()
  }

  async getMetrics() {
    // we could also not use the global register, but that doesn't matter so much
    return await register.metrics()
  }

  createCounter(configuration: CounterConfiguration<string>) {
    return new Counter(configuration)
  }

  createGauge(configuration: GaugeConfiguration<string>) {
    return new Gauge(configuration)
  }

  createHistogram(configuration: HistogramConfiguration<string>) {
    return new Histogram(configuration)
  }

  createSummary(configuration: SummaryConfiguration<string>) {
    return new Summary(configuration)
  }
}
