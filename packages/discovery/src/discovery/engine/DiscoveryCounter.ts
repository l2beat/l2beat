// In case you'd like to run discovery 'concurrently'

export interface DiscoveryCounter {
  /**
   * Get the current count of discovered objects
   */
  getCount(): number

  /**
   * Increment the count and return the new value
   */
  increment(): number

  /**
   * Reset the count to zero
   */
  reset(): void
}

export class SimpleDiscoveryCounter implements DiscoveryCounter {
  private count = 0

  getCount(): number {
    return this.count
  }

  increment(): number {
    return ++this.count
  }

  reset(): void {
    this.count = 0
  }
}
