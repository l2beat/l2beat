import { format, resolveConfig } from 'prettier'

export async function toPrettyJson(value: unknown): Promise<string> {
  const ugly = JSON.stringify(value, null, 2)
  const options = await resolveConfig(process.cwd())
  return format(ugly, {
    parser: 'json',
    ...options,
  })
}
