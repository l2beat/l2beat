/** Flattens a comment-json `CommentArray` into a plain array, so that
 * assertions compare elements rather than the array subclass. */
export function toArray<T>(value: T[] | undefined): T[] {
  return value ? Array.from(value) : []
}
