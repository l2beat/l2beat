export const MAX_SELECTED_CHAINS = 15
export const MIN_SELECTED_CHAINS = 2
export const MIN_SELECTED_PROTOCOLS = 1

// Each particle represents 50 USD of volume
export const DOLLARS_PER_PARTICLE = 50
// Base travel time for a particle to cross the full path
export const BASE_DURATION_S = 5
// Per-flow upper bound to avoid excessive DOM nodes
export const MAX_PARTICLES_PER_FLOW = 50
// Global upper bound — if exceeded, all counts are scaled down proportionally
export const MAX_TOTAL_PARTICLES = 700
// Flows below this fraction of the max volume are hidden to reduce visual noise
export const VOLUME_THRESHOLD_RATIO = 0.001
