import type { Histogram, LabelValues } from 'prom-client'

export interface Metrics<T extends string> {
  histogram: Histogram<T>
  labels: LabelValues<T>
}

export function wrapAndMeasure<T extends unknown[], U, S extends string>(
  fn: (...args: T) => Promise<U>,
  { histogram, labels }: Metrics<S>,
): (...args: T) => Promise<U> {
  return async (...args: T) => {
    const done = histogram.startTimer(labels)
    const result = await fn(...args)
    done(labels)
    return result
  }
}
