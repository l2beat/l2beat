import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'

export interface DescendantIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {}

export class DescendantIndexer extends ManagedChildIndexer {
  constructor(private readonly $: DescendantIndexerDeps) {
    super({
      ...$,
      name: 'descendant_indexer',
    })
  }

  override async update(_from: number, to: number): Promise<number> {
    return await Promise.resolve(to)
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }
}
