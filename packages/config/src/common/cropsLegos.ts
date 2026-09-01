/**
 * Shared CROPS wording. Reuse these instead of re-writing the same snippet in
 * every project, so identical claims read identically everywhere.
 *
 * The license claim is not here: a project declares `license` on its Open
 * source crop and the sentence is generated from the OSI list, so the id and
 * the prose can never disagree.
 */
export const CROPS_LEGOS = {
  passesWalkawayTest: (detail?: string) =>
    detail
      ? `Passes the walkaway test: ${detail}`
      : 'Passes the walkaway test.',
  infiniteExitWindow:
    'The core contracts are immutable, cannot be paused, and have no upgrade path, so the exit window is infinite.',
  notReviewed: {
    circuitBreakers: 'Circuit breakers and rate limits.',
    quantumSafety: 'Quantum safety.',
  },
}
