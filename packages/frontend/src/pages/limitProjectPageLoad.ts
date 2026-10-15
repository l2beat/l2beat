import { createLimiter } from '~/utils/createLimiter'

/**
 * Each project page has its own cache entry. The entries fill and expire
 * together, so a crawler or a refill renders dozens of pages at once, each
 * with its own queries. This caps how many render at a time, so they cannot
 * take the whole database pool.
 */
export const limitProjectPageLoad = createLimiter(8)
