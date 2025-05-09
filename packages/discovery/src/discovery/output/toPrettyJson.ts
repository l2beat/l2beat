import * as parserBabel from 'prettier/plugins/babel'
import * as parserEstree from 'prettier/plugins/estree'
import { format } from 'prettier/standalone'

export async function toPrettyJson(value: unknown): Promise<string> {
  const ugly = JSON.stringify(value)
  return await format(ugly, {
    parser: 'json',
    plugins: [parserBabel, parserEstree],
  })
}
