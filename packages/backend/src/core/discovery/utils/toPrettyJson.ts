import { format, resolveConfig } from 'prettier'

export async function toPrettyJson(value: unknown) {
  const ugly = JSON.stringify(value, null, 2)
  const options = await resolveConfig(process.cwd())
  return format(ugly, {
    parser: 'json',
    ...options,
  })
}
