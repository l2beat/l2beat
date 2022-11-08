const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function waitUntilDefined<T>(
  getResult: () => T | undefined,
  intervalMs = 100,
): Promise<T> {
  let result = getResult()
  while (result === undefined) {
    await sleep(intervalMs)
    result = getResult()
  }
  return result
}
