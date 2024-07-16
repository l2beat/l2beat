import { format } from 'prettier'

export async function toPrettyJson(value: unknown): Promise<string> {
  const ugly = JSON.stringify(value)
  return await format(ugly, { parser: 'json' })
}
