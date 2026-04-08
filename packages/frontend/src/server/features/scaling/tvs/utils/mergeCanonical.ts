/**
 * Same shape as `T` but with `customCanonical` removed and `canonical` holding
 * `canonical + customCanonical` from the input.
 */
export type MergedCanonical<
  T extends { canonical: number; customCanonical: number },
> = Omit<T, 'canonical' | 'customCanonical'> & { canonical: number }

export function mergeCanonical<
  T extends { canonical: number; customCanonical: number },
>(value: T): MergedCanonical<T> {
  const { canonical, customCanonical, ...rest } = value
  return {
    ...rest,
    canonical: canonical + customCanonical,
  }
}
