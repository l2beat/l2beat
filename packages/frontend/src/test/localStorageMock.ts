export class LocalStorageMock implements Storage {
  private readonly store: Map<string, string>

  constructor() {
    this.store = new Map()
  }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }

  get length(): number {
    return Object.keys(this.store).length
  }
}
