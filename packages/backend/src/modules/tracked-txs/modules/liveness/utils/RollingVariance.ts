import sum from 'lodash/sum'

export class RunningStatistics {
  private count = 0
  private mean = 0
  private m2 = 0

  constructor(values: number[]) {
    this.count = values.length
    this.mean = sum(values) / this.count
    this.m2 = sum(values.map((value) => Math.pow(value - this.mean, 2)))
  }

  addValue(value: number): void {
    this.count++
    const delta = value - this.mean
    this.mean += delta / this.count
    const delta2 = value - this.mean
    this.m2 += delta * delta2
  }

  removeValue(value: number): void {
    if (this.count === 0) {
      throw new Error('No values to remove.')
    }

    this.count--

    const delta = value - this.mean
    this.mean -= delta / this.count
    const delta2 = value - this.mean
    this.m2 -= delta * delta2
  }

  getMean(): number {
    return this.mean
  }

  getVariance(): number {
    if (this.count < 2) {
      return Number.NaN // variance is undefined with less than two values
    }
    return this.m2 / this.count
  }

  getStandardDeviation(): number {
    return Math.sqrt(this.getVariance())
  }

  getCount(): number {
    return this.count
  }
}

// function variance(array: number[], avg: number) {
//   return sum(array.map((i) => Math.pow(i - avg, 2))) / array.length
// }
