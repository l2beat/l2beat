/**
 * Which chains a flows number covers. The flows views start on a subset of
 * chains, so a number from them can differ from an all-chains one elsewhere.
 */
export function describeChainScope(selected: number, all: number): string {
  return selected >= all ? 'All chains' : `${selected} of ${all} chains`
}
