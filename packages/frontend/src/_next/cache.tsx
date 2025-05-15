// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => Promise<any>

export function unstable_cache<T extends Callback>(
  cb: T,
  _?: string[],
  __?: unknown,
): T {
  return cb
}
