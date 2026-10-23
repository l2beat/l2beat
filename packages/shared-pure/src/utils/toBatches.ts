export function toBatches<T>(array: T[], batchSize: number) {
  if (!Number.isSafeInteger(batchSize) || batchSize <= 0) {
    throw new Error('batchSize must be a positive safe integer')
  }
  const batches: T[][] = []
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize))
  }
  return batches
}
