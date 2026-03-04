import '../../src/dotenv'

/*
 * Hot cache functions
 *
 * This is a list of functions that are used to warm up the cache.
 * It is used in CI to warm up the cache before server starts.
 * Also, it is used on production server each 30 minute of every hour.
 * Do not add new functions here without a good reason.
 * I.e. getScalingTvsData is a database heavy function resulting in >3s of execution time.
 */
export const hotCacheFns: Record<string, () => Promise<unknown>> = {}
