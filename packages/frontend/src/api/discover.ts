import { SimpleNode } from './SimpleNode'
import { transformContracts } from './transform'
import { ProjectParameters } from './types'

export async function discover(
  address: string,
  maxDepth = 0,
): Promise<SimpleNode[]> {
  console.log('Loading: ', address)

  const res = await fetch(`/api/discover/${address}?maxDepth=${maxDepth}`)
  if (!res.ok) {
    return []
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const discovery: ProjectParameters = await res.json()
  return transformContracts(discovery)
}
