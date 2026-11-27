import type { ApplicationModule, ModuleDependencies } from '../types'

export function createChainHeadModule({
  chainHeads,
}: ModuleDependencies): ApplicationModule | undefined {
  const heads = chainHeads.all()
  // Only created when another module reads a chain at its head
  if (heads.length === 0) return

  return {
    start: async () => {
      await Promise.all(heads.map((head) => head.start()))
    },
  }
}
