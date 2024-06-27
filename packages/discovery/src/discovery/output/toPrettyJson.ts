import { format, resolveConfig } from 'prettier'

export async function toPrettyJson(value: unknown): Promise<string> {
  const ugly = JSON.stringify(value, convertSetToSortedArray, 2)
  const options = await resolveConfig(process.cwd())
  return format(ugly, {
    parser: 'json',
    ...options,
  })
}

function convertSetToSortedArray(_key: string, value: unknown) {
  if (value instanceof Set) {
    return Array.from(value).sort()
  }
  return value
}
