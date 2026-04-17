export const MAX_SELECTED_CHAINS = 15
export const MIN_SELECTED_CHAINS = 2
export const MIN_SELECTED_PROTOCOLS = 1

// Base particle value — each particle starts at 50 USD of volume per second
export const DOLLARS_PER_PARTICLE = 50
// Step size when increasing particle value to satisfy constraints
export const DOLLARS_PER_PARTICLE_STEP = 25
// Travel time (seconds) for the longest path — shorter paths take proportionally less
export const BASE_DURATION_S = 6
// Per-flow upper bound to avoid excessive DOM nodes
export const MAX_PARTICLES_PER_FLOW = 60
// Global upper bound — if exceeded, all counts are scaled down proportionally
export const MAX_TOTAL_PARTICLES = 700
