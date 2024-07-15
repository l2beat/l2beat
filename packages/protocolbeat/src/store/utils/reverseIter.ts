export function* reverseIter<T>(array: readonly T[]) {
  for (let i = array.length - 1; i >= 0; i--) {
    yield array[i] as T
  }
}
