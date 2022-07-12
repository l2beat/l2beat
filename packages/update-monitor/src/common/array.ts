export async function readArray<T>(
  callback: (index: number) => Promise<T>,
): Promise<T[]> {
  let shouldContinue = true
  const result: T[] = []
  for (let i = 0; shouldContinue; ++i) {
    try {
      const value = await callback(i)
      result.push(value)
    } catch (e) {
      if (e instanceof Error && e.message.includes('invalid opcode: INVALID')) {
        shouldContinue = false
      } else {
        throw e
      }
    }
  }
  return result
}
