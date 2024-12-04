// https://vike.dev/data
export { data }
export type Data = Awaited<ReturnType<typeof data>>
import { layer2s } from '@l2beat/config'
import type { PageContextServer } from 'vike/types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const data = async (pageContext: PageContextServer) => {
  const layer2Ids = layer2s.map((p) => p.id)
  return layer2Ids
}
