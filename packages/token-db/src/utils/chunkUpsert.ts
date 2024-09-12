/**
 * Chunks an array ensuring that no two elements with the same key are in the same chunk
 * @param array The array to chunk
 * @param keyExtractor A function that extracts a key from an element
 * @param chunkSize The maximum size of each chunk
 * @returns An array of chunks
 */
export function chunkUpsert<T>(
  array: T[],
  keyExtractor: (elem: T) => string,
  chunkSize = 500,
) {
  const completedChunks: T[][] = []
  // Create an array to hold all the chunks
  const chunks: {
    data: T[]
    keys: Set<string>
  }[] = []

  // Iterate through each object in the array
  forLoop: for (const item of array) {
    const key = keyExtractor(item)
    for (const chunk of chunks) {
      if (!chunk.keys.has(key)) {
        chunk.data.push(item)
        chunk.keys.add(key)
        if (chunk.data.length === chunkSize) {
          completedChunks.push(chunk.data)
          chunks.splice(chunks.indexOf(chunk), 1)
        }
        continue forLoop
      }
    }

    chunks.push({
      data: [item],
      keys: new Set([key]),
    })
  }

  completedChunks.push(...chunks.map(({ data }) => data))

  return completedChunks
}
