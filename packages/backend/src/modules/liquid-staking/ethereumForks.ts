/** First slot of Electra (epoch 364032), which added the pending deposit queue. */
export const ELECTRA_SLOT = 364032 * 32

/**
 * The index of the first deposit after Electra. Earlier deposits were
 * credited 7 to 14 hours late, in index order; from this one on, each is
 * credited in its own block.
 */
export const DEPOSIT_REQUESTS_START_INDEX = 2_045_126

/**
 * Capella to Fulu: 12-second slots, and builders paying proposers on the
 * execution layer, as the Dune query and the deposit search assume. ePBS
 * (Gloas) moves that payment to the consensus layer, so a day in a later fork
 * fails instead of being stored without it.
 */
export const SUPPORTED_FORK_VERSIONS = [
  '0x03000000',
  '0x04000000',
  '0x05000000',
  '0x06000000',
]
