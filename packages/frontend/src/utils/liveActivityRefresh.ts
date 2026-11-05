/**
 * How often Ethereum's own surfaces refetch its activity. The backend
 * follows the chain every slot (12 s), so faster would mostly refetch the
 * same block
 */
export const LIVE_ACTIVITY_REFRESH_MS = 15 * 1000
