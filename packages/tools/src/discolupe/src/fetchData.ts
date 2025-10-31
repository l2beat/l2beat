import { DiscoLupeModel } from './model'

export async function fetchData() {
  const req = await fetch('https://fe-stag.l2beat.com/api/discolupe')

  const result = await req.json()
  const parsed = DiscoLupeModel.parse(result)
  if (!parsed.success) {
    throw new Error('expected it to succeed')
  }

  return parsed
}
