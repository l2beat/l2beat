import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'

export interface DescendantIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {}

export class DescendantIndexer extends ManagedChildIndexer {
  constructor(private readonly $: DescendantIndexerDeps) {
    const logger = $.logger.tag($.tag)
    const name = 'descendant_indexer'
    super({ ...$, name, logger })
  }

  override async update(_from: number, to: number): Promise<number> {
    return await Promise.resolve(to)
  }

  override async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }
}
