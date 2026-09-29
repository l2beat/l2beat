export interface BurstSchedule {
  /** Seconds at which each particle first sets off */
  begins: number[]
  /** Seconds after which every particle sets off again */
  cycleDuration: number
  /** Share of the cycle a particle spends travelling. It waits out the rest */
  travelShare: number
}

// Gap between the particles of one burst, so it reads as a short train
// rather than as a single dot
const BURST_STAGGER_S = 0.08

/**
 * Times the particles of a flow.
 *
 * On average `exactCount` of them are on screen, so they set off at a rate
 * of `exactCount / travelDuration` a second. That rate is kept exact
 * whatever the burst size: the count is rounded up to whole particles and
 * the cycle is stretched to match.
 *
 * With a burst size of one the particles are evenly spaced. With a larger
 * one they leave in groups of that size, and the gap between groups grows
 * by as much, so a flow that moves a lot at once but seldom looks different
 * from one that moves a little all the time.
 */
export function getBurstSchedule(
  exactCount: number,
  travelDuration: number,
  burstSize = 1,
  /** Share of the gap between bursts to wait before the first one, 0 to 1 */
  phase = 0,
): BurstSchedule {
  const perBurst = Math.max(1, Math.round(burstSize))
  // A particle must be back before it sets off again, so the cycle cannot
  // be shorter than the travel
  const bursts = Math.max(1, Math.ceil(exactCount / perBurst))
  const count = bursts * perBurst

  const cycleDuration = (count / exactCount) * travelDuration
  const burstInterval = cycleDuration / bursts
  // Bursts that follow each other closely would overlap, so their
  // particles spread over the whole interval and read as a stream
  const stagger = Math.min(BURST_STAGGER_S, burstInterval / perBurst)

  const begins: number[] = []
  for (let burst = 0; burst < bursts; burst++) {
    for (let i = 0; i < perBurst; i++) {
      begins.push((phase + burst) * burstInterval + i * stagger)
    }
  }

  return { begins, cycleDuration, travelShare: exactCount / count }
}
