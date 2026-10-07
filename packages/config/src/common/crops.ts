/**
 * Shared CROPS wording, so identical claims read identically everywhere. The
 * license claim is generated from the OSI list instead - see `license`.
 */
export const CROP_NOTES = {
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
