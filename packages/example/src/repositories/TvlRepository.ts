export class TvlRepository {
  private lastSynced: number | undefined = undefined

  async getLastSynced(): Promise<number | undefined> {
    return Promise.resolve(this.lastSynced)
  }

  async setLastSynced(lastSynced: number): Promise<void> {
    this.lastSynced = lastSynced
    return Promise.resolve()
  }
}
