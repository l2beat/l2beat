export type IndexerTags = {
  /** This one is needed to properly tag the indexer state record.
   * This is not only used for logging.
   * Set it to unique value among indexers of the same type.
   */
  tag: string
  feature?: string
  chain?: string
  project?: string
}
