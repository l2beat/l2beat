export class NestedDict<T = unknown> {
  constructor(
    public data: Record<string, Record<string, T | undefined> | undefined>,
  ) {}

  get(a: string, b: string) {
    return this.data[a]?.[b]
  }

  has(a: string, b: string) {
    const module = this.data[a]
    if (!module) {
      return false
    }
    return Object.prototype.hasOwnProperty.call(module, b)
  }

  set(a: string, b: string, value: T) {
    const module = this.data[a]
    if (!module) {
      this.data[a] = { [b]: value }
    } else {
      module[b] = value
    }
  }
}
